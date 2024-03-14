import { Layout } from "~/component/layout/layout";
import { AdminNavigationMenu } from "~/component/admin/adminNavigationMenu";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { VacancyPreview } from "~/component/employer/vacancyPreview";
import { adminOnlyAccess } from "~/utils/admin/adminOnlyAccess";
import { dbClient } from "~/server/db";
import type { Vacancy } from "~/server/db/types/schema";

export default function Candidates({
  unmoderatedVacancies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Job portal - Вакансії</title>
      </Head>
      <Layout>
        <div className="container mx-auto my-4 flex w-full flex-col items-center space-y-8">
          <AdminNavigationMenu />
          <hr className="w-full border-gray-300" />
          {unmoderatedVacancies.map((vacancy) => {
            return (
              <VacancyPreview key={vacancy.vacancy_uuid} vacancy={vacancy} />
            );
          })}
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const isAdmin = await adminOnlyAccess(context);

  if (!isAdmin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const vacanciesQuery = await dbClient.execute(
    "\
select vacancy_uuid,\
       specialty,\
       salary,\
       duties,\
       requirements,\
       conditions,\
       work_schedule,\
       employment,\
       publication_date \
from vacancy \
where moderation_status_id != (select id from status_type where status = 'ACCEPTED');",
  );

  const unmoderatedVacancies = vacanciesQuery.rows as never as Omit<
    Vacancy,
    "id" | "employer_id" | "moderation_status_id"
  >[];

  return {
    props: {
      unmoderatedVacancies,
    },
  };
};
