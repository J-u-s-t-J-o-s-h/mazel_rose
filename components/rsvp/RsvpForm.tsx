"use client";

import { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { rsvpSchema, type RsvpFormValues } from "@/lib/rsvp/schema";
import { Button } from "@/components/ui/Button";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { Monogram } from "@/components/ui/Monogram";
import { FormField, fieldClassName } from "@/components/rsvp/FormField";
import { useSite } from "@/components/providers/SiteProvider";
import { cn } from "@/lib/utils";

const defaultMealOptions = [
  { value: "beef", label: "Beef" },
  { value: "chicken", label: "Chicken" },
  { value: "fish", label: "Fish" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "kids", label: "Child meal" },
  { value: "undecided", label: "Still deciding" },
] as const;

const defaultEventOptions = [
  { key: "ceremony", label: "Ceremony" },
  { key: "reception", label: "Reception" },
  { key: "welcome", label: "Welcome gathering" },
  { key: "brunch", label: "Farewell brunch" },
] as const;

export type RsvpFormSettingsProps = {
  formOpen?: boolean;
  closedMessage?: string;
  confirmationHeading?: string;
  confirmationMessage?: string;
  rsvpDeadlineDisplay?: string;
  mealOptions?: Array<{ value: string; label: string }>;
  eventOptions?: Array<{ key: string; label: string }>;
  showDietaryField?: boolean;
  showSongRequestField?: boolean;
  showPhoneField?: boolean;
  showEmailField?: boolean;
  helpMessage?: string;
};

type SubmitState = "idle" | "loading" | "success" | "error";

export function RsvpForm(settings: RsvpFormSettingsProps = {}) {
  const site = useSite();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mealOptions = settings.mealOptions?.length
    ? settings.mealOptions
    : defaultMealOptions;
  const eventOptions = settings.eventOptions?.length
    ? settings.eventOptions
    : defaultEventOptions;
  const deadline =
    settings.rsvpDeadlineDisplay || site.rsvpDeadlineDisplay;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      primaryGuestName: "",
      email: "",
      phone: "",
      invitationCode: "",
      attendance: "attending",
      guests: [],
      events: {
        ceremony: true,
        reception: true,
        welcome: false,
        brunch: false,
      },
      mealChoice: undefined,
      dietaryRestrictions: "",
      songRequest: "",
      message: "",
      website: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guests",
  });

  const attendance = useWatch({ control, name: "attendance" });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to submit RSVP.");
      }

      setSubmitState("success");
      reset();
    } catch (error) {
      setSubmitState("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  });

  if (settings.formOpen === false) {
    return (
      <div className="border border-sterling/60 bg-ivory p-8 text-center shadow-[var(--shadow-soft)] sm:p-12">
        <Monogram tone="brass" />
        <h2 className="mt-5 font-serif text-3xl text-wine-black">RSVP closed</h2>
        <DecorativeDivider className="mt-5" />
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-charcoal/75">
          {settings.closedMessage}
        </p>
        {settings.helpMessage ? (
          <p className="mt-4 text-sm text-peacock">{settings.helpMessage}</p>
        ) : null}
      </div>
    );
  }

  if (submitState === "success") {
    return (
      <div className="border border-brass/40 bg-ivory p-8 text-center shadow-[var(--shadow-soft)] sm:p-12">
        <Monogram tone="brass" />
        <p className="mt-5 font-script text-4xl text-burgundy">Thank you</p>
        <h2 className="mt-3 font-serif text-3xl text-wine-black sm:text-4xl">
          {settings.confirmationHeading || "Your reply has been received"}
        </h2>
        <DecorativeDivider className="mt-5" />
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-charcoal/75 sm:text-base">
          {settings.confirmationMessage ||
            "We are so grateful. We cannot wait to celebrate with you."}
        </p>
        <div className="mt-8">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setSubmitState("idle")}
          >
            Submit another response
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative border border-sterling/60 bg-ivory p-6 shadow-[var(--shadow-soft)] paper-texture sm:p-10"
    >
      <div className="text-center">
        <p className="font-script text-3xl text-burgundy">The Invitation</p>
        <h2 className="mt-2 font-serif text-3xl text-wine-black sm:text-4xl">
          Kindly Respond
        </h2>
        <DecorativeDivider className="mt-5" />
        <p className="mt-4 text-sm text-charcoal/70">
          Please reply by {deadline}
        </p>
      </div>

      {/* Honeypot */}
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="relative mt-10 space-y-8">
        <FormField
          label="Full name"
          htmlFor="primaryGuestName"
          required
          error={errors.primaryGuestName?.message}
        >
          <input
            id="primaryGuestName"
            className={fieldClassName}
            autoComplete="name"
            {...register("primaryGuestName")}
          />
        </FormField>

        <div className="grid gap-6 sm:grid-cols-2">
          {settings.showEmailField !== false ? (
            <FormField
              label="Email"
              htmlFor="email"
              required
              error={errors.email?.message}
            >
              <input
                id="email"
                type="email"
                className={fieldClassName}
                autoComplete="email"
                {...register("email")}
              />
            </FormField>
          ) : null}
          {settings.showPhoneField !== false ? (
            <FormField
              label="Phone"
              htmlFor="phone"
              error={errors.phone?.message}
            >
              <input
                id="phone"
                type="tel"
                className={fieldClassName}
                autoComplete="tel"
                {...register("phone")}
              />
            </FormField>
          ) : null}
        </div>

        <FormField
          label="Invitation code"
          htmlFor="invitationCode"
          hint="Optional — use if provided on your invitation."
          error={errors.invitationCode?.message}
        >
          <input
            id="invitationCode"
            className={fieldClassName}
            {...register("invitationCode")}
          />
        </FormField>

        <fieldset>
          <legend className="mb-3 text-xs uppercase tracking-[0.16em] text-charcoal/70">
            Will you attend? <span className="text-burgundy">*</span>
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["attending", "Joyfully accepts"],
                ["declined", "Regretfully declines"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center justify-center border px-4 py-3 text-sm tracking-[0.08em] transition",
                  attendance === value
                    ? "border-burgundy bg-burgundy text-ivory"
                    : "border-sterling/70 bg-parchment/40 text-wine-black hover:border-peacock",
                )}
              >
                <input
                  type="radio"
                  value={value}
                  className="sr-only"
                  {...register("attendance")}
                />
                {attendance === value ? (
                  <Check className="mr-2 h-4 w-4 text-brass" aria-hidden />
                ) : null}
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {attendance === "attending" ? (
          <>
            <fieldset>
              <legend className="mb-3 text-xs uppercase tracking-[0.16em] text-charcoal/70">
                Events you will attend <span className="text-burgundy">*</span>
              </legend>
              {errors.events?.message || errors.events?.root?.message ? (
                <p className="mb-3 text-sm text-burgundy" role="alert">
                  {errors.events?.message || errors.events?.root?.message}
                </p>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                {eventOptions.map((option) => (
                  <label
                    key={option.key}
                    className="flex min-h-12 cursor-pointer items-center gap-3 border border-sterling/70 bg-parchment/30 px-4 py-3 has-[:checked]:border-peacock has-[:checked]:bg-peacock/5"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-burgundy"
                      {...register(
                        `events.${option.key as "ceremony" | "reception" | "welcome" | "brunch"}`,
                      )}
                    />
                    <span className="text-sm text-wine-black">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-xs uppercase tracking-[0.16em] text-charcoal/70">
                Meal preference <span className="text-burgundy">*</span>
              </legend>
              {errors.mealChoice?.message ? (
                <p className="mb-3 text-sm text-burgundy" role="alert">
                  {errors.mealChoice.message}
                </p>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                {mealOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex min-h-12 cursor-pointer items-center gap-3 border border-sterling/70 px-4 py-3 has-[:checked]:border-burgundy has-[:checked]:bg-burgundy has-[:checked]:text-ivory"
                  >
                    <input
                      type="radio"
                      value={option.value}
                      className="sr-only"
                      {...register("mealChoice")}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {settings.showDietaryField !== false ? (
              <FormField
                label="Dietary restrictions"
                htmlFor="dietaryRestrictions"
                error={errors.dietaryRestrictions?.message}
              >
                <textarea
                  id="dietaryRestrictions"
                  rows={3}
                  className={fieldClassName}
                  {...register("dietaryRestrictions")}
                />
              </FormField>
            ) : null}

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.16em] text-charcoal/70">
                  Additional guests
                </p>
                <button
                  type="button"
                  onClick={() => append({ name: "" })}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-peacock hover:text-burgundy"
                >
                  <Plus className="h-4 w-4" /> Add guest
                </button>
              </div>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid gap-3 border border-sterling/50 p-4 sm:grid-cols-[1fr_auto]"
                  >
                    <FormField
                      label={`Guest ${index + 1} name`}
                      htmlFor={`guests.${index}.name`}
                      error={errors.guests?.[index]?.name?.message}
                    >
                      <input
                        id={`guests.${index}.name`}
                        className={fieldClassName}
                        {...register(`guests.${index}.name`)}
                      />
                    </FormField>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="inline-flex h-12 items-center justify-center gap-2 self-end px-3 text-burgundy hover:text-cinnamon"
                      aria-label={`Remove guest ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {settings.showSongRequestField !== false ? (
              <FormField
                label="Song request"
                htmlFor="songRequest"
                error={errors.songRequest?.message}
              >
                <input
                  id="songRequest"
                  className={fieldClassName}
                  {...register("songRequest")}
                />
              </FormField>
            ) : null}
          </>
        ) : null}

        <FormField
          label="Message to the couple"
          htmlFor="message"
          error={errors.message?.message}
        >
          <textarea
            id="message"
            rows={4}
            className={fieldClassName}
            {...register("message")}
          />
        </FormField>

        {submitState === "error" ? (
          <div
            className="border border-burgundy/40 bg-burgundy/5 px-4 py-3 text-sm text-burgundy"
            role="alert"
          >
            {errorMessage}
            <button
              type="button"
              className="ml-3 underline"
              onClick={() => setSubmitState("idle")}
            >
              Dismiss
            </button>
          </div>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          disabled={isSubmitting || submitState === "loading"}
          aria-busy={isSubmitting || submitState === "loading"}
        >
          {isSubmitting || submitState === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending reply…
            </>
          ) : (
            "Send RSVP"
          )}
        </Button>
      </div>
    </form>
  );
}
