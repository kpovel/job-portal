import { Layout } from "~/component/layout/layout";
import Head from "next/head";
import type { InferGetStaticPropsType } from "next";
import { VacancyPreview } from "~/component/employer/vacancyPreview";
import { dbClient } from "~/server/db";
import type { Vacancy } from "~/utils/dbSchema/models";

export default function Candidates({
  vacancies,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Job Portal – Список доступних вакансій</title>
      </Head>
      <Layout>
        <div className="container mx-auto px-4">
          <h2 className="py-3 text-2xl font-bold">
            {vacancies.length
              ? "Список доступних вакансій"
              : "Наразі немає доступних вакансій"}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {vacancies.map((vacancy) => (
              <VacancyPreview key={vacancy.questionnaireId} vacancy={vacancy} />
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps = async () => {
  const vacanciesQuery = await dbClient.execute(
    `select questionnaireId, specialty, salary, duties, requirements, conditions, workSchedule, employment, dateOfPublication
    from Vacancy where moderationStatus = 'ACCEPTED';`,
  );
  const vacancies = vacanciesQuery.rows as Omit<
    Vacancy,
    "employerId" | "moderationStatus"
  >[];

  return {
    props: {
      vacancies,
    },
    revalidate: 20,
  };
};
