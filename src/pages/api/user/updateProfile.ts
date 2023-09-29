import type { NextApiRequest, NextApiResponse } from "next";
import type { CandidateFields } from "~/component/candidate/candidateAccountForm";
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

    await dbClient.execute(
      `update User
      set firstName    = :firstName,
        lastName     = :lastName,
        age          = :age,
        githubLink   = :githubLink,
        linkedinLink = :linkedinLink,
        telegramLink = :telegramLink,
        phoneNumber  = :phoneNumber,
        email        = :email
      where id = :id;`,
      {
        id,
        firstName,
        lastName,
        age,
        githubLink,
        linkedinLink,
        telegramLink,
        phoneNumber,
        email,
      },
    );

    res.status(200).json({
      message: "Successful update user profile",
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
