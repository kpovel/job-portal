import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export default async function updateProfile(
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
    console.log("Req body: ", req.body);

    const caller = appRouter.createCaller({ prisma });
    const sentOffer = await caller.sendOffer.isSentOffer({
      candidateId,
      employerId
    });

    console.log(sentOffer);

    res.status(200).json({
      message: "Successful created vacancy",
      sentOffer,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
