import { randomUUID } from "crypto";
import type { UserType } from "~/utils/dbSchema/enums";
import type { User } from "~/utils/dbSchema/models";

export async function createUser(
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
