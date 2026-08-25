export function sanitizePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return "/";
  }
  return path;
}
