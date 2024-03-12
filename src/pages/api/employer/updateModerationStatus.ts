import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import type { StatusType } from "~/server/db/types/schema";
import { verifyToken } from "~/utils/auth/auth";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import type { VerifyToken } from "~/utils/auth/withoutAuth";

export default async function updateModerationStatus(
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

    const admin = await dbClient.execute({
      sql: "\
select id \
from user \
where id = :admin_id\
  and user_type_id = (select id as user_type_id from user_type where type = 'ADMIN');",
      args: {
        admin_id: verifiedToken.userId,
      },
    });

    if (admin.rows.length === 0) {
      res.status(401).send("You are not who you say you are");
    }

    const { vacancyUUID, moderationStatus } = req.body as {
      vacancyUUID: string;
      moderationStatus: StatusType["status"];
    };

    await dbClient.execute({
      sql: "\
update vacancy \
set moderation_status_id =\
            (select id from status_type where status = :moderation_status) \
where vacancy_uuid = :vacancy_uuid;",
      args: {
        moderation_status: moderationStatus,
        vacancy_uuid: vacancyUUID,
      },
    });

    res.status(204).send("");
  } catch (error) {
    console.error(error);

    res.status(400).send("Failed to update moderation status");
  }
}
