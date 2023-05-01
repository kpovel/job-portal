import type { NextApiRequest, NextApiResponse } from "next";
import { generateToken, hashPassword } from "~/utils/auth/auth";
import type { User, UserType } from ".prisma/client";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userType, login, password } = req.body as User;

    try {
      const hashedPassword = await hashPassword(password);
      const createdUser = await createUser(userType, login, hashedPassword);
      const token = generateToken(createdUser.id);

      res.status(201).json({
        message: "User created successfully",
        user: createdUser,
        token,
      });
    } catch (error) {
      res.status(400).json({ message: "Error creating user", error });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

async function createUser(userType: UserType, login: string, password: string) {
  const caller = appRouter.createCaller({ prisma });

  switch (userType) {
    case "CANDIDATE":
      return await caller.auth.createCandidate({
        login,
        password,
        userType,
      });
    case "EMPLOYER":
      return await caller.auth.createEmployer({
        login,
        password,
        userType,
      });
    case "ADMIN":
      return await caller.auth.createAdmin({
        login,
        password,
        userType,
      });
  }
}
