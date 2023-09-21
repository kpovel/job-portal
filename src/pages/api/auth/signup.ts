import type { NextApiRequest, NextApiResponse } from "next";
import { generateToken, hashPassword } from "~/utils/auth/auth";
import type { UserType } from "dbSchema/userType";
import type { User } from "~/utils/dbSchema/user";
import { dbClient } from "~/server/db";
import { createId } from "@paralleldrive/cuid2";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  const { userType, login, password } = req.body as {
    userType: keyof typeof UserType;
    login: string;
    password: string;
  };

  try {
    const query = await dbClient.execute(
      "select * from User where login = :login",
      {
        login,
      }
    );

    if (query.rows.length) {
      res.status(409).json({
        message: `User with login "${login}" already exists. Consider using a different login`,
      });
    }

    const hashedPassword = await hashPassword(password);
    const createdUser = await createUser(
      userType as UserType,
      login,
      hashedPassword
    );

    const token = generateToken(createdUser.id);

    res.status(201).json({
      message: "User created successfully",
      user: createdUser,
      token,
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
}

async function createUser(
  userType: UserType,
  login: string,
  password: string
): Promise<User> {
  try {
    switch (userType) {
      case "CANDIDATE":
        const executedQuery = await dbClient.transaction(async (tx) => {
          const userId = createId();
          const questionnaireId = createId();

          const queries = [
            await tx.execute(
              `insert into User (id, login, password, userType) values ('${userId}', '${login}', '${password}', 'CANDIDATE');`
            ),
            await tx.execute(
              `insert into Candidate (candidateId) values ('${userId}');`
            ),
            await tx.execute(
              `insert into Questionnaire (questionnaireId, questionnaireType, candidateId) values ('${questionnaireId}', 'RESUME', '${userId}');`
            ),
            await tx.execute(
              `insert into Resume (questionnaireId, candidateId) values ('${questionnaireId}', '${userId}');`
            ),
            await tx.execute(`select * from User where id = '${userId}'`),
          ];

          return await Promise.all(queries);
        });

        return executedQuery[4]?.rows[0] as User;
      case "EMPLOYER":
      // return await caller.auth.createEmployer({
      //   login,
      //   password,
      //   userType,
      // });
      case "ADMIN":
      // return await caller.auth.createAdmin({
      //   login,
      //   password,
      //   userType,
      // });
    }
  } catch (e) {
    console.log(e);
  }
}
