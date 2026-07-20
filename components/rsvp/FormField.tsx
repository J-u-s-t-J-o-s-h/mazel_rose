import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-xs uppercase tracking-[0.16em] text-charcoal/70"
      >
        {label}
        {required ? <span className="text-burgundy"> *</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-charcoal/55">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-sm text-burgundy" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const fieldClassName =
  "w-full min-h-12 rounded-sm border border-sterling/70 bg-ivory px-4 py-3 text-base text-wine-black outline-none transition placeholder:text-charcoal/40 focus:border-burgundy focus:ring-1 focus:ring-burgundy";

export const choiceClassName =
  "peer sr-only";
