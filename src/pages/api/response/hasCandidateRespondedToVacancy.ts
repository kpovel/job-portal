import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export default async function responseOnVacancy(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { candidateId, vacancyId } = req.body as {
      candidateId: string;
      vacancyId: string;
    };

    const caller = appRouter.createCaller({ prisma });
    const responsesByCandidate =
      await caller.response.hasCandidateRespondedToVacancy({
        candidateId,
        vacancyId,
      });

    res.status(200).json({
      message: "Successfully receive responses",
      responsesByCandidate,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
