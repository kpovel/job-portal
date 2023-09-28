import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { employerId, companyName, companyAddress } = req.body as {
      employerId: string;
      companyName: string;
      companyAddress: string;
    };

    await dbClient.execute(
      "update Employer set companyName = :companyName, companyAddress = :companyAddress where employerId = :employerId;",
      {
        companyName,
        companyAddress,
        employerId,
      },
    );

    res.status(200).json({
      message: "Successful update user profile",
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to update company data", error });
  }
}
