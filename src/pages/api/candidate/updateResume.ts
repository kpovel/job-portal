import type { NextApiRequest, NextApiResponse } from "next";
import type { NestedCandidateProfile } from "~/pages/my/profile";
import { dbClient } from "~/server/db";
import { verifyToken } from "~/utils/auth/auth";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import type { VerifyToken } from "~/utils/auth/withoutAuth";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
  }
  const {
    work_experience,
    skills,
    education,
    foreign_languages,
    interests,
    achievements,
    specialty,
    desired_salary,
    employment,
  } = req.body as NestedCandidateProfile["resume"];

  const candidateToken = req.cookies[AUTHORIZATION_TOKEN_KEY];
  if (!candidateToken) {
    res.status(401).send("Authorization cookie not provided");
    return;
  }

  try {
    const verifiedToken = verifyToken(candidateToken) as VerifyToken | null;
    if (!verifiedToken?.userId) {
      res.status(401).send("Invalid token key");
      return;
    }

    await dbClient.execute({
      sql: "\
update Resume \
set work_experience   = :work_experience,\
    skills            = :skills,\
    education         = :education,\
    foreign_languages = :foreign_languages,\
    interests         = :interests,\
    achievements      = :achievements,\
    specialty         = :specialty,\
    desired_salary    = :desired_salary,\
    employment        = :employment \
where candidate_id = :candidate_id;",
      args: {
        work_experience,
        skills,
        education,
        foreign_languages,
        interests,
        achievements,
        specialty,
        desired_salary,
        employment,
        candidate_id: verifiedToken.userId,
      },
    });

    res.status(200).send("");
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed to update candidate resume");
  }
}
