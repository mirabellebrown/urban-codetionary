import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";
import { env } from "@/lib/env";

const globalForDb = globalThis as typeof globalThis & {
  urbanPool?: Pool;
  urbanDb?: ReturnType<typeof drizzle>;
};

function createDatabase() {
  if (!env.databaseEnabled) {
    return { pool: undefined, db: null };
  }

  const ssl =
    env.databaseUrl.includes("localhost") || env.databaseUrl.includes("127.0.0.1")
      ? undefined
      : { rejectUnauthorized: false };

  const pool = new Pool({
    connectionString: env.databaseUrl,
    ssl,
    max: 5,
  });

  return {
    pool,
    db: drizzle(pool, { schema }),
  };
}

const created = createDatabase();

if (!globalForDb.urbanDb && created.db) {
  globalForDb.urbanDb = created.db;
  globalForDb.urbanPool = created.pool;
}

export const db = globalForDb.urbanDb ?? created.db;
