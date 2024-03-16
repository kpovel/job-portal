import { Layout } from "~/component/layout/layout";
import Head from "next/head";
import type { InferGetStaticPropsType } from "next";
import { VacancyPreview } from "~/component/employer/vacancyPreview";
import { dbClient } from "~/server/db";
import type { Vacancy } from "~/server/db/types/schema";

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
              <VacancyPreview key={vacancy.vacancy_uuid} vacancy={vacancy} />
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps = async () => {
  const vacanciesQuery = await dbClient.execute({
    sql: "\
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
where moderation_status_id = (select id from status_type where status = 'ACCEPTED');",
    args: {},
  });

  const vacancies = vacanciesQuery.rows as never as Omit<
    Vacancy,
    "id" | "employer_id" | "moderation_status_id"
  >[];

  return {
    props: {
      vacancies,
    },
    revalidate: 20,
  };
};
