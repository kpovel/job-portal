import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";

export default async function getAcceptedVacancies(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { employerId } = req.body as { employerId: string };

    const vacanciesQuery = await dbClient.execute(
      "select * from Vacancy where employerId = :employerId and moderationStatus = 'ACCEPTED'",
      {
        employerId,
      },
    );

    res.status(200).json({
      message: "Successfully fetched accepted vacancies",
      acceptedVacancies: vacanciesQuery.rows,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
