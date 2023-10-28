import { Layout } from "~/component/layout/layout";
import { dbClient } from "~/server/db";
import type { InferGetServerSidePropsType } from "next";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import type { GetServerSidePropsContext } from "next";
import { format } from "date-fns";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "~/utils/auth/authContext";
import { EmployerApplication } from "~/component/inbox/employerApplication";
import { EmployerFeedback } from "~/component/inbox/employerFeedback";
import type { ResponseBy, ResponseResult } from "~/utils/dbSchema/enums";

type CandidateOffer = {
  responseId: string;
  vacancyId: string;
  response: string | null;
  specialty: string;
  responseResult: ResponseResult | null;
  coverLetter: string;
  responseDate: Date;
  responseBy: ResponseBy;
};

export default function Offers({
  candidateOffers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const authContext = useContext(AuthContext);

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h2 className="py-3 text-2xl font-bold">
          {candidateOffers.length
            ? "Список пропозицій"
            : "Ви ще не маєте пропозицій"}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {candidateOffers.map((offer) => (
            <div
              key={offer.responseId}
              className="flex w-full flex-col gap-2 rounded-md border border-gray-300 p-4"
            >
              <Link href={`/job/${offer.vacancyId}`}>
                <div className="font-bold text-blue-600 hover:text-blue-800">
                  {offer.specialty}
                </div>
              </Link>
              <p>
                <strong>Супровідний лист:</strong> {offer.coverLetter}
              </p>
              <p>
                <strong>Надіслано: </strong>
                {format(new Date(offer.responseDate), "d MMMM yyyy, HH:mm")}
              </p>
              {offer.responseBy.toString() === authContext?.userType ? (
                <EmployerApplication
                  response={offer.response}
                  responseResult={offer.responseResult}
                />
              ) : (
                <EmployerFeedback
                  response={offer.response}
                  responseresult={offer.responseResult}
                  responseId={offer.responseId}
                />
              )}
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

  if (!verifiedToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const candidateQuery = await dbClient.execute(
    "select candidateId from Candidate where candidateId = :candidateId;",
    {
      candidateId: verifiedToken.userId,
    },
  );

  if (!candidateQuery.rows.length) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const candidateOffersQuery = await dbClient.execute(
    `select r.responseId, r.vacancyId, v.specialty, fr.response, fr.responseResult, coverLetter, r.responseDate, r.responseBy
    from Response as r
    left join FeedbackResult fr on fr.responseId = r.responseId
    left join Vacancy v on v.questionnaireId = r.responseId
    where candidateId = :candidateId;`,
    {
      candidateId: verifiedToken.userId,
    },
  );
  const candidateOffers = candidateOffersQuery.rows as CandidateOffer[];

  return {
    props: {
      candidateOffers,
    },
  };
};
