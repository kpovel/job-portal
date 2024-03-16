import { useEffect, useState } from "react";
import type { User, UserType } from "~/server/db/types/schema";

export type UserDataClient = Omit<User, "id" | "user_type_id" | "password"> &
  Pick<UserType, "type">;
type SuccessResponse = {
  user: UserDataClient;
};

export default function useCurrentUser(authToken: string | undefined) {
  const [currentUser, setCurrentUser] = useState<UserDataClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAuthUser() {
      if (!authToken) {
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/findUserByToken", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authToken }),
        });

        if (response.status === 200) {
          const json = (await response.json()) as SuccessResponse;
          setCurrentUser(json.user);
          return;
        }

        const error = await response.text();
        console.error(error);
        setCurrentUser(null);
      } catch (e) {
        console.error(e);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchAuthUser();
  }, [authToken]);

  return { currentUser, isLoading };
}
