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
    const { moderationStatus, candidateUUID } = req.body as {
      moderationStatus: StatusType["status"];
      candidateUUID: string;
    };

    await dbClient.execute({
      sql: "\
update resume \
set moderation_status_id = (select id from status_type where status = :moderation_status) \
where candidate_id = (select id from user where user_uuid = :candidate_uuid);",
      args: {
        moderation_status: moderationStatus,
        candidate_uuid: candidateUUID,
      },
    });

    res.status(200).send("");
  } catch (error) {
    console.error(error);
    res.status(400).send("Error of updating resume moderation status");
  }
}
