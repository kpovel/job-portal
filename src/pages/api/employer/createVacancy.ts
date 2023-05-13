import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import type { VacancyFields } from "~/pages/home/create-job";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      employerId,
      specialty,
      salary,
      duties,
      requirements,
      conditions,
      workSchedule,
      employment,
    } = req.body as { employerId: string } & VacancyFields;

    const caller = appRouter.createCaller({ prisma });
    const createdVacancy = await caller.employer.createVacancy({
      employerId,
      specialty,
      salary,
      duties,
      requirements,
      conditions,
      workSchedule,
      employment,
    });

    res.status(200).json({
      message: "Successful created vacancy",
      createdVacancy,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
