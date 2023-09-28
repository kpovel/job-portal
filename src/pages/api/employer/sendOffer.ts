import { createId } from "@paralleldrive/cuid2";
import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";

export default async function reviewJobOffer(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { employerId, candidateId, offerDescription, vacancyId } =
      req.body as {
        employerId: string;
        candidateId: string;
        offerDescription: string;
        vacancyId: string;
      };

    const resumeQuery = await dbClient.execute(
      "select questionnaireId from Questionnaire where candidateId = :candidateId;",
      {
        candidateId,
      },
    );

    const candidateResume = resumeQuery.rows[0] as
      | { questionnaireId: string }
      | undefined;

    if (!candidateResume) {
      res.status(404).json({
        message: "Candidate resume not found",
      });
      return;
    }

    await dbClient.execute(
      `insert into Response (resumeId, vacancyId, candidateId, employerId, coverLetter, responseId, responseBy)
      VALUES (:resumeId, :vacancyId, :candidateId, :employerId, :coverLetter, :responseId, 'EMPLOYER');`,
      {
        resumeId: candidateResume.questionnaireId,
        vacancyId,
        candidateId,
        employerId,
        coverLetter: offerDescription,
        responseId: createId(),
      },
    );

    res.status(200).json({
      message: "Successfully submitted the offer",
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
