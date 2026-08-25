"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClassName } from "@/components/rsvp/FormField";
import { FormField } from "@/components/rsvp/FormField";
import { changePasswordAction } from "@/lib/studio/actions";

export function AccountForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (nextPassword !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setSaving(true);
    const result = await changePasswordAction({ currentPassword, nextPassword });
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCurrentPassword("");
    setNextPassword("");
    setConfirm("");
    setMessage(result.message || "Password updated.");
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
      <FormField label="Current password" htmlFor="current-password" required>
        <input
          id="current-password"
          type="password"
          required
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          className={fieldClassName}
        />
      </FormField>
      <FormField label="New password" htmlFor="next-password" required hint="At least 10 characters.">
        <input
          id="next-password"
          type="password"
          required
          minLength={10}
          value={nextPassword}
          onChange={(event) => setNextPassword(event.target.value)}
          className={fieldClassName}
        />
      </FormField>
      <FormField label="Confirm new password" htmlFor="confirm-password" required>
        <input
          id="confirm-password"
          type="password"
          required
          minLength={10}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          className={fieldClassName}
        />
      </FormField>
      {error ? (
        <p className="text-sm text-burgundy" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-peacock">{message}</p> : null}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Update password"}
      </Button>
    </form>
  );
}
