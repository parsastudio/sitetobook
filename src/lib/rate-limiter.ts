import "server-only";

interface RateLimitRecord {
  attempts: number;
  resetAt: number;
}

const LOCAL_STORE = new Map<string, RateLimitRecord>();

function pruneExpiredRecords(now: number): void {
  for (const [key, value] of LOCAL_STORE.entries()) {
    if (now > value.resetAt) {
      LOCAL_STORE.delete(key);
    }
  }
}

export async function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 10 * 60 * 1000
): Promise<{ allowed: boolean; remaining: number; retryAfterSeconds: number }> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const sanitizedKey = `ratelimit:${key.replace(/[^a-zA-Z0-9_:-]/g, "")}`;
      const expireSeconds = Math.ceil(windowMs / 1000);

      const response = await fetch(`${upstashUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", sanitizedKey],
          ["EXPIRE", sanitizedKey, expireSeconds, "NX"],
          ["TTL", sanitizedKey],
        ]),
        cache: "no-store",
      });

      if (response.ok) {
        const results = (await response.json()) as Array<{ result: number }>;
        const currentCount = results[0]?.result ?? 1;
        const ttl = results[2]?.result ?? expireSeconds;

        if (currentCount > maxAttempts) {
          return {
            allowed: false,
            remaining: 0,
            retryAfterSeconds: Math.max(1, ttl),
          };
        }

        return {
          allowed: true,
          remaining: Math.max(0, maxAttempts - currentCount),
          retryAfterSeconds: 0,
        };
      }
    } catch (error) {
      console.error("Distributed rate limiter error, falling back to local memory:", error);
    }
  }

  const now = Date.now();
  if (LOCAL_STORE.size > 2000) {
    pruneExpiredRecords(now);
  }

  const record = LOCAL_STORE.get(key);

  if (!record || now > record.resetAt) {
    LOCAL_STORE.set(key, { attempts: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, retryAfterSeconds: 0 };
  }

  if (record.attempts >= maxAttempts) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  record.attempts += 1;
  return {
    allowed: true,
    remaining: maxAttempts - record.attempts,
    retryAfterSeconds: 0,
  };
}

export async function resetRateLimit(key: string): Promise<void> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      const sanitizedKey = `ratelimit:${key.replace(/[^a-zA-Z0-9_:-]/g, "")}`;
      await fetch(`${upstashUrl}/del/${sanitizedKey}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
        },
        cache: "no-store",
      });
      return;
    } catch {
      LOCAL_STORE.delete(key);
      return;
    }
  }

  LOCAL_STORE.delete(key);
}
