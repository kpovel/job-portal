import { useEffect, useState } from "react";
import type { User } from ".prisma/client";
import Cookie from "js-cookie";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";

type SuccessResponse = {
  message: string;
  authorizedUser: User;
};

type ErrorResponse = {
  error: string;
};

const useCurrentUser = (authToken: string | undefined) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    const fetchAuthUser = async () => {
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

        if (response.ok) {
          const { authorizedUser } = (await response.json()) as SuccessResponse;
          setCurrentUser(authorizedUser);
        } else {
          const { error } = (await response.json()) as ErrorResponse;
          console.error(error);
          Cookie.set(AUTHORIZATION_TOKEN_KEY, "");
          setCurrentUser(null);
        }
      } catch (e) {
        console.error(e);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAuthUser();
  }, [authToken]);

  return { currentUser, isLoading };
};

export default useCurrentUser;
