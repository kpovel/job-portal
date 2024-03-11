import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import { verifyToken } from "~/utils/auth/auth";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import type { VerifyToken } from "~/utils/auth/withoutAuth";

export default async function getAcceptedVacancies(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
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

    const vacanciesQuery = await dbClient.execute({
      sql: "\
select vacancy_uuid, specialty \
from vacancy \
where employer_id = :employer_id \
  and moderation_status_id = (select id as moderation_status_id from status_type where status = 'ACCEPTED');",
      args: {
        employer_id: verifiedToken.userId,
      },
    });

    res.status(200).json({
      acceptedVacancies: vacanciesQuery.rows,
    });
  } catch (e) {
    console.error(e);
    res.status(400).end("Something went wrong");
  }
}
