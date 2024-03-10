import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import type { VacancyFields } from "~/pages/home/create-vacancy";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import { randomUUID } from "crypto";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
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
      specialty,
      salary,
      duties,
      requirements,
      conditions,
      work_schedule,
      employment,
    } = req.body as VacancyFields;
    const vacancy_uuid = randomUUID();

    const createdVacancy = await dbClient.execute({
      sql: "\
insert into Vacancy (vacancy_uuid,\
                     employer_id,\
                     specialty,\
                     salary,\
                     duties,\
                     requirements,\
                     conditions,\
                     work_schedule,\
                     employment,\
                     moderation_status_id)\
values (:vacancy_uuid,\
        :employer_id,\
        :specialty,\
        :salary,\
        :duties,\
        :requirements,\
        :conditions,\
        :work_schedule,\
        :employment,\
        (select id from status_type where status = 'PENDING'));",
      args: {
        vacancy_uuid,
        employer_id: verifiedToken.userId,
        specialty,
        salary,
        duties,
        requirements,
        conditions,
        work_schedule,
        employment,
      },
    });

    if (!createdVacancy.rowsAffected) {
      res.status(500).send("Vacancy creation error");
    }

    res.status(201).send("");
  } catch (error) {
    console.error(error);
    res.status(400).send("Vacancy creation error");
  }
}
