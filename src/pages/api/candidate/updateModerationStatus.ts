import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import type { ModerationStatus } from "@prisma/client";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { moderationStatus, questionnaireId } = req.body as {
      moderationStatus: ModerationStatus;
      questionnaireId: string;
    };

    const caller = appRouter.createCaller({ prisma });
    const updatedCandidateResume =
      await caller.candidate.updateModerationStatus({
        moderationStatus,
        questionnaireId,
      });

    res.status(200).json({
      message: "Successfully updated Questionnaire moderation status",
      updatedCandidateResume,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
