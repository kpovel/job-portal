import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";

export default async function reviewJobOffer(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { candidateId, employerId } = req.body as {
      candidateId: string;
      employerId: string;
    };

    const sentOfferQuery = await dbClient.execute(
      `select count(*)
        from Response
        where candidateId = :candidateId
      and employerId = :employerId
      and responseBy = 'EMPLOYER';`,
      { candidateId, employerId },
    );
    const sentOffers = sentOfferQuery.rows[0] as {"count(*)": number};

    res.status(200).json({
      message: "Successfully reviewed job offer",
      isSentOffer: !!sentOffers,
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error });
  }
}
