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
import type { Vacancy } from "~/utils/dbSchema/models";

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
              <VacancyPreview key={vacancy.questionnaireId} vacancy={vacancy} />
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
    `select questionnaireId, specialty, salary, duties, requirements, conditions, workSchedule, employment, dateOfPublication
    from Vacancy where moderationStatus != 'ACCEPTED';`,
  );

  const unmoderatedVacancies = vacanciesQuery.rows as Omit<
    Vacancy,
    "employerId" | "moderationStatus"
  >[];

  return {
    props: {
      unmoderatedVacancies,
    },
  };
};
