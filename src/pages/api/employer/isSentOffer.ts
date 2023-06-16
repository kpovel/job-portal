import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export default async function reviewJobOffer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      candidateId,
      employerId
    } = req.body as {candidateId: string, employerId: string};

    const caller = appRouter.createCaller({ prisma });
    const sentOffer = await caller.sendOffer.isSentOffer({
      candidateId,
      employerId
    });

    res.status(200).json({
      message: "Successfully reviewed job offer",
      sentOffer,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
