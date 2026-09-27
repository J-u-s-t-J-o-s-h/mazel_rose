import { Button } from "@/components/ui/Button";
import { formatExternalRel } from "@/lib/utils";

const DONATE_URL =
  "https://www.centralfloridazoo.org/sloths-at-the-central-florida-zoo/";

export function PayItForwardNote() {
  return (
    <div className="mx-auto max-w-xl px-2 text-center text-wine-black">
      <StarOfDavid />
      <p className="mt-4 font-script text-5xl text-burgundy sm:text-6xl">Pay It Forward</p>
      <p className="mt-3 text-xs uppercase tracking-[0.28em] text-burgundy">With gratitude</p>
      <HeartRule className="mt-6" />
      <p lang="he" dir="rtl" className="mt-6 font-serif text-3xl tracking-wide text-peacock">
        הכרת הטוב
      </p>
      <p className="mt-2 font-serif text-lg italic text-peacock">
        Hakarat HaTov — Recognizing the Good
      </p>
      <HeartRule className="mt-6" />
      <p className="mx-auto mt-8 max-w-sm font-serif text-2xl leading-snug text-wine-black">
        Your presence is truly the greatest gift.
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

function StarOfDavid() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="mx-auto h-9 w-9 text-brass"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M32 6 56 48H8L32 6Z" />
      <path d="m32 58 24-42H8l24 42Z" />
    </svg>
  );
}

function HeartRule({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-brass ${className ?? ""}`} aria-hidden="true">
      <span className="h-px w-14 bg-brass sm:w-20" />
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
        <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
      </svg>
      <span className="h-px w-14 bg-brass sm:w-20" />
    </div>
  );
}
