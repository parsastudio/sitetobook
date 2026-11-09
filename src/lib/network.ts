import "server-only";

export function getClientIp(headersList: Headers): string {
  const vercelForwarded = headersList.get("x-vercel-forwarded-for");
  if (vercelForwarded) {
    const primaryIp = vercelForwarded.split(",")[0]?.trim();
    if (primaryIp) return primaryIp;
  }

  const cfConnectingIp = headersList.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  const realIp = headersList.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    const primaryIp = forwarded.split(",")[0]?.trim();
    if (primaryIp) return primaryIp;
  }

  return "127.0.0.1";
}
