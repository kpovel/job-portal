import { Layout } from "~/component/layout/layout";
import { dbClient } from "~/server/db";
import type { InferGetServerSidePropsType } from "next";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import type { GetServerSidePropsContext } from "next";
import { format } from "date-fns";
import Link from "next/link";
import { EmployerApplication } from "~/component/inbox/employerApplication";
import { EmployerFeedback } from "~/component/inbox/employerFeedback";
import type {
  Response,
  StatusType,
  Vacancy,
  UserType,
} from "~/server/db/types/schema";

export default function Offers({
  candidateOffers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h2 className="pb-3 text-2xl font-bold">
          {candidateOffers.length
            ? "Список пропозицій"
            : "Ви ще не маєте пропозицій"}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {candidateOffers.map((offer) => (
            <div
              key={offer.response_uuid}
              className="flex w-full flex-col gap-2 rounded-md border border-gray-300 p-4"
            >
              <Link href={`/job/${offer.vacancy_uuid}`}>
                <div className="font-bold text-blue-600 hover:text-blue-800">
                  {offer.specialty}
                </div>
              </Link>
              <p>
                <strong>Супровідний лист:</strong> {offer.cover_letter}
              </p>
              <p>
                <strong>Надіслано: </strong>
                {format(new Date(offer.response_date), "d MMMM yyyy, HH:mm")}
              </p>
              {offer.type === "CANDIDATE" ? (
                <EmployerApplication
                  feedbackStatus={offer.status}
                  feedbackResponse={offer.response}
                />
              ) : (
                <EmployerFeedback
                  feedbackStatus={offer.status}
                  feedbackResponse={offer.response}
                  responseUUID={offer.response_uuid}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
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

  const candidateQuery = await dbClient.execute({
    sql: "\
select id \
from candidate \
where id = :candidate_id;",
    args: {
      candidate_id: verifiedToken.userId,
    },
  });

  if (!candidateQuery.rows.length) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const candidateOffersQuery = await dbClient.execute({
    sql: "\
select r.response_uuid,\
       r.response_date,\
       cover_letter,\
       v.vacancy_uuid,\
       v.specialty,\
       fr.response,\
       st.status,\
       ut.type \
from response as r\
         left join feedback_result fr on fr.response_id = r.id\
         inner join vacancy v on v.id = r.vacancy_id\
         inner join user_type ut on r.response_by_user_type_id = ut.id\
         left join status_type st on fr.feedback_result_status_id = st.id \
where candidate_id = :candidate_id \
order by r.response_date desc;",
    args: {
      candidate_id: verifiedToken.userId,
    },
  });
  const candidateOffers =
    candidateOffersQuery.rows as never as CandidateOffer[];

  return {
    props: {
      candidateOffers,
    },
  };
}

type CandidateOffer = Pick<
  Response,
  "response_uuid" | "response_date" | "cover_letter"
> &
  Pick<Vacancy, "vacancy_uuid" | "specialty"> & {
    response: string | null;
    status: StatusType["status"] | null;
  } & Pick<UserType, "type">;
