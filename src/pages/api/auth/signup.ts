import type { NextApiRequest, NextApiResponse } from "next";
import { generateToken, hashPassword } from "~/utils/auth/auth";
import type { UserType } from "dbSchema/enums";
import type { User } from "dbSchema/models";
import { dbClient } from "~/server/db";
import { randomUUID } from "crypto";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse,
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
      },
    );

    if (query.rows.length) {
      res
        .status(409)
        .send(
          `User with login "${login}" already exists. Consider using a different login`,
        );
    }

    const hashedPassword = await hashPassword(password);
    const createdUser = await createUser(
      userType as UserType,
      login,
      hashedPassword,
    );

    if (!createdUser) {
      return res.status(401).send("Failed to create a user, please try again");
    }

    const token = generateToken(createdUser.id);
    res.setHeader(
      "Set-Cookie",
      `${AUTHORIZATION_TOKEN_KEY}=${token}; Max-Age=${60 * 60 * 24 * 30}; Path=/`,
    );

    res.status(200).send(redirectLocation(userType));
  } catch (error) {
    res.status(400).send("Error creating user");
  }
}

function redirectLocation(userType: keyof typeof UserType) {
  switch (userType) {
    case "EMPLOYER":
      return "/home/profile";
    case "CANDIDATE":
      return "/my/profile";
    case "ADMIN":
      return "/admin";
  }
}

async function createUser(
  userType: UserType,
  login: string,
  password: string,
): Promise<Pick<User, "id"> | undefined> {
  try {
    const user_uuid = randomUUID();
    const resume_uuid = randomUUID();

    switch (userType) {
      case "CANDIDATE":
        return await createCandidateTransaction(
          login,
          password,
          user_uuid,
          resume_uuid,
        );
      case "EMPLOYER":
        return await createEmployerTransaction(login, password, user_uuid);
      case "ADMIN":
        return await createAdminTransaction(login, password, user_uuid);
    }
  } catch (e) {
    console.log(e);
  }
}

async function createCandidateTransaction(
  login: string,
  password: string,
  user_uuid: string,
  resume_uuid: string,
) {
  const createCandidateQuery = await dbClient.transaction(async (tx) => {
    const queries = [
      await tx.execute(
        "insert into User (user_uuid, login, password, user_type) values (:user_uuid, :login, :password, 'CANDIDATE');",
        {
          user_uuid,
          login,
          password,
        },
      ),
      await tx.execute(
        `\
insert into Candidate (candidate_id)\
select id as candidate_id from User where user_uuid = :user_uuid`,
        {
          user_uuid,
        },
      ),
      await tx.execute(
        `\
insert into Resume (candidate_id, resume_uuid)\
values ((select id as candidate_id from User where user_uuid = :user_uuid), :resume_uuid);`,
        {
          user_uuid,
          resume_uuid,
        },
      ),
      await tx.execute("select id from User where user_uuid = :user_uuid;", {
        user_uuid,
      }),
    ];

    return await Promise.all(queries);
  });

  return createCandidateQuery[3]?.rows[0] as Pick<User, "id">;
}

async function createEmployerTransaction(
  login: string,
  password: string,
  user_uuid: string,
) {
  const createEmployerQuery = await dbClient.transaction(async (tx) => {
    const queries = [
      await tx.execute(
        "insert into User (user_uuid, login, password, user_type) values (:user_uuid, :login, :password, 'EMPLOYER');",
        {
          user_uuid,
          login,
          password,
        },
      ),
      await tx.execute(
        "insert into Employer (employer_id) select id as employer_id from User where user_uuid = :user_uuid;",
        {
          user_uuid,
        },
      ),
      await tx.execute(`select id from User where id = '${user_uuid}'`),
    ];

    return await Promise.all(queries);
  });

  return createEmployerQuery[2]?.rows[0] as Pick<User, "id">;
}

async function createAdminTransaction(
  login: string,
  password: string,
  user_uuid: string,
) {
  const createEmployerQuery = await dbClient.transaction(async (tx) => {
    const queries = [
      await tx.execute(
        "insert into User (user_uuid, login, password, user_type) values (:user_uuid, :login, :password, 'EMPLOYER');",
        {
          user_uuid,
          login,
          password,
        },
      ),
      await tx.execute(`select id from User where id = '${user_uuid}'`),
    ];

    return await Promise.all(queries);
  });

  return createEmployerQuery[1]?.rows[0] as Pick<User, "id">;
}
