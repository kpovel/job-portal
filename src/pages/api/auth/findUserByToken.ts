import type { NextApiRequest, NextApiResponse } from "next";
import { dbClient } from "~/server/db";
import { verifyToken } from "~/utils/auth/auth";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { type VerifyToken } from "~/utils/auth/withoutAuth";

export default async function findUserByToken(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
  }

  const { authToken } = req.body as { authToken: string };

  try {
    const verifiedToken = verifyToken(authToken) as VerifyToken | null;

    if (!verifiedToken) {
      res.status(401).json({ message: "Invalid token key" });
      return;
    }

    const authorizedUser = await dbClient.execute({
      sql: "\
select user.user_uuid,\
       type,\
       first_name,\
       last_name,\
       phone_number,\
       email,\
       linkedin_link,\
       github_link,\
       login \
from user \
join user_type ut on ut.id = user.user_type_id \
where user.id = :userId;",
      args: {
        userId: verifiedToken.userId,
      },
    });

    if (!authorizedUser.rows.length) {
      res.setHeader(
        "Set-Cookie",
        `${AUTHORIZATION_TOKEN_KEY}=; Max-Age=0; Path=/`,
      );
      res.status(404).send("User is not find");
    }

    res.status(200).json({
      user: authorizedUser.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error token validation", error });
  }
}
