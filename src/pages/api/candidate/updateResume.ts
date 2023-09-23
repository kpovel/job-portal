import type { NextApiRequest, NextApiResponse } from "next";
import type { CandidateResumeFormData } from "dbSchema/candidateResumeFormData";
import { dbClient } from "~/server/db";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse,
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
    } = req.body as CandidateResumeFormData;

    await dbClient.execute(
      `update Resume
      set workExperience   = :workExperience,
        skills           = :skills,
        education        = :education,
        foreignLanguages = :foreignLanguages,
        interests        = :interests,
        achievements     = :achievements,
        specialty        = :specialty,
        desiredSalary    = :desiredSalary,
        employment       = :employment
      where candidateId = :candidateId`,
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
      },
    );

    res.status(200).json({
      message: "Successfully updated candidate resume",
    });
  } catch (error) {
    res.status(400).json({ message: "Candidate resume update error", error });
  }
}
