import { Layout } from "~/component/layout/layout";
import { dbClient } from "~/server/db";
import superjson from "superjson";
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
import { UserType } from "~/utils/dbSchema/enums";
import type { FeedbackResult, Response } from "~/utils/dbSchema/models";

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type CandidateOffer = Response & {
  vacancySpeciality: string | null;
  feedbackResultresponseDate: Date | null;
  feedbackResult: Nullable<FeedbackResult>;
};

export default function Offers({
  candidateOffers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const authContext = useContext(AuthContext);

  const parsedOffers: CandidateOffer[] = superjson.parse(candidateOffers);

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h2 className="py-3 text-2xl font-bold">
          {parsedOffers.length
            ? "Список пропозицій"
            : "Ви ще не маєте пропозицій"}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {parsedOffers.map((offer) => (
              <div
                  key={offer.vacancyId}
                  className="flex w-full flex-col gap-2 rounded-md border border-gray-300 p-4"
              >
                  <Link href={`/job/${offer.vacancyId}`}>
                      <div className="font-bold text-blue-600 hover:text-blue-800">
                          {offer.vacancySpeciality}
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
                      <EmployerApplication feedback={offer.feedbackResult} />
                  ) : (
                      <EmployerFeedback
                          feedback={offer.feedbackResult}
                          responseId={offer.responseId} />
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
    "select userType from User where id = :id",
    {
      id: verifiedToken.userId,
    },
  );

  const candidateData = candidateQuery.rows[0] as {
    userType: UserType;
  };

  if (candidateData.userType !== UserType.CANDIDATE) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const candidateOffersQuery = await dbClient.execute(
    `select Response.*,
        FeedbackResult.*,
        FeedbackResult.responseDate as feedbackResultresponseDate,
        Response.responseDate as responseDate,
        Vacancy.specialty as vacancySpeciality
    from Response
        left join FeedbackResult on FeedbackResult.responseId = Response.responseId
        left join Vacancy on Vacancy.questionnaireId = Response.vacancyId
     where candidateId = :candidateId;`,
    {
      candidateId: verifiedToken.userId,
    },
  );

  const candidateOffers = candidateOffersQuery.rows as (Response &
    Nullable<FeedbackResult> & {
      vacancySpeciality: string;
      feedbackResultresponseDate: Date | null;
    })[];

  console.log(candidateOffers);

  const formattedOffers: CandidateOffer[] = candidateOffers.map((value) => ({
    vacancySpeciality: value.vacancySpeciality,
    responseId: value.responseId,
    vacancyId: value.vacancyId,
    resumeId: value.resumeId,
    employerId: value.employerId,
    candidateId: value.candidateId,
    responseDate: value.responseDate,
    responseBy: value.responseBy,
    coverLetter: value.coverLetter,
    feedbackResultresponseDate: value.feedbackResultresponseDate,
    feedbackResult: {
      feedbackResultId: value.feedbackResultId,
      responseId: value.responseId,
      responseDate: value.responseDate,
      response: value.response,
      responseResult: value.responseResult,
    },
  }));

  const serializedOffers = superjson.stringify(formattedOffers);

  return {
    props: {
      candidateOffers: serializedOffers,
    },
  };
};
