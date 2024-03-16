import { createClient } from "@libsql/client";
import { env } from "~/env.mjs";

function createDbClient() {
  if (env.NODE_ENV === "production") {
    return createClient({
      url: env.DATABASE_URL,
      authToken: env.DATABASE_TOKEN,
    });
  }

  return createClient({
    url: "file:db/dev.db",
  });
}

export const dbClient = createDbClient();
