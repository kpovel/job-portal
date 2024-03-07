import type { NextApiRequest, NextApiResponse } from "next";
import { verifyPassword, generateToken } from "~/utils/auth/auth";
import { dbClient } from "~/server/db";
import type { User } from "dbSchema/models";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  const { login, password } = req.body as { login: string; password: string };

  try {
    const findUserQuery = await dbClient.execute(
      "select id, password from User where login = :login;",
      {
        login,
      },
    );

    const user = findUserQuery.rows[0] as
      | Pick<User, "id" | "password">
      | undefined;
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid email or password");
    }

    const token = generateToken(user.id);
    res.setHeader(
      "Set-Cookie",
      `${AUTHORIZATION_TOKEN_KEY}=${token}; Max-Age=${60 * 60 * 24 * 30}; Path=/`,
    );
    res.status(200).send("/jobs");
  } catch (error) {
    res.status(400).send("Error logging in");
  }
}
