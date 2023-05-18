import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import type { ResponseResult } from "@prisma/client";

export default async function createFeedbackResult(
  req: NextApiRequest,
  res: NextApiResponse
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

    const caller = appRouter.createCaller({ prisma });
    const responsesByCandidate = await caller.response.createFeedbackResult({
      responseId,
      responseResult,
      feedbackContent,
    });

    res.status(200).json({
      message: "Successfully receive responses",
      responsesByCandidate,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
