import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import { verifyToken } from "~/utils/auth/auth";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import type { VerifyToken } from "~/utils/auth/withoutAuth";

export default async function responseOnVacancy(
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

    const { vacancyUUID, coverLetter, employerUUID } = req.body as {
      vacancyUUID: string;
      employerUUID: string;
      coverLetter: string;
    };

    await dbClient.execute({
      sql: "\
insert into response (response_uuid, vacancy_id, candidate_id, employer_id, cover_letter,\
                      response_by_user_type_id)\
values (:response_uuid,\
        (select id from vacancy where vacancy_uuid = :vacancy_uuid),\
        :candidate_id,\
        (select employer.id\
         from employer\
                  inner join user on employer.id = user.id\
         where user_uuid = :employer_uuid),\
        :cover_letter,\
        (select id from user_type where type = 'CANDIDATE'));",
      args: {
        response_uuid: randomUUID(),
        vacancy_uuid: vacancyUUID,
        candidate_id: verifiedToken.userId,
        employer_uuid: employerUUID,
        cover_letter: coverLetter,
      },
    });

    res.status(200).send("");
  } catch (error) {
    console.error(error);

    res.status(400).send("Something went wrong");
  }
}
