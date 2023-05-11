import type { NextApiRequest, NextApiResponse } from "next";
import type { CandidateFields } from "~/component/candidate/candidateAccountForm";
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
      id,
      firstName,
      lastName,
      age,
      githubLink,
      linkedinLink,
      telegramLink,
      phoneNumber,
      email,
    } = req.body as CandidateFields & { id: string };

    const caller = appRouter.createCaller({ prisma });
    const updatedCandidateProfile = await caller.user.updateUserProfile({
      id,
      firstName,
      lastName,
      age,
      githubLink,
      linkedinLink,
      telegramLink,
      phoneNumber,
      email,
    });
    res.status(200).json({
      message: "Successful update user profile",
      updatedCandidateProfile,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
