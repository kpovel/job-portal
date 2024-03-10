import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import type { VacancyFields } from "~/pages/home/create-vacancy";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse,
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
      work_schedule: workSchedule,
      employment,
    } = req.body as { questionnaireId: string } & VacancyFields;

    await dbClient.execute(
      `update Vacancy
      set specialty    = :specialty,
        salary       = :salary,
        duties       = :duties,
        requirements = :requirements,
        conditions   = :conditions,
        workSchedule = :workSchedule,
        employment   = :employment,
        moderationStatus = 'PENDING'
      where questionnaireId = :questionnaireId;`,
      {
        specialty,
        salary,
        duties,
        requirements,
        conditions,
        workSchedule,
        employment,
        questionnaireId,
      },
    );

    res.status(200).json({
      message: "Vacancy successfully updated",
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to update vacancy", error });
  }
}
