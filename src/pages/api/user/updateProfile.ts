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
    res.status(405).json({ message: "Method not allowed" });
  }

  const {
    first_name,
    last_name,
    github_link,
    linkedin_link,
    phone_number,
    email,
  } = req.body as NestedCandidateProfile["candidate"];

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
update User \
set first_name    = :first_name,\
    last_name     = :last_name,\
    github_link   = :github_link,\
    linkedin_link = :linkedin_link,\
    phone_number  = :phone_number,\
    email         = :email \
where id = :id;",
      args: {
        id: verifiedToken.userId,
        first_name,
        last_name,
        github_link,
        linkedin_link,
        phone_number,
        email,
      },
    });

    res.status(200).send("");
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed to update candidate profile");
  }
}
