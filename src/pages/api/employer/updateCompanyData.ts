import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import type { Employer } from "~/server/db/types/schema";
import { verifyToken } from "~/utils/auth/auth";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import type { VerifyToken } from "~/utils/auth/withoutAuth";

export default async function updateProfile(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  const candidateToken = req.cookies[AUTHORIZATION_TOKEN_KEY];
  if (!candidateToken) {
    res.status(401).send("Authorization cookie not provided");
    return;
  }

  try {
    const verifiedToken = verifyToken(candidateToken) as VerifyToken | null;
    if (!verifiedToken?.userId) {
      res.status(401).send("Invalid token key");
      return;
    }
    const { company_name, company_address } = req.body as Pick<
      Employer,
      "company_name" | "company_address"
    >;
    await dbClient.execute({
      sql: "\
update Employer \
set company_name    = :company_name,\
    company_address = :company_address \
where id = :employer_id;",
      args: {
        company_name,
        company_address,
        employer_id: verifiedToken.userId,
      },
    });

    res.status(200).send("");
  } catch (error) {
    console.error(error);
    res.status(400).send("Failed to update company data");
  }
}
