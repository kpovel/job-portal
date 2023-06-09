import { Layout } from "~/component/layout/layout";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import type { Candidate, FeedbackResult, User, Response } from "@prisma/client";
import Link from "next/link";
import { format } from "date-fns";
import { EmployerFeedback } from "~/component/inbox/employerFeedback";

export default function Inbox({
  employerResponses,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  type EmployerResponse = Response & {
    candidate: Candidate & { candidate: User };
    feedbackResult: FeedbackResult | null;
  };

  const parsedResponses: EmployerResponse[] =
    superjson.parse(employerResponses);

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h2 className="py-3 text-2xl font-bold">
          {parsedResponses.length ? "Відгуки" : "У вас поки що немає відгуків"}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {parsedResponses.map((response) => (
            <div
              key={response.responseId}
              className="flex w-full flex-col gap-2 rounded-md border border-gray-300 p-4"
            >
              <Link href={`/candidate/${response.candidate.candidateId}`}>
                <div className="font-bold text-blue-600 hover:text-blue-800">
                  {response.candidate.candidate.firstName}{" "}
                  {response.candidate.candidate.lastName}
                </div>
              </Link>
              <p>
                <strong>Супровідний лист:</strong> {response.coverLetter}
              </p>
              <p>
                <strong>Надіслано:</strong>{" "}
                {format(response.responseDate, "d MMMM yyyy, HH:mm")}
              </p>
              <EmployerFeedback
                feedback={response.feedbackResult}
                responseId={response.responseId}
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const authToken = req.cookies[AUTHORIZATION_TOKEN_KEY] ?? "";
  const verifiedToken = verifyToken(authToken) as VerifyToken | null;

  const caller = appRouter.createCaller({ prisma });
  const candidateData = await caller.employer.findEmployeeById({
    employerId: verifiedToken?.userId ?? "",
  });

  if (!verifiedToken || candidateData?.userType !== "EMPLOYER") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const employerResponses = await caller.offers.findEmployeeResponses({
    employerId: verifiedToken.userId,
  });

  const serializedResponses = superjson.stringify(employerResponses);
  return {
    props: {
      employerResponses: serializedResponses,
    },
  };
};
