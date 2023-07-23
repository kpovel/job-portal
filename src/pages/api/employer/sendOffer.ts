import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function reviewJobOffer(
  req: NextApiRequest,
  res: NextApiResponse
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

    const candidatesResume = await prisma.questionnaire.findUnique({
      where: { candidateId },
    });

    const createdResponse = await prisma.response.create({
      data: {
        employerId,
        candidateId,
        resumeId: candidatesResume?.questionnaireId || "",
        coverLetter: offerDescription,
        vacancyId,
        responseBy: "EMPLOYER",
      },
    });

    res.status(200).json({
      message: "Successfully submitted the offer",
      createdResponse,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
