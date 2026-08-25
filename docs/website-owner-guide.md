# mazel.rose Website Owner Guide

This guide explains how to update the wedding website without touching code.

## Logging in

1. Go to your website and add `/studio` to the end of the address.  
   Example: `https://your-site.com/studio`
2. Sign in with the email and password you were given.  
   (The owner can add people under **Team**. Passwords are not stored in the website code.)
3. You will see a sidebar of website pages written in plain English.

## Editing wedding details

1. Open **Wedding Details**.
2. Choose a section (names, dates, venue, theme, SEO, or announcement).
3. Update the fields. The real website on the right refreshes after you pause typing. Click **Publish** when it looks right.

These details appear in the header, footer, countdown, invitation text, and search/social previews.

## Replacing images

1. Open the page or item that contains the image (for example **Home Page** or a **Gallery** photo).
2. Choose a new photo (keep files at 4 MB or smaller in Studio).
3. Add a short image description for accessibility.
4. Save draft, check the live page on the right, then publish.

Tips:

- Hero images look best as wide photos (about 2400 × 1400 or larger).
- Wedding-party portraits look best as tall photos (about 1200 × 1600 or larger).
- For the gallery, upload the highest-quality originals you have.

## Adding schedule events

1. Open **Schedule**.
2. Click **Add item**.
3. Fill in title, date, times, venue, address, and description.
4. Set **Display order** (lower numbers appear first).
5. Use **Show this on the website** to hide an event without deleting it.
6. Publish.

## Updating hotels

1. Open **Travel → Hotels**.
2. Edit an existing hotel or create a new one.
3. Add booking link, group code, deadline, amenities, and photo.
4. Publish.

## Updating registry links

1. Open **Registry → Registry Links**.
2. Edit the store name, description, and external link.
3. Publish.

## Managing wedding-party members

1. Open **Wedding Party**.
2. Add or edit a person.
3. Upload a portrait, write a short biography, and optional fun fact.
4. Use **Display order** to rearrange the list.
5. Publish.

## Uploading gallery photos

1. Open **Gallery → Photos**.
2. Create a new photo entry for each image.
3. Upload the image, add a caption, and set display order.
4. To temporarily remove a photo from the site, turn off **Show this on the website**.
5. Publish.

## Editing FAQs

1. Open **FAQs → Questions and Answers**.
2. Edit a question and answer, or create a new one.
3. Publish.

## Comments

Open any section and use **Comments** to leave a note for the rest of the team. Comments show the author's name and role. They never appear on the public website.

## Previewing changes

The right side of Studio is the real designed website. Pause typing (or click **Save draft**) and that page refreshes with your unpublished draft.

Guests still see the last published version until you click **Publish**.

Use **Open tab** if you want the preview in a full browser window. If you did that, use **Exit preview** to return to the public view.

## Publishing changes

1. Make your edits.
2. Click **Publish**.
3. Wait a moment — the public website updates automatically.
4. You do **not** need to ask anyone to redeploy the site.

## Restoring a previous version

Owners can open **Versions** at the bottom of a section, then **Restore**. That writes the old version back as a draft. Preview it, then publish.

## Hiding content without deleting it

Turn off **Show this on the website**.

This is useful for:

- Temporary hotel options
- Gallery photos you may want later
- FAQ items still being finalized

## RSVP responses

Guest RSVP answers (names, emails, meal choices, messages) are **not** stored in this editor.

They are saved through the website’s secure RSVP system. If you need the guest list responses, ask your developer for access to that system (for example Airtable or Supabase).

You *can* edit RSVP form wording and options under **RSVP → RSVP Form Settings**.

## What to do if something goes wrong

- If the preview looks wrong, click **Exit preview** and preview again.
- If a page looks empty after editing, confirm you clicked **Publish**.
- If an image looks cropped oddly, try a different crop or a larger original.
- **If you cannot log in**, ask the owner to reset access under **Team**, or ask your developer to check [`docs/studio-setup.md`](./studio-setup.md).
- If the public site still shows old content after a few minutes, contact your developer and mention the revalidation webhook.

## Recommended habit

Edit → Watch the live page on the right → Publish → Check the live page on your phone.
