import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import type { VacancyFields } from "~/pages/home/create-vacancy";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      questionnaireId,
      specialty,
      salary,
      duties,
      requirements,
      conditions,
      workSchedule,
      employment,
    } = req.body as { questionnaireId: string } & VacancyFields;

    const caller = appRouter.createCaller({ prisma });
    const updatedVacancy = await caller.employer.updateVacancy({
      questionnaireId,
      specialty,
      salary,
      duties,
      requirements,
      conditions,
      workSchedule,
      employment,
    });

    res.status(200).json({
      message: "Vacancy successfully updated",
      updatedVacancy,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
