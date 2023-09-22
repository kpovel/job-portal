import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import type { ModerationStatus } from "~/utils/dbSchema/moderationStatus";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { moderationStatus, questionnaireId } = req.body as {
      moderationStatus: keyof typeof ModerationStatus;
      questionnaireId: string;
    };

    await dbClient.execute(
      "update Resume set moderationStatus = :moderationStatus where questionnaireId = :questionnaireId",
      { moderationStatus, questionnaireId },
    );

    res.status(200).json({
      message: "Successfully updated Resume moderation status",
    });
  } catch (error) {
    res.status(400).json({ message: "Error of updating resume moderation status", error });
  }
}
