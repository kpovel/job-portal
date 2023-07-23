import { Layout } from "~/component/layout/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import Head from "next/head";
import type { InferGetStaticPropsType } from "next";
import type { Vacancy } from "@prisma/client";
import { VacancyPreview } from "~/component/employer/vacancyPreview";

export default function Candidates({
  vacancies,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const parsedVacancies: Vacancy[] = superjson.parse(vacancies);

  return (
    <>
      <Head>
        <title>Job Portal – Список доступних вакансій</title>
      </Head>
      <Layout>
        <div className="container mx-auto px-4">
          <h2 className="py-3 text-2xl font-bold">
            {parsedVacancies.length
              ? "Список доступних вакансій"
              : "Наразі немає доступних вакансій"}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {parsedVacancies.map((vacancy) => (
              <VacancyPreview key={vacancy.questionnaireId} vacancy={vacancy} />
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps = async () => {
  const caller = appRouter.createCaller({ prisma });
  const vacancies = await caller.employer.fetchAvailableVacancies();
  const serializedVacancies = superjson.stringify(vacancies);

  return {
    props: {
      vacancies: serializedVacancies,
    },
    revalidate: 20,
  };
};
