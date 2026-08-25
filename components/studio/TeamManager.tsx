"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { fieldClassName } from "@/components/rsvp/FormField";
import { FormField } from "@/components/rsvp/FormField";
import {
  createTeamUserAction,
  updateTeamUserAction,
} from "@/lib/studio/actions";
import type { StudioRole, StudioUser } from "@/lib/studio/types";
import { STUDIO_ROLES } from "@/lib/studio/types";

export function TeamManager({
  users,
  currentUserId,
}: {
  users: StudioUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<StudioRole>("editor");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function addUser(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    const result = await createTeamUserAction({ email, name, role, password });
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setEmail("");
    setName("");
    setPassword("");
    setMessage(result.message || "Added.");
    router.refresh();
  }

  return (
    <div className="space-y-10">
      <ul className="divide-y divide-parchment border border-parchment">
        {users.map((user) => (
          <li key={user._id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <div>
              <p className="font-medium text-wine-black">{user.name}</p>
              <p className="text-sm text-charcoal/65">{user.email}</p>
              <p className="text-xs uppercase tracking-[0.14em] text-charcoal/50">
                {user.role}
                {user.active === false ? " · disabled" : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className={fieldClassName}
                value={user.role}
                disabled={user._id === currentUserId}
                onChange={async (event) => {
                  const nextRole = event.target.value as StudioRole;
                  const result = await updateTeamUserAction({
                    userId: user._id,
                    role: nextRole,
                  });
                  if (!result.ok) window.alert(result.error);
                  router.refresh();
                }}
              >
                {STUDIO_ROLES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {user._id !== currentUserId ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={async () => {
                    const result = await updateTeamUserAction({
                      userId: user._id,
                      active: user.active === false,
                    });
                    if (!result.ok) window.alert(result.error);
                    router.refresh();
                  }}
                >
                  {user.active === false ? "Enable" : "Disable"}
                </Button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={addUser} className="max-w-xl space-y-4 border border-parchment bg-ivory p-6">
        <h2 className="font-serif text-2xl">Add a person</h2>
        <p className="text-sm text-charcoal/65">
          Share the password privately. They sign in at /studio/login.
        </p>
        <FormField label="Name" htmlFor="team-name" required>
          <input
            id="team-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClassName}
          />
        </FormField>
        <FormField label="Email" htmlFor="team-email" required>
          <input
            id="team-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClassName}
          />
        </FormField>
        <FormField label="Role" htmlFor="team-role">
          <select
            id="team-role"
            value={role}
            onChange={(event) => setRole(event.target.value as StudioRole)}
            className={fieldClassName}
          >
            {STUDIO_ROLES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          label="Temporary password"
          htmlFor="team-password"
          required
          hint="At least 10 characters. They can change it after signing in."
        >
          <input
            id="team-password"
            type="password"
            required
            minLength={10}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
          {saving ? "Adding…" : "Add person"}
        </Button>
      </form>
    </div>
  );
}
