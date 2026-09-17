import Image from "next/image";
import { ExternalLink, Mail, Phone } from "lucide-react";
import type { Hotel } from "@/types/content";
import { formatExternalRel } from "@/lib/utils";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <article className="flex h-full flex-col overflow-hidden border border-sage/40 bg-ivory shadow-[var(--shadow-soft)]">
      <div className="relative aspect-[16/10] shrink-0 bg-parchment">
        {hotel.image ? (
          <Image
            src={hotel.image}
            alt={hotel.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-cinnamon">
          {hotel.distance}
        </p>
        <h3 className="mt-2 min-h-[3.5rem] font-serif text-2xl text-wine-black">
          {hotel.name}
        </h3>
        <p className="mt-2 min-h-[2.5rem] text-sm text-charcoal/70">
          {hotel.address}
        </p>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal/80">
          {hotel.description}
        </p>

        <ul className="mt-4 flex min-h-[2rem] flex-wrap gap-2">
          {hotel.amenities.map((amenity) => (
            <li
              key={amenity}
              className="border border-sterling/60 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-charcoal/65"
            >
              {amenity}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          <dl className="space-y-2 text-sm">
            {hotel.groupCode ? (
              <div className="flex justify-between gap-4 border-t border-sterling/40 pt-3">
                <dt className="text-charcoal/55">Group code</dt>
                <dd className="font-medium text-peacock">{hotel.groupCode}</dd>
              </div>
            ) : null}
            {hotel.reservationDeadline ? (
              <div className="flex justify-between gap-4 border-t border-sterling/40 pt-3">
                <dt className="text-charcoal/55">Book by</dt>
                <dd className="text-right text-charcoal/80">
                  {hotel.reservationDeadline}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-6 flex min-h-[3.5rem] flex-wrap items-start gap-4">
            <a
              href={hotel.bookingUrl}
              target="_blank"
              rel={formatExternalRel(hotel.bookingUrl)}
              className="inline-flex items-center gap-2 border border-burgundy bg-burgundy px-4 py-2 text-xs uppercase tracking-[0.16em] text-ivory transition hover:-translate-y-0.5"
              aria-label={`Book ${hotel.name} (opens in a new tab)`}
            >
              Book stay <ExternalLink className="h-3.5 w-3.5" />
            </a>
            {hotel.phone ? (
              <a
                href={`tel:${hotel.phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-2 text-sm text-peacock transition hover:text-burgundy"
              >
                <Phone className="h-4 w-4" />
                {hotel.phone}
              </a>
            ) : null}
            {hotel.contactEmail ? (
              <a
                href={`mailto:${hotel.contactEmail}`}
                className="inline-flex items-center gap-2 text-sm text-peacock transition hover:text-burgundy"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span>
                  {hotel.contactName ? (
                    <>
                      {hotel.contactName}
                      <span className="block text-xs text-charcoal/60">
                        {hotel.contactEmail}
                      </span>
                    </>
                  ) : (
                    hotel.contactEmail
                  )}
                </span>
              </a>
            ) : null}
          </div>
        </div>

        {hotel.isPlaceholder ? (
          <p className="mt-4 text-xs uppercase tracking-[0.14em] text-charcoal/45">
            Placeholder hotel details
          </p>
        ) : null}
      </div>
    </article>
  );
}
