import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";

export default async function responseOnVacancy(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { candidateId, vacancyId, coverLetter, employerId } = req.body as {
      candidateId: string;
      vacancyId: string;
      coverLetter: string;
      employerId: string;
    };

    const candidateQuestionaireQuery = await dbClient.execute(
      "select questionnaireId from Questionnaire where candidateId = :candidateId;",
      {
        candidateId,
      },
    );

    const candidateQuestionaire = candidateQuestionaireQuery.rows[0] as {
      questionnaireId: string;
    };

    await dbClient.execute(
      `insert into Response (responseId, vacancyId, candidateId, employerId, resumeId, coverLetter, responseBy)
      values (:responseId, :vacancyId, :candidateId, :employerId, :resumeId, :coverLetter, 'CANDIDATE');`,
      {
        responseId: randomUUID(),
        vacancyId,
        candidateId,
        employerId,
        resumeId: candidateQuestionaire.questionnaireId,
        coverLetter,
      },
    );

    res.status(200).json({
      message: "Successfully sent response",
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
