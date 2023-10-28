import type { NextApiRequest, NextApiResponse } from "next";
import { verifyPassword, generateToken } from "~/utils/auth/auth";
import { dbClient } from "~/server/db";
import type { User } from "dbSchema/models";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  const { login, password } = req.body as { login: string; password: string };

  try {
    const findUserQuery = await dbClient.execute(
      "select * from User where login = :login",
      {
        login,
      },
    );

    const user = findUserQuery.rows[0] as User | undefined;

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password doesn't match" });
    }

    const token = generateToken(user.id);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ message: "Error logging in", error });
  }
}
