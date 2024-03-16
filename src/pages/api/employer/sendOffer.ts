import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import { verifyToken } from "~/utils/auth/auth";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import type { VerifyToken } from "~/utils/auth/withoutAuth";

export default async function reviewJobOffer(
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

    const { candidateUUID, offerDescription, vacancyId } = req.body as {
      candidateUUID: string;
      offerDescription: string;
      vacancyId: string;
    };

    const employerResponses = await dbClient.execute({
      sql: "\
select id \
from response \
where employer_id = :employer_id\
  and candidate_id = (select id from user where user_uuid = :candidate_uuid)\
  and response_by_user_type_id = (select id as response_by_user_type_id from user_type where type = 'EMPLOYER');",
      args: {
        employer_id: verifiedToken.userId,
        candidate_uuid: candidateUUID,
      },
    });

    if (employerResponses.rows.length) {
      res.status(409).send("You have already made an offer to the user");
    }

    await dbClient.execute({
      sql: "\
insert into response (response_uuid, candidate_id, employer_id, vacancy_id, cover_letter, response_by_user_type_id)\
values (:response_uuid,\
        (select id from user where user_uuid = :candidate_uuid),\
        :employer_id,\
        (select id from vacancy where vacancy_uuid = :vacancy_id),\
        :cover_letter,\
        (select id from user_type where type = 'EMPLOYER'));",
      args: {
        response_uuid: randomUUID(),
        candidate_uuid: candidateUUID,
        employer_id: verifiedToken.userId,
        vacancy_id: vacancyId,
        cover_letter: offerDescription,
      },
    });

    res.status(201).send("");
  } catch (e) {
    console.error(e);
    res.status(400).send("Something went wrong");
  }
}
