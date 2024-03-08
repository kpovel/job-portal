import { createClient } from "@libsql/client";
import { env } from "~/env.mjs";

export const dbClient = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_TOKEN,
});
