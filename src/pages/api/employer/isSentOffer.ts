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
    const { candidateUUID } = req.body as { candidateUUID: string };

    const sentOfferQuery = await dbClient.execute({
      sql: "\
with candidate_id AS (select candidate.id\
                      from candidate\
                               inner join user u on u.id = candidate.id\
                      where u.user_uuid = :candidate_uuid)\
\
select count(*)\
from response \
where candidate_id = (select id from candidate_id)\
  and employer_id = :employer_id\
  and response_by_user_type_id = (select id as response_by_user_type_id from user_type where type = 'EMPLOYER');",
      args: { candidateUUID, employer_id: verifiedToken.userId },
    });
    const sentOffers = sentOfferQuery.rows[0] as
      | { "count(*)": number }
      | undefined;

    res.status(200).json({
      isSentOffer: !!sentOffers?.["count(*)"],
    });
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
}
