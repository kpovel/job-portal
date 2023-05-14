import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import type { ModerationStatus } from "@prisma/client";

export default async function updateModerationStatus(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { questionnaireId, moderationStatus } = req.body as {
      questionnaireId: string;
      moderationStatus: ModerationStatus;
    };

    const caller = appRouter.createCaller({ prisma });
    const updatedVacancy = await caller.employer.updateModerationStatus({
      moderationStatus,
      questionnaireId,
    });

    res.status(200).json({
      message: "Moderation status successfully updated",
      updatedVacancy,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
