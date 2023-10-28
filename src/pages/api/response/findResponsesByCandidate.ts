import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import type { ModerationStatus } from "~/utils/dbSchema/enums";

export default async function findResponsesByCandidate(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { candidateId, vacancyId } = req.body as {
      candidateId: string;
      vacancyId: string;
    };

    const responsesQuery = await dbClient.execute(
      "select * from Response where candidateId = :candidateId and vacancyId = :vacancyId;",
      { candidateId, vacancyId },
    );

    const resumeQuery = await dbClient.execute(
      "select moderationStatus from Resume where candidateId = :candidateId;",
      {
        candidateId,
      },
    );

    const { moderationStatus } = resumeQuery.rows[0] as {
      moderationStatus: ModerationStatus;
    };

    res.status(200).json({
      message: "Successfully receive responses",
      isSentResponse: !!responsesQuery.rows.length,
      resumeModerationStatus: moderationStatus,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to find candidate response", error });
  }
}
