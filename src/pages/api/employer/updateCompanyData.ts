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
    const { employerId, companyName, companyAddress } = req.body as {
      employerId: string;
      companyName: string;
      companyAddress: string;
    };

    const caller = appRouter.createCaller({ prisma });
    const updatedCompanyData = await caller.employer.updateCompanyData({
      employerId,
      companyName,
      companyAddress,
    });

    res.status(200).json({
      message: "Successful update user profile",
      updatedCompanyData,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
