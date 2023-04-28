import type { NextApiRequest, NextApiResponse } from "next";
import { verifyPassword, generateToken } from "~/utils/auth/auth";
import { type User, PrismaClient } from "@prisma/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const prisma = new PrismaClient();
    const { login, password } = req.body as User;

    try {
      const user = await prisma.user.findUnique({ where: { login: login } });

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
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
