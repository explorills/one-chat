export function getOneIdApiUrl(): string {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  if (host.includes("localhost") || host.includes("127.0.0.1")) return "http://localhost:3010";
  if (host.startsWith("staging2-all-access")) return "https://api-dev-id.expl.one";
  return "https://api-id.expl.one";
}

export function getLootUrl(): string {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  if (host.includes("localhost") || host.includes("127.0.0.1")) return "http://localhost:3060";
  if (host.startsWith("staging2-all-access")) return "https://api-dev-loot.expl.one";
  return "https://api-loot.expl.one";
}
