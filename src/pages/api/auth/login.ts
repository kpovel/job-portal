import type { NextApiRequest, NextApiResponse } from "next";
import { verifyPassword, generateToken } from "~/utils/auth/auth";
import type { User } from "@prisma/client";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { login, password } = req.body as User;
    const caller = appRouter.createCaller({ prisma });

    try {
      const user = await caller.auth.findUserByLogin({ login });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await verifyPassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateToken(user.id);
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(400).json({ message: "Error logging in", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
