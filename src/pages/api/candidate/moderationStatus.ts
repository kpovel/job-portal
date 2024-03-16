import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import type { StatusType } from "~/server/db/types/schema";
import { verifyToken } from "~/utils/auth/auth";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import type { VerifyToken } from "~/utils/auth/withoutAuth";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(405).send("Method not allowed");
  }

  const candidateToken = req.cookies[AUTHORIZATION_TOKEN_KEY];
  if (!candidateToken) {
    res.status(401).send("Authorization cookie not provided");
    return;
  }

  try {
    const verifiedToken = verifyToken(candidateToken) as VerifyToken | null;
    if (!verifiedToken?.userId) {
      res.status(401).send("Invalid token key");
      return;
    }

    const moderationStatusQuery = await dbClient.execute({
      sql: "\
select status \
from resume \
inner join status_type st on resume.moderation_status_id = st.id \
where resume.candidate_id = :candidate_id;",
      args: { candidate_id: verifiedToken.userId },
    });

    const moderationStatus = moderationStatusQuery.rows[0] as
      | Pick<StatusType, "status">
      | undefined;

    if (!moderationStatus) {
      res.status(500).send("Can't access resume moderation status");
      return;
    }

    res.status(200).send(moderationStatus.status);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error of updating resume moderation status");
  }
}
