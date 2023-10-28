import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import type { ModerationStatus } from "~/utils/dbSchema/enums";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { candidateId } = req.body as {
      candidateId: string;
    };

    const moderationStatusQuery = await dbClient.execute(
      "select moderationStatus from Resume where candidateId = :candidateId;",
      { candidateId },
    );
    const moderationStatus = moderationStatusQuery.rows[0] as {
      moderationStatus: ModerationStatus;
    };

    res.status(200).json({
      moderationStatus: moderationStatus.moderationStatus,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error of updating resume moderation status", error });
  }
}
