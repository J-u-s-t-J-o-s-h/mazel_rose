import type { StudioRole, StudioSession } from "./types";

export function canEdit(role: StudioRole): boolean {
  return role === "owner" || role === "editor";
}

export function canPublish(role: StudioRole): boolean {
  return role === "owner" || role === "editor";
}

export function canRestore(role: StudioRole): boolean {
  return role === "owner";
}

export function canManageTeam(role: StudioRole): boolean {
  return role === "owner";
}

export function canComment(role: StudioRole): boolean {
  return Boolean(role);
}

export function assertRole(user: StudioSession, allowed: StudioRole[]): void {
  if (!allowed.includes(user.role)) {
    throw new Error("You do not have permission to do that.");
  }
}
