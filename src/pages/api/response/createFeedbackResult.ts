import { createId } from "@paralleldrive/cuid2";
import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import type { ResponseResult } from "~/utils/dbSchema/enums";

export default async function createFeedbackResult(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { responseId, responseResult, feedbackContent } = req.body as {
      responseId: string;
      responseResult: ResponseResult;
      feedbackContent: string;
    };

    const feedbackResultId = createId();
    await dbClient.execute(
      `insert into FeedbackResult (responseId, response, feedbackResultId, responseResult)
      values (:responseId, :response, :feedbackResultId, :responseResult);`,
      {
        responseId,
        response: feedbackContent,
        responseResult,
        feedbackResultId,
      },
    );
    const responseQuery = await dbClient.execute(
      "select * from FeedbackResult where feedbackResultId = :feedbackResultId",
      { feedbackResultId },
    );

    res.status(200).json({
      message: "Successfully receive responses",
      response: responseQuery.rows[0],
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
