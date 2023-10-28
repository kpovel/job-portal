import type { GetServerSidePropsContext } from "next";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import { dbClient } from "~/server/db";

export async function adminOnlyAccess(
  context: GetServerSidePropsContext,
): Promise<boolean> {
  const authToken = context.req.cookies[AUTHORIZATION_TOKEN_KEY];
  if (!authToken) {
    return false;
  }

  const verifiedToken = verifyToken(authToken) as VerifyToken | null;
  if (!verifiedToken) {
    return false;
  }

  const admin = await dbClient.execute(
    "select id from User where id = :userId and userType = 'ADMIN';",
    {
      userId: verifiedToken.userId,
    },
  );

  return !!admin.rows.length;
}
