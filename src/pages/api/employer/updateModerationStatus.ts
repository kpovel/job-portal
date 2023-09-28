import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import type { ModerationStatus } from "@prisma/client";

export default async function updateModerationStatus(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { questionnaireId, moderationStatus } = req.body as {
      questionnaireId: string;
      moderationStatus: ModerationStatus;
    };

    await dbClient.execute(
      "update Vacancy set moderationStatus = :moderationStatus where questionnaireId = :questionnaireId;",
      {
        moderationStatus,
        questionnaireId,
      },
    );

    res.status(200).json({
      message: "Moderation status successfully updated",
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to update moderation status", error });
  }
}
