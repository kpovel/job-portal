import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { employerId } = req.body as { employerId: string };

    const availableVacancies = await prisma.vacancy.findMany({
      where: { employerId, moderationStatus: "ACCEPTED" },
    });

    res.status(200).json({
      message: "Successful created vacancy",
      availableVacancies,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
