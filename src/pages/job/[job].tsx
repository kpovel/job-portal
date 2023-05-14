import { Layout } from "~/component/layout/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import type { GetStaticPaths, InferGetStaticPropsType } from "next";
import superjson from "superjson";
import type { Vacancy } from "@prisma/client";
import Head from "next/head";
import React from "react";
import { format } from "date-fns";

export default function Job({
  job,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const parsedJob: Vacancy = superjson.parse(job);

  function renderJobDetail(title: string, data: string | null | undefined) {
    if (!data) return null;
    return (
      <div className="mb-4">
        <strong className="text-lg font-semibold">{title}:</strong>
        <p className="mt-2 text-gray-700">{data}</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Job Portal – {parsedJob.specialty}</title>
      </Head>
      <Layout>
        <div className="container mx-auto mt-6">
          <div className="rounded-lg border bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold">{parsedJob.specialty}</h2>
            {renderJobDetail(
              "Salary",
              parsedJob.salary && `$${parsedJob.salary}`
            )}
            {renderJobDetail("Обов'язки", parsedJob.duties)}
            {renderJobDetail("Вимоги", parsedJob.requirements)}
            {renderJobDetail("Умови", parsedJob.conditions)}
            {renderJobDetail("Графік роботи", parsedJob.workSchedule)}
            {renderJobDetail("Тип зайнятості", parsedJob.employment)}
            <div className="mb-4">
              <strong className="text-lg font-semibold">
                Дата публікації:
              </strong>
              <p className="mt-2 text-gray-700">
                {format(parsedJob?.dateOfPublication, "d MMMM yyyy, HH:mm")}
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

type StaticPath = {
  params: {
    job: string;
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const caller = appRouter.createCaller({ prisma });
  const jobs = await caller.employer.fetchAllVacancies();

  const paths: StaticPath[] = jobs.map((job) => ({
    params: { job: job.questionnaireId },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: StaticPath) => {
  const caller = appRouter.createCaller({ prisma });
  const job = await caller.employer.findVacancyById({
    vacancyId: params.job,
  });

  const serializedJob = superjson.stringify(job);

  return {
    props: {
      job: serializedJob,
    },
    revalidate: 20,
  };
};
