import type { GetServerSidePropsContext } from "next";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export async function adminOnlyAccess(
  context: GetServerSidePropsContext
): Promise<boolean> {
  const authToken = context.req.cookies[AUTHORIZATION_TOKEN_KEY] || "";
  const verifiedToken = verifyToken(authToken) as VerifyToken | null;

  if (!verifiedToken) {
    return false;
  }

  const caller = appRouter.createCaller({ prisma });
  const admin = await caller.admin.findAdminById({
    adminId: verifiedToken.userId,
  });
  const isValidAdmin = admin && admin.userType === "ADMIN";

  return !!isValidAdmin;
}
