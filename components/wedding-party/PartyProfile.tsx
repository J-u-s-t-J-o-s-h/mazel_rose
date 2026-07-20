import Image from "next/image";
import type { WeddingPartyMember } from "@/types/content";
import { cn } from "@/lib/utils";

export function PartyProfile({
  member,
  index,
}: {
  member: WeddingPartyMember;
  index: number;
}) {
  const reverse = index % 2 === 1;

  return (
    <article
      className={cn(
        "grid items-center gap-8 border border-sterling/40 bg-ivory/60 p-5 sm:p-8 lg:grid-cols-2",
        reverse && "lg:[&>div:first-child]:order-2",
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={member.image}
          alt={member.imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-burgundy">
          {member.role}
        </p>
        <h2 className="mt-3 font-serif text-3xl text-wine-black sm:text-4xl">
          {member.name}
        </h2>
        <p className="mt-2 font-script text-2xl text-cinnamon">
          {member.relationship}
        </p>
        <p className="mt-5 text-base leading-relaxed text-charcoal/80">
          {member.bio}
        </p>
        {member.funFact ? (
          <p className="mt-5 border-l-2 border-sage pl-4 text-sm italic text-charcoal/70">
            Fun fact: {member.funFact}
          </p>
        ) : null}
      </div>
    </article>
  );
}
