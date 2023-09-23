import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import type { VacancyFields } from "~/pages/home/create-vacancy";
import { createId } from "@paralleldrive/cuid2";
import type { Vacancy } from "dbSchema/models";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse,
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

    const createdVacancy = await dbClient.transaction(async (tx) => {
      const questionnaireId = createId();
      await tx.execute(
        "insert into Questionnaire (questionnaireId, questionnaireType, employerId) values (:questionnaireId, 'VACANCY', :employerId);",
        { questionnaireId, employerId },
      );

      const vacancyQuery = await tx.execute(
        `insert into Vacancy (questionnaireId, specialty, salary, duties, requirements, conditions, workSchedule, employment, employerId)
        values (:questionnaireId, :specialty, :salary, :duties, :requirements, :conditions, :workSchedule, :employment, :employerId);`,
        {
          questionnaireId,
          specialty,
          salary,
          duties,
          requirements,
          conditions,
          workSchedule,
          employment,
          employerId,
        },
      );

      return vacancyQuery.rows[0] as Vacancy;
    });

    res.status(200).json({
      message: "Successful created vacancy",
      createdVacancy,
    });
  } catch (error) {
    res.status(400).json({ message: "Error to create a vacancy", error });
  }
}
