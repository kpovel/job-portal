import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "~/utils/auth/auth";
import { type User } from ".prisma/client";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();

  if (req.method === "POST") {
    const {
      userType,
      lastName,
      firstName,
      middleName,
      age,
      phoneNumber,
      email,
      linkedinLink,
      githubLink,
      telegramLink,
      login,
      password,
    } = req.body as User;

    const hashedPassword = await hashPassword(password);
    try {
      const newUser = await prisma.user.create({
        data: {
          userType,
          lastName,
          firstName,
          middleName,
          age,
          phoneNumber,
          email,
          linkedinLink,
          githubLink,
          telegramLink,
          login,
          password: hashedPassword,
        },
      });
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      res.status(400).json({ message: "Error creating user", error });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
