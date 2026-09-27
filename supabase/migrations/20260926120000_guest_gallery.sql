-- Guest gallery submissions. Service role writes. Public roles may only
-- read rows that have been approved. RSVP tables are not touched.

create table if not exists public.guest_gallery_submissions (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  message text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  rejected_at timestamptz,
  upload_token_hash text,
  expected_media jsonb not null default '[]'::jsonb,
  constraint guest_gallery_submissions_status_check
    check (status in ('pending', 'approved', 'rejected')),
  constraint guest_gallery_submissions_name_length_check
    check (char_length(btrim(guest_name)) between 1 and 100),
  constraint guest_gallery_submissions_message_length_check
    check (message is null or char_length(message) <= 1000)
);

create table if not exists public.guest_gallery_media (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.guest_gallery_submissions (id) on delete cascade,
  storage_path text not null,
  media_type text not null,
  mime_type text not null,
  file_size bigint not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint guest_gallery_media_type_check
    check (media_type in ('image', 'video')),
  constraint guest_gallery_media_size_check
    check (file_size > 0),
  constraint guest_gallery_media_sort_check
    check (sort_order >= 0),
  constraint guest_gallery_media_path_unique unique (storage_path)
);

create table if not exists public.guest_gallery_rate_events (
  id bigint generated always as identity primary key,
  key_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists guest_gallery_submissions_status_idx
  on public.guest_gallery_submissions (status);

create index if not exists guest_gallery_submissions_created_at_idx
  on public.guest_gallery_submissions (created_at desc);

create index if not exists guest_gallery_media_submission_id_idx
  on public.guest_gallery_media (submission_id);

create index if not exists guest_gallery_rate_events_key_created_idx
  on public.guest_gallery_rate_events (key_hash, created_at desc);

alter table public.guest_gallery_submissions enable row level security;
alter table public.guest_gallery_media enable row level security;
alter table public.guest_gallery_rate_events enable row level security;

drop policy if exists guest_gallery_public_read_submissions on public.guest_gallery_submissions;
create policy guest_gallery_public_read_submissions
  on public.guest_gallery_submissions
  for select
  to anon, authenticated
  using (status = 'approved');

drop policy if exists guest_gallery_public_read_media on public.guest_gallery_media;
create policy guest_gallery_public_read_media
  on public.guest_gallery_media
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.guest_gallery_submissions as submission
      where submission.id = guest_gallery_media.submission_id
        and submission.status = 'approved'
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'guest-gallery',
  'guest-gallery',
  false,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime']::text[]
)
on conflict (id) do update
set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
