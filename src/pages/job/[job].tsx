import { Layout } from "~/component/layout/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import type { GetStaticPaths, InferGetStaticPropsType } from "next";
import superjson from "superjson";
import type { Employer, User, Vacancy } from "@prisma/client";
import Head from "next/head";
import React, { useContext } from "react";
import { format } from "date-fns";
import { renderQuestionnaireDetail } from "~/component/questionnaire/renderQuestionnaireDetail";
import { renderQuestionnaireInfo } from "~/component/questionnaire/renderQuestionnaireInfo";
import { AuthContext } from "~/utils/auth/authContext";
import { ModerateJob } from "~/component/admin/moderation/moderateJob";
import { VacancyResponse } from "~/component/vacancy/vacancyResponse";

export type JobInformation = {
  vacancy: Vacancy | null;
  employer: (User & { employer: Employer | null }) | null;
};

export default function Job({
  jobInformation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const authContext = useContext(AuthContext);
  const isAdmin = authContext?.userType === "ADMIN";
  const isCandidate = authContext?.userType === "CANDIDATE";

  const parsedJobInformation: JobInformation = superjson.parse(jobInformation);

  return (
    <>
      <Head>
        <title>Job Portal – {parsedJobInformation.vacancy?.specialty}</title>
      </Head>
      <Layout>
        <div className="container mx-auto mt-6 flex flex-row gap-4">
          <div className="basis-2/3 rounded-lg border bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold">
              {parsedJobInformation.vacancy?.specialty}
            </h2>
            {renderQuestionnaireDetail(
              "Обов'язки",
              parsedJobInformation.vacancy?.duties
            )}
            {renderQuestionnaireDetail(
              "Вимоги",
              parsedJobInformation.vacancy?.requirements
            )}
            {renderQuestionnaireDetail(
              "Умови",
              parsedJobInformation.vacancy?.conditions
            )}
            {renderQuestionnaireDetail(
              "Графік роботи",
              parsedJobInformation.vacancy?.workSchedule
            )}
            {renderQuestionnaireDetail(
              "Тип зайнятості",
              parsedJobInformation.vacancy?.employment
            )}
            <div className="mb-4">
              <strong className="text-lg font-semibold">
                Дата публікації:
              </strong>
              <p className="mt-2 text-gray-700">
                {parsedJobInformation.vacancy?.dateOfPublication &&
                  format(
                    parsedJobInformation.vacancy.dateOfPublication,
                    "d MMMM yyyy, HH:mm"
                  )}
              </p>
            </div>
          </div>
          <div className="w-28 basis-1/3 rounded-lg border bg-white p-6 shadow-lg">
            {renderQuestionnaireInfo(
              "Salary",
              parsedJobInformation.vacancy?.salary &&
                `$${parsedJobInformation.vacancy.salary}`
            )}
            {renderQuestionnaireInfo(
              "Company name",
              parsedJobInformation.employer?.employer?.companyName
            )}
            {renderQuestionnaireInfo(
              "Company address",
              parsedJobInformation.employer?.employer?.companyAddress
            )}
            {renderQuestionnaireInfo(
              "Phone number",
              parsedJobInformation.employer?.phoneNumber,
              parsedJobInformation.employer?.phoneNumber &&
                `tel:${parsedJobInformation.employer.phoneNumber}`
            )}
            {renderQuestionnaireInfo(
              "Email",
              parsedJobInformation.employer?.email,
              parsedJobInformation.employer?.email &&
                `mailto:${parsedJobInformation.employer.email}`
            )}
            {renderQuestionnaireInfo(
              "Linkedin link",
              parsedJobInformation.employer?.linkedinLink,
              parsedJobInformation.employer?.linkedinLink
            )}
            {isAdmin && <ModerateJob jobInfo={parsedJobInformation} />}
          </div>
        </div>
        {/*todo: restrict send response for unmoderated candidate*/}
        {isCandidate && (
          <VacancyResponse
            vacancyId={parsedJobInformation.vacancy?.questionnaireId || ""}
            employerId={
              parsedJobInformation.employer?.employer?.employerId || ""
            }
          />
        )}
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
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }: StaticPath) => {
  const caller = appRouter.createCaller({ prisma });
  const jobInformation = await caller.employer.informationAboutVacancy({
    vacancyId: params.job,
  });

  const serializedJob = superjson.stringify(jobInformation);

  return {
    props: {
      jobInformation: serializedJob,
    },
    revalidate: 20,
  };
};
