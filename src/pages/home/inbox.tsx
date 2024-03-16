import { Layout } from "~/component/layout/layout";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import { dbClient } from "~/server/db";
import Link from "next/link";
import { format } from "date-fns";
import { EmployerFeedback } from "~/component/inbox/employerFeedback";
import { EmployerApplication } from "~/component/inbox/employerApplication";
import Head from "next/head";
import type {
  Response,
  StatusType,
  User,
  UserType,
} from "~/server/db/types/schema";

export default function Inbox({
  responses,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Job Portal – Відгуки</title>
      </Head>
      <Layout>
        <div className="container mx-auto px-4">
          <h2 className="py-3 text-2xl font-bold">
            {responses.length ? "Відгуки" : "У вас поки що немає відгуків"}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {responses.map((response) => (
              <div
                key={response.response_uuid}
                className="flex w-full flex-col gap-2 rounded-md border border-gray-300 p-4"
              >
                <Link href={`/candidate/${response.user_uuid}`}>
                  <div className="font-bold text-blue-600 hover:text-blue-800">
                    {response.first_name} {response.last_name}
                  </div>
                </Link>
                <p>
                  <strong>Супровідний лист:</strong> {response.cover_letter}
                </p>
                <p>
                  <strong>Надіслано:</strong>{" "}
                  {format(
                    new Date(response.response_date),
                    "d MMMM yyyy, HH:mm",
                  )}
                </p>
                {response.responseBy === "EMPLOYER" ? (
                  <EmployerApplication
                    feedbackStatus={response.status}
                    feedbackResponse={response.response}
                  />
                ) : (
                  <EmployerFeedback
                    feedbackStatus={response.status}
                    feedbackResponse={response.response}
                    responseUUID={response.response_uuid}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const authToken = req.cookies[AUTHORIZATION_TOKEN_KEY] ?? "";
  const verifiedToken = verifyToken(authToken) as VerifyToken | null;

  if (!verifiedToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const employer = await dbClient.execute({
    sql: "\
select id \
from employer \
where id = :employer_id;",
    args: {
      employer_id: verifiedToken.userId,
    },
  });

  if (!employer.rows.length) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const responsesQuery = await dbClient.execute({
    sql: "\
select r.response_uuid,\
       r.response_date,\
       r.cover_letter,\
       fr.response,\
       status,\
       user_uuid,\
       u.first_name,\
       u.last_name,\
       type as responseBy \
from response as r\
         left join feedback_result fr on fr.response_id = r.id\
         left join user u on u.id = r.candidate_id\
         inner join user_type ut on r.response_by_user_type_id = ut.id\
         left join status_type st on fr.feedback_result_status_id = st.id \
where employer_id = :employer_id;",
    args: {
      employer_id: verifiedToken.userId,
    },
  });
  const responses = responsesQuery.rows as never as EmployerResponse[];

  return {
    props: {
      responses,
    },
  };
};

type EmployerResponse = Pick<User, "user_uuid" | "first_name" | "last_name"> &
  Pick<Response, "response_uuid" | "response_date" | "cover_letter"> & {
    response: string | null;
    status: StatusType["status"] | null;
  } & { responseBy: UserType["type"] };
