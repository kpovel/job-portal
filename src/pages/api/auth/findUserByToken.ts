import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { verifyToken } from "~/utils/auth/auth";
import { type VerifyToken } from "~/utils/auth/withoutAuth";

export default async function findUserByToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { authToken } = req.body as { authToken: string };

    try {
      const verifiedToken = verifyToken(authToken) as VerifyToken;

      if (!verifiedToken) {
        res.status(401).json({ message: "Invalid token key" });
      }

      const caller = appRouter.createCaller({ prisma });
      const authorizedUser = await caller.auth.findUserById({
        id: verifiedToken.userId,
      });

      if (!authorizedUser) {
        res.status(404).json({ message: "User is not find" });
      }

      res
        .status(200)
        .json({ message: "Successful token validation", authorizedUser });
    } catch (error) {
      res.status(400).json({ message: "Error token validation", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
