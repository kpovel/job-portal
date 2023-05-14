import { Layout } from "~/component/layout/layout";
import { AdminNavigationMenu } from "~/component/admin/adminNavigationMenu";
import React from "react";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import type { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import type { Vacancy } from "@prisma/client";
import { VacancyPreview } from "~/component/employer/vacancyPreview";

export default function Candidates({
  unmoderatedVacancies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const parseVacancies: Vacancy[] = superjson.parse(unmoderatedVacancies);

  return (
    <>
      <Head>
        <title>Job portal - Вакансії</title>
      </Head>
      <Layout>
        <div className="container mx-auto my-4 flex flex-col items-center space-y-8">
          <AdminNavigationMenu />
          <hr className="w-full border-gray-300" />
          {parseVacancies.map((vacancy) => {
            return (
              <VacancyPreview key={vacancy.questionnaireId} vacancy={vacancy} />
            );
          })}
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async () => {
  const context = appRouter.createCaller({ prisma });
  const unmoderatedVacancies = await context.admin.fetchUnmoderatedVacancies();
  const serializedVacancies = superjson.stringify(unmoderatedVacancies);

  return {
    props: {
      unmoderatedVacancies: serializedVacancies,
    },
  };
};
