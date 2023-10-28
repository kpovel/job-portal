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
import { useContext } from "react";
import { AuthContext } from "~/utils/auth/authContext";
import { EmployerApplication } from "~/component/inbox/employerApplication";
import Head from "next/head";
import type { ResponseResult, ResponseBy } from "~/utils/dbSchema/enums";

type EmployerResponse = {
  responseId: string;
  response: string | null;
  responseResult: ResponseResult | null;
  candidateId: string;
  firstName: string;
  lastName: string;
  coverLetter: string;
  responseDate: Date;
  responseBy: ResponseBy;
};

export default function Inbox({
  responses,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const authContext = useContext(AuthContext);

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
                key={response.responseId}
                className="flex w-full flex-col gap-2 rounded-md border border-gray-300 p-4"
              >
                <Link href={`/candidate/${response.candidateId}`}>
                  <div className="font-bold text-blue-600 hover:text-blue-800">
                    {response.firstName} {response.lastName}
                  </div>
                </Link>
                <p>
                  <strong>Супровідний лист:</strong> {response.coverLetter}
                </p>
                <p>
                  <strong>Надіслано:</strong>{" "}
                  {format(
                    new Date(response.responseDate),
                    "d MMMM yyyy, HH:mm",
                  )}
                </p>
                {authContext?.userType.toString() === response.responseBy ? (
                  <EmployerApplication
                    responseResult={response.responseResult}
                    response={response.response}
                  />
                ) : (
                  <EmployerFeedback
                    response={response.response}
                    responseresult={response.responseResult}
                    responseId={response.responseId}
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

  const user = await dbClient.execute(
    "select id from User where id = :userId and userType = 'EMPLOYER';",
    {
      userId: verifiedToken.userId,
    },
  );

  if (!user.rows.length) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const responsesQuery = await dbClient.execute(
    `select r.responseId, fr.response, fr.responseResult, candidateId, u.firstName, u.lastName ,coverLetter, r.responseDate, r.responseBy
    from Response as r left join FeedbackResult fr on fr.responseId = r.responseId
    left join User u on u.id = r.candidateId
    where employerId = :employerId;`,
    {
      employerId: verifiedToken.userId,
    },
  );
  const responses = responsesQuery.rows as EmployerResponse[];

  return {
    props: {
      responses,
    },
  };
};
