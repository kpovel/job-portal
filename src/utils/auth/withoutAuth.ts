import { type GetServerSideProps } from "next";
import { type JwtPayload } from "jsonwebtoken";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import { dbClient } from "~/server/db";

export type VerifyToken = JwtPayload & {
  userId: string;
};

export const withoutAuth = (): GetServerSideProps => {
  return async (context) => {
    try {
      const authorizationToken = context.req.cookies[AUTHORIZATION_TOKEN_KEY];

      if (!authorizationToken) {
        return { props: {} };
      }

      const verifiedToken = verifyToken(
        authorizationToken,
      ) as VerifyToken | null;

      const authorizedUser = await dbClient.execute(
        "select id from User where id = :userId;",
        {
          userId: verifiedToken?.userId,
        },
      );

      if (!authorizedUser.rows.length) {
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
