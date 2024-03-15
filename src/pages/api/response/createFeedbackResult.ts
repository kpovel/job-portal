import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import type { StatusType } from "~/server/db/types/schema";
import { verifyToken } from "~/utils/auth/auth";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import type { VerifyToken } from "~/utils/auth/withoutAuth";

export default async function createFeedbackResult(
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

    const { responseUUID, responseResult, feedbackContent } = req.body as {
          responseUUID: string,
          responseResult: StatusType["status"],
          feedbackContent: string,
    };

    await dbClient.execute({
      sql: "\
insert into feedback_result (feedback_result_uuid, response_id, response, feedback_result_status_id)\
values (:feedback_result_uuid, (select id from response where response_uuid = :response_uuid), :respose,\
        (select id from status_type where status = :status));",
      args: {
        feedback_result_uuid: randomUUID(),
        response_uuid: responseUUID,
        respose: feedbackContent,
        status: responseResult,
      },
    });

    res.status(200).send("");
  } catch (error) {
    console.error(error);

    res.status(400).send("Something went wrong");
  }
}
