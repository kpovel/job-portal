import { Layout } from "~/component/layout/layout";
import Head from "next/head";
import { EmployerNavigationMenu } from "~/component/employer/employerNavigationMenu";
import React from "react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getEmployerData } from "~/utils/getEmployerData/getEmployerData";
import type { EmployerData } from "~/pages/home/profile";
import superjson from "superjson";
import Link from "next/link";
import { ModerationLabel } from "~/component/layout/elements/moderation/moderationLabel";

export default function Vacancies({
  employer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const parsedEmployerData: EmployerData = superjson.parse(employer);
  const employerVacancies = parsedEmployerData.employer.questionnaires;

  return (
    <>
      <Head>
        <title>Job Portal - Мої вакансії</title>
      </Head>
      <Layout>
        <div className="container mx-auto my-4 flex flex-col items-center space-y-8">
          <EmployerNavigationMenu />
          <hr className="w-full border-gray-300" />
          <div className="flex gap-5">
            <div>
              {employerVacancies.length ? (
                employerVacancies.map((questionnaire) => (
                  <div
                    key={questionnaire.questionnaireId}
                    className="mb-4 rounded-lg bg-white p-6 shadow-lg"
                  >
                    <div className="mb-4 flex items-center align-top">
                      <h2 className="grow text-xl font-bold text-gray-800">
                        <Link
                          href={`/home/edit-vacancy/${questionnaire.questionnaireId}`}
                          className="text-blue-600  hover:text-blue-800"
                        >
                          {questionnaire.vacancy.specialty}
                        </Link>
                      </h2>
                      <div className="mr-3">
                        <ModerationLabel
                          moderationStatus={
                            questionnaire.vacancy.moderationStatus
                          }
                        />
                      </div>
                      {questionnaire.vacancy.salary && (
                        <p className="font-semibold text-gray-700">
                          ${questionnaire.vacancy.salary}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="mb-2 text-gray-600">
                        {questionnaire.vacancy.requirements}
                      </p>
                      <p className="text-gray-600">
                        {questionnaire.vacancy.conditions}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h2 className="text-xl font-bold text-gray-800">
                  Ви ще не створили жодної вакансії
                </h2>
              )}
            </div>
            <Link
              href="/home/create-vacancy"
              className="block w-full self-start rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <button type="submit">Створити вакансію</button>
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return await getEmployerData(context);
};
