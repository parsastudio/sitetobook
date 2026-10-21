import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

const connectionString = process.env.DATABASE_URL;

// Stateless HTTP Driver with Neon PgBouncer Pooler (immune to connection exhaustion)
export const db = connectionString
  ? drizzle(neon(connectionString), { schema })
  : null;
