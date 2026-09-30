import { Button } from "@/components/ui/Button";
import { formatExternalRel } from "@/lib/utils";

const DONATE_URL =
  "https://www.centralfloridazoo.org/sloths-at-the-central-florida-zoo/";

export function PayItForwardNote() {
  return (
    <div className="mx-auto max-w-xl px-2 text-center text-wine-black">
      <p className="mx-auto mt-8 max-w-sm font-serif text-2xl leading-snug text-wine-black">
        Your presence is truly the greatest gift.
      </p>
      <p className="mx-auto mt-6 max-w-md font-serif text-lg leading-relaxed text-charcoal/80">
        As they began dating, Cary and Tiffany discovered that they share a special love for one
        of nature’s sweetest little creatures…the sloth.
      </p>
      <p className="mx-auto mt-4 max-w-md font-serif text-lg leading-relaxed text-charcoal/80">
        Earlier this year, after an unfortunate situation left many sloths in need, the Central
        Florida Zoo stepped in to provide emergency care and help save as many as possible.
      </p>
      <p className="mx-auto mt-4 max-w-md font-serif text-lg leading-relaxed text-charcoal/80">
        The Zoo is now raising funds to create a permanent habitat for the sloths in their care.
        With gratitude, we invite our family and friends to help us pay it forward by supporting
        that effort.
      </p>
      <p className="mx-auto mt-6 max-w-md font-serif text-lg leading-relaxed text-charcoal/80">
        In place of a traditional registry, we invite those who wish to give to support the
      </p>
      <p className="mx-auto mt-4 max-w-md font-serif text-xl uppercase tracking-[0.14em] text-peacock sm:text-2xl">
        Central Florida Zoo &amp; Botanical Gardens
      </p>
      <p className="mx-auto mt-4 max-w-sm font-serif text-lg italic leading-relaxed text-burgundy">
        in honor of a little creature we both happen to love.
      </p>
      <div className="mt-8">
        <Button
          href={DONATE_URL}
          target="_blank"
          rel={formatExternalRel(DONATE_URL)}
          size="lg"
          className="normal-case tracking-normal"
        >
          Donate
        </Button>
      </div>
    </div>
  );
}
