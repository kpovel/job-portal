import { Client } from "@planetscale/database";
import { env } from "~/env.mjs";

export const dbClient = new Client({
  url: env.DATABASE_URL,
});
