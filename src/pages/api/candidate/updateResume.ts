import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import type { CandidateResumeFormData } from "~/component/candidate/candidateResumeForm";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      workExperience,
      skills,
      education,
      foreignLanguages,
      interests,
      achievements,
      specialty,
      desiredSalary,
      employment,
      candidateId,
    } = req.body as CandidateResumeFormData & { candidateId: string };

    const caller = appRouter.createCaller({ prisma });
    const updatedCandidateResume = await caller.candidate.updateCandidateResume(
      {
        workExperience,
        skills,
        education,
        foreignLanguages,
        interests,
        achievements,
        specialty,
        desiredSalary,
        employment,
        candidateId,
      }
    );

    res.status(200).json({
      message: "Successful update user profile",
      updatedCandidateResume,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
