import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import type { Vacancy } from "~/server/db/types/schema";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    res.status(405).send("Method not allowed");
  }

  const employerToken = req.cookies[AUTHORIZATION_TOKEN_KEY];
  if (!employerToken) {
    res.status(401).send("Authorization cookie not provided");
    return;
  }

  try {
    const verifiedToken = verifyToken(employerToken) as VerifyToken | null;
    if (!verifiedToken?.userId) {
      res.status(401).send("Invalid token key");
      return;
    }

    const {
      vacancy_uuid,
      specialty,
      salary,
      duties,
      requirements,
      conditions,
      work_schedule,
      employment,
    } = req.body as Pick<
      Vacancy,
      | "vacancy_uuid"
      | "specialty"
      | "salary"
      | "duties"
      | "requirements"
      | "conditions"
      | "work_schedule"
      | "employment"
    >;

    await dbClient.execute({
      sql: "\
update vacancy \
set specialty            = :specialty,\
    salary               = :salary,\
    duties               = :duties,\
    requirements         = :requirements,\
    conditions           = :conditions,\
    work_schedule        = :work_schedule,\
    employment           = :employment,\
    moderation_status_id = (select id from status_type where status = 'PENDING') \
where vacancy_uuid = :vacancy_uuid;",
      args: {
        specialty,
        salary,
        duties,
        requirements,
        conditions,
        work_schedule,
        employment,
        vacancy_uuid,
      },
    });

    res.status(204).send("");
  } catch (error) {
    console.error(error);
    res.status(400).send("Failed to update vacancy");
  }
}
