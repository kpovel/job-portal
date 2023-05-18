import { Layout } from "~/component/layout/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import type { InferGetServerSidePropsType } from "next";
import type { FeedbackResult, Response, Vacancy } from "@prisma/client";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import type { GetServerSidePropsContext } from "next";
import { format } from "date-fns";
import Link from "next/link";

export default function Offers({
  candidateOffers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  type CandidateOffer = Response & {
    vacancy: Vacancy | null;
    feedbackResult: FeedbackResult | null;
  };

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
              key={offer.responseId}
              className="flex w-full flex-col gap-2 rounded-md border border-gray-300 p-4"
            >
              <Link href={`/job/${offer.vacancyId}`}>
                <div className="font-bold text-blue-600 hover:text-blue-800">
                  {offer.vacancy?.specialty}
                </div>
              </Link>
              <p>
                <strong>Супровідний лист:</strong> {offer.coverLetter}
              </p>
              <p>
                <strong>Надіслано:</strong>{" "}
                {format(offer.responseDate, "d MMMM yyyy, HH:mm")}
              </p>
              <p>
                {offer.feedbackResult
                  ? "Результат відгуку"
                  : "Роботодавець ще не обробив ваш запит"}
              </p>
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
  const candidateData = await caller.candidate.findCandidateById({
    id: verifiedToken?.userId ?? "",
  });

  if (!verifiedToken || candidateData?.userType !== "CANDIDATE") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const candidateOffers = await caller.offers.findCandidateOffers({
    candidateId: verifiedToken?.userId,
  });
  const serializedOffers = superjson.stringify(candidateOffers);

  return {
    props: {
      candidateOffers: serializedOffers,
    },
  };
};
