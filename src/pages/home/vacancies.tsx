import { Layout } from "~/component/layout/layout";
import Head from "next/head";
import { EmployerNavigationMenu } from "~/component/employer/employerNavigationMenu";
import React from "react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Link from "next/link";
import { ModerationLabel } from "~/component/layout/elements/moderation/moderationLabel";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import { dbClient } from "~/server/db";
import type { ModerationStatus } from "~/utils/dbSchema/enums";
import { UserType } from "~/utils/dbSchema/enums";

type EmployerVacancy = {
  questionnaireId: string;
  specialty: string;
  moderationStatus: ModerationStatus;
  salary: string;
  requirements: string | null;
  conditions: string | null;
};

export default function Vacancies({
  employerVacancies,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
                employerVacancies.map((vacancy) => (
                  <div
                    key={vacancy.questionnaireId}
                    className="mb-4 rounded-lg bg-white p-6 shadow-lg"
                  >
                    <div className="mb-4 flex items-center align-top">
                      <h2 className="grow text-xl font-bold text-gray-800">
                        <Link
                          href={`/home/edit-vacancy/${vacancy.questionnaireId}`}
                          className="text-blue-600  hover:text-blue-800"
                        >
                          {vacancy.specialty}
                        </Link>
                      </h2>
                      <div className="mr-3">
                        <ModerationLabel
                          moderationStatus={vacancy.moderationStatus}
                        />
                      </div>
                      {vacancy.salary && (
                        <p className="font-semibold text-gray-700">
                          ${vacancy.salary}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="mb-2 text-gray-600">
                        {vacancy.requirements}
                      </p>
                      <p className="text-gray-600">{vacancy.conditions}</p>
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

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const authToken = req?.cookies[AUTHORIZATION_TOKEN_KEY];
  if (!authToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const verifiedToken = verifyToken(authToken) as VerifyToken | null;
  if (!verifiedToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const userQuery = await dbClient.execute(
    "select userType from User where id = :id;",
    { id: verifiedToken.userId },
  );
  const user = userQuery.rows[0] as { userType: UserType };
  if (user.userType !== UserType.EMPLOYER) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const employerVacancies = await dbClient.execute(
      `select questionnaireId, specialty, moderationStatus, salary, requirements, conditions
      from Vacancy
      where employerId = :employerId
      order by dateOfPublication desc, questionnaireId desc;`,
    { employerId: verifiedToken.userId },
  );

  return {
    props: {
      employerVacancies: employerVacancies.rows as EmployerVacancy[],
    },
  };
};
