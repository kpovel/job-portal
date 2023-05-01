import { type GetServerSideProps } from "next";
import { parse as parseCookies } from "cookie";
import { type JwtPayload } from "jsonwebtoken";
import { appRouter } from "~/server/api/root";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import { prisma } from "~/server/db";

type VerifyToken = JwtPayload & {
  userId: string;
};

export const withoutAuth = (): GetServerSideProps => {
  return async (context) => {
    try {
      const parsedCookies = parseCookies(context.req.headers.cookie ?? "");

      const authorizationToken = parsedCookies[AUTHORIZATION_TOKEN_KEY] ?? "";
      const verifiedToken = verifyToken(
        authorizationToken
      ) as VerifyToken | null;
      const caller = appRouter.createCaller({ prisma });

      const isUserAuthorized = await caller.auth.findUserById({
        id: verifiedToken?.userId ?? "",
      });

      if (!isUserAuthorized) {
        return { props: {} };
      }

      return {
        redirect: {
          destination: "/jobs",
          permanent: false,
        },
      };
    } catch (e) {
      console.error("Error in withoutAuth HOF: ", e);
      return { props: {} };
    }
  };
};
