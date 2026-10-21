import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const start = Date.now();
  let dbStatus = "unconfigured";

  if (db) {
    try {
      await db.execute(sql`SELECT 1`);
      dbStatus = "healthy";
    } catch {
      dbStatus = "unreachable";
    }
  }

  const latency = Date.now() - start;
  const memory = process.memoryUsage();

  return NextResponse.json(
    {
      status: dbStatus === "unreachable" ? "degraded" : "healthy",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: dbStatus,
      latencyMs: latency,
      environment: process.env.NODE_ENV || "development",
      memory: {
        rssMb: Math.round(memory.rss / (1024 * 1024)),
        heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
      },
    },
    {
      status: dbStatus === "unreachable" ? 503 : 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
