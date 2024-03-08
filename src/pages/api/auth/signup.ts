import type { NextApiRequest, NextApiResponse } from "next";
import { generateToken, hashPassword } from "~/utils/auth/auth";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { dbClient } from "~/server/db";
import { createUser } from "~/server/db/createUser";
import type { UserType } from "~/server/db/types/schema";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  const { userType, login, password } = req.body as {
    userType: Exclude<UserType["type"], "ADMIN">;
    login: string;
    password: string;
  };

  try {
    const query = await dbClient.execute({
      sql: "select * from User where login = :login",
      args: {
        login,
      },
    });

    if (query.rows.length) {
      res
        .status(409)
        .send(
          `User with login "${login}" already exists. Consider using a different login`,
        );
    }

    const hashedPassword = await hashPassword(password);
    const createdUser = await createUser(userType, login, hashedPassword);

    if (createdUser.err !== null) {
      return res.status(401).send("Failed to create a user, please try again");
    }

    const token = generateToken(createdUser.ok.id);
    res.setHeader(
      "Set-Cookie",
      `${AUTHORIZATION_TOKEN_KEY}=${token}; Max-Age=${60 * 60 * 24 * 30}; Path=/`,
    );

    res.status(200).send(redirectLocation(userType));
  } catch (error) {
    res.status(400).send("Error creating user");
  }
}

function redirectLocation(userType: UserType["type"]) {
  switch (userType) {
    case "EMPLOYER":
      return "/home/profile";
    case "CANDIDATE":
      return "/my/profile";
    case "ADMIN":
      return "/admin";
  }
}
