import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "dark" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-burgundy text-ivory border border-burgundy/90 shadow-[0_8px_24px_rgba(106,31,51,0.2)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] after:absolute after:left-4 after:right-4 after:bottom-2 after:h-px after:bg-brass/70 after:opacity-0 hover:after:opacity-100",
  secondary:
    "bg-transparent text-peacock border border-peacock hover:bg-peacock hover:text-ivory",
  dark: "bg-ivory text-wine-black border border-ivory/80 hover:bg-parchment hover:-translate-y-0.5",
  ghost:
    "bg-transparent text-ivory border border-ivory/40 hover:border-brass hover:text-champagne",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs tracking-[0.16em]",
  md: "px-6 py-3 text-xs tracking-[0.18em]",
  lg: "px-8 py-3.5 text-sm tracking-[0.2em]",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
  } = props;

  const classes = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-sm font-sans font-medium uppercase transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={classes}
        target={props.target}
        rel={props.rel}
      >
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button
      type={buttonProps.type ?? "button"}
      className={classes}
      disabled={buttonProps.disabled}
      onClick={buttonProps.onClick}
      aria-busy={buttonProps["aria-busy"]}
    >
      {children}
    </button>
  );
}
