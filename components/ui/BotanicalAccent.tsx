import { cn } from "@/lib/utils";

type BotanicalAccentProps = {
  className?: string;
  tone?: "sage" | "brass" | "burgundy" | "sterling";
};

const stroke = {
  sage: "#8F9B7A",
  brass: "#A47B45",
  burgundy: "#6A1F33",
  sterling: "#B7A6B6",
};

export function BotanicalAccent({
  className,
  tone = "sage",
}: BotanicalAccentProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-16 w-16 opacity-70", className)}
      aria-hidden="true"
    >
      <path
        d="M40 72C40 72 22 54 22 36C22 24 30 16 40 12C50 16 58 24 58 36C58 54 40 72 40 72Z"
        stroke={stroke[tone]}
        strokeWidth="1.2"
      />
      <path
        d="M40 72V12"
        stroke={stroke[tone]}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M40 34C34 30 28 30 24 32"
        stroke={stroke[tone]}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M40 46C46 42 52 42 56 44"
        stroke={stroke[tone]}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
