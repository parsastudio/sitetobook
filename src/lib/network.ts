import "server-only";

export function getClientIp(headersList: Headers): string {
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    const primaryIp = forwarded.split(",")[0]?.trim();
    if (primaryIp) return primaryIp;
  }
  const realIp = headersList.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}
