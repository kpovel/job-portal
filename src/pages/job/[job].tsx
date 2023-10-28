import { Layout } from "~/component/layout/layout";
import { dbClient } from "~/server/db";
import type { GetStaticPaths, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useContext } from "react";
import { format } from "date-fns";
import { renderQuestionnaireDetail } from "~/component/questionnaire/renderQuestionnaireDetail";
import { renderQuestionnaireInfo } from "~/component/questionnaire/renderQuestionnaireInfo";
import { AuthContext } from "~/utils/auth/authContext";
import { ModerateJob } from "~/component/admin/moderation/moderateJob";
import { VacancyResponse } from "~/component/vacancy/vacancyResponse";
import type { Vacancy } from "~/utils/dbSchema/models";

type VacancyPreview = Vacancy & {
  companyName: string | null;
  companyAddress: string | null;
  phoneNumber: string | null;
  email: string | null;
  linkedinLink: string | null;
};

export default function Job({
  vacancy,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const authContext = useContext(AuthContext);
  const isAdmin = authContext?.userType === "ADMIN";
  const isCandidate = authContext?.userType === "CANDIDATE";

  return (
    <>
      <Head>
        <title>Job Portal – {vacancy.specialty}</title>
      </Head>
      <Layout>
        <div className="container mx-auto mt-6 flex flex-row gap-4">
          <div className="basis-2/3 rounded-lg border bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold">{vacancy.specialty}</h2>
            {renderQuestionnaireDetail("Обов'язки", vacancy.duties)}
            {renderQuestionnaireDetail("Вимоги", vacancy.requirements)}
            {renderQuestionnaireDetail("Умови", vacancy.conditions)}
            {renderQuestionnaireDetail("Графік роботи", vacancy.workSchedule)}
            {renderQuestionnaireDetail("Тип зайнятості", vacancy.employment)}
            <div className="mb-4">
              <strong className="text-lg font-semibold">
                Дата публікації:
              </strong>
              <p className="mt-2 text-gray-700">
                {vacancy.dateOfPublication &&
                  format(
                    new Date(vacancy.dateOfPublication),
                    "d MMMM yyyy, HH:mm",
                  )}
              </p>
            </div>
          </div>
          <div className="w-28 basis-1/3 rounded-lg border bg-white p-6 shadow-lg">
            {renderQuestionnaireInfo(
              "Salary",
              vacancy.salary && `$${vacancy.salary}`,
            )}
            {renderQuestionnaireInfo("Company name", vacancy.companyName)}
            {renderQuestionnaireInfo("Company address", vacancy.companyAddress)}
            {renderQuestionnaireInfo(
              "Phone number",
              vacancy.phoneNumber,
              vacancy.phoneNumber && `tel:${vacancy.phoneNumber}`,
            )}
            {renderQuestionnaireInfo(
              "Email",
              vacancy.email,
              vacancy.email && `mailto:${vacancy.email}`,
            )}
            {renderQuestionnaireInfo(
              "Linkedin link",
              vacancy.linkedinLink,
              vacancy.linkedinLink,
            )}
            {isAdmin && (
              <ModerateJob
                moderationStatus={vacancy.moderationStatus}
                questionnaireId={vacancy.questionnaireId}
              />
            )}
          </div>
        </div>
        {isCandidate && (
          <VacancyResponse
            vacancyId={vacancy.questionnaireId}
            employerId={vacancy.employerId}
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
  const vacancyQuery = await dbClient.execute(
    "select questionnaireId from Vacancy;",
  );
  const vacancies = vacancyQuery.rows as { questionnaireId: string }[];

  const paths: StaticPath[] = vacancies.map((job) => ({
    params: { job: job.questionnaireId },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }: StaticPath) => {
  const vacancyQuery = await dbClient.execute(
    `select Vacancy.*,
       companyName,
       companyAddress,
       phoneNumber,
       email,
       linkedinLink
    from Vacancy
         inner join Employer on Employer.employerId = Vacancy.employerId
         inner join User on User.id = Vacancy.employerId
    where questionnaireId = :questionnaireId;`,
    { questionnaireId: params.job },
  );

  const vacancy = vacancyQuery.rows[0] as VacancyPreview;

  return {
    props: {
      vacancy,
    },
    revalidate: 20,
  };
};
