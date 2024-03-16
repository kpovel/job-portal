import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import type { StatusType } from "~/server/db/types/schema";
import { verifyToken } from "~/utils/auth/auth";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import type { VerifyToken } from "~/utils/auth/withoutAuth";

export default async function findResponsesByCandidate(
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
    const { vacancyUUID } = req.body as { vacancyUUID: string };

    const candidateResponses = await dbClient.execute({
      sql: "\
select id \
from response \
where candidate_id = :candidate_id\
  and vacancy_id = (select id from vacancy where vacancy_uuid = :vacancy_uuid)\
  and response_by_user_type_id = (select id from user_type where type = 'CANDIDATE')\
limit 1;",
      args: {
        candidate_id: verifiedToken.userId,
        vacancy_uuid: vacancyUUID,
      },
    });

    const candidateModerationStatus = await dbClient.execute({
      sql: "\
select status \
from resume\
         inner join status_type st on resume.moderation_status_id = st.id \
where candidate_id = :candidate_id;",
      args: {
        candidate_id: verifiedToken.userId,
      },
    });

    const moderationStatus = candidateModerationStatus.rows[0] as
      | {
          status: StatusType["status"];
        }
      | undefined;

    res.status(200).json({
      canSendResponse:
        candidateResponses.rows.length === 0 &&
        moderationStatus?.status === "ACCEPTED",
      resumeModerationStatus: moderationStatus?.status,
    });
  } catch (error) {
    console.error(error);

    res.status(400).send("Failed to find candidate response");
  }
}
