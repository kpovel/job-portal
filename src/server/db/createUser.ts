import { randomUUID } from "crypto";
import type { User, UserType } from "./types/schema";
import { dbClient } from ".";
import type { Result } from "~/utils/result";

export async function createUser(
  userType: Exclude<UserType["type"], "ADMIN">,
  login: string,
  password: string,
): Promise<Result<Pick<User, "id">, string>> {
  try {
    const user_uuid = randomUUID();
    const resume_uuid = randomUUID();

    if (userType === "CANDIDATE") {
      return await createCandidateTransaction(
        login,
        password,
        user_uuid,
        resume_uuid,
      );
    }

    if (userType === "EMPLOYER") {
      return await createEmployerTransaction(login, password, user_uuid);
    }

    return {
      err: "Wront user type",
      ok: null,
    };
  } catch (e) {
    return {
      err: "Catched an error, please try again later",
      ok: null,
    };
  }
}

async function createCandidateTransaction(
  login: string,
  password: string,
  user_uuid: string,
  resume_uuid: string,
): Promise<Result<Pick<User, "id">, string>> {
  const userTypeQuery = await dbClient.execute(
    "select id from user_type where type = 'CANDIDATE';",
  );
  const userType = userTypeQuery.rows[0] as { id: UserType["id"] } | undefined;

  if (!userType) {
    return {
      ok: null,
      err: "Cannot find CANDIDATE user type",
    };
  }

  const moderationStatus = await defaultModerationStatus();
  if (moderationStatus.err !== null) {
    return {
      ok: null,
      err: moderationStatus.err,
    };
  }

  const createCandidateQuery = await dbClient.batch(
    [
      {
        sql: `\
insert into user (user_uuid, login, password, user_type_id)\
values (:user_uuid, :login, :password, :user_type_id);`,
        args: {
          user_uuid,
          login,
          password,
          user_type_id: userType.id,
        },
      },
      {
        sql: `\
insert into Candidate (id)\
select id from User where user_uuid = :user_uuid;`,
        args: { user_uuid },
      },
      {
        sql: `\
insert into Resume (candidate_id, resume_uuid, moderation_status_id)\
values ((select id as candidate_id from User where user_uuid = :user_uuid), :resume_uuid, :moderation_status_id);`,
        args: {
          user_uuid,
          resume_uuid,
          moderation_status_id: moderationStatus.ok,
        },
      },
      {
        sql: "select id from User where user_uuid = :user_uuid;",
        args: { user_uuid },
      },
    ],
    "write",
  );

  const insertedId = createCandidateQuery[3]?.rows[0] as
    | Pick<User, "id">
    | undefined;

  if (!insertedId) {
    return {
      ok: null,
      err: "Something went wrong, user id is not inserted",
    };
  }

  return {
    ok: {
      id: insertedId.id,
    },
    err: null,
  };
}

async function createEmployerTransaction(
  login: string,
  password: string,
  user_uuid: string,
): Promise<Result<Pick<User, "id">, string>> {
  const userTypeQuery = await dbClient.execute(
    "select id from user_type where type = 'EMPLOYER';",
  );

  const userType = userTypeQuery.rows[0] as { id: UserType["id"] } | undefined;
  if (!userType) {
    return {
      ok: null,
      err: "Cannot find CANDIDATE user type",
    };
  }

  const createEmployerQuery = await dbClient.batch(
    [
      {
        sql: "\
insert into User (user_uuid, login, password, user_type_id)\
values (:user_uuid, :login, :password, :user_type_id);",
        args: {
          user_uuid,
          login,
          password,
          user_type_id: userType.id,
        },
      },
      {
        sql: "\
insert into Employer (id)\
select id from User where user_uuid = :user_uuid;",
        args: {
          user_uuid,
        },
      },
      {
        sql: "select id from User where user_uuid = :user_uuid;",
        args: { user_uuid },
      },
    ],
    "write",
  );

  const insertedId = createEmployerQuery[2]?.rows[0] as
    | Pick<User, "id">
    | undefined;

  if (!insertedId) {
    return {
      ok: null,
      err: "Something went wrong, user id is not inserted",
    };
  }

  return {
    ok: {
      id: insertedId.id,
    },
    err: null,
  };
}

async function defaultModerationStatus(): Promise<Result<number, string>> {
  const query = await dbClient.execute(
    "select id from status_type where status = 'PENDING';",
  );
  const defaultStatus = query.rows[0] as { id: number } | undefined;

  if (!defaultStatus) {
    return {
      ok: null,
      err: "",
    };
  }

  return {
    ok: defaultStatus.id,
    err: null,
  };
}
