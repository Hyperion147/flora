import { config } from "dotenv";
import { readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

config({ path: ".env" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

const root = process.cwd();
const migrationFiles = [
  "supabase/migrations/20260623000100_plants_schema_and_rls.sql",
  "supabase/migrations/20260624000100_plant_pid_and_leaderboard.sql",
];

const sql = postgres(databaseUrl, {
  max: 1,
  ssl: "require",
});

try {
  for (const file of migrationFiles) {
    const filePath = path.join(root, file);
    const statement = await readFile(filePath, "utf8");

    console.log(`Applying ${file}...`);
    await sql.unsafe(statement);
  }

  console.log("Supabase schema and RLS policies applied.");
} catch (error) {
  console.error("Failed to apply Supabase SQL.");
  console.error(error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
