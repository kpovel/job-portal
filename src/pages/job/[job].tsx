import { Layout } from "~/component/layout/layout";
import { dbClient } from "~/server/db";
import type { GetStaticPaths, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useContext } from "react";
import { format } from "date-fns";
import { RenderQuestionnaireDetail } from "~/component/questionnaire/renderQuestionnaireDetail";
import { RenderQuestionnaireInfo } from "~/component/questionnaire/renderQuestionnaireInfo";
import { AuthContext } from "~/utils/auth/authContext";
import { ModerateJob } from "~/component/admin/moderation/moderateJob";
import { VacancyResponse } from "~/component/vacancy/vacancyResponse";
import type {
  Employer,
  StatusType,
  User,
  Vacancy,
} from "~/server/db/types/schema";

export default function Job({
  vacancy,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const authContext = useContext(AuthContext);
  const isAdmin = authContext?.type === "ADMIN";
  const isCandidate = authContext?.type === "CANDIDATE";

  return (
    <>
      <Head>
        <title>Job Portal – {vacancy.specialty}</title>
      </Head>
      <Layout>
        <div className="container mx-auto mt-6 flex flex-row gap-4">
          <div className="basis-2/3 rounded-lg border bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold">{vacancy.specialty}</h2>
            <RenderQuestionnaireDetail
              title="Обов'язки"
              data={vacancy.duties}
            />
            <RenderQuestionnaireDetail
              title="Вимоги"
              data={vacancy.requirements}
            />
            <RenderQuestionnaireDetail
              title="Умови"
              data={vacancy.conditions}
            />
            <RenderQuestionnaireDetail
              title="Графік роботи"
              data={vacancy.work_schedule}
            />
            <RenderQuestionnaireDetail
              title="Тип зайнятості"
              data={vacancy.employment}
            />
            <div className="mb-4">
              <strong className="text-lg font-semibold">
                Дата публікації:
              </strong>
              <p className="mt-2 text-gray-700">
                {vacancy.publication_date &&
                  format(
                    new Date(vacancy.publication_date),
                    "d MMMM yyyy, HH:mm",
                  )}
              </p>
            </div>
          </div>
          <div className="w-28 basis-1/3 rounded-lg border bg-white p-6 shadow-lg">
            <RenderQuestionnaireInfo
              title="Salary"
              data={vacancy.salary && `$${vacancy.salary}`}
            />
            <RenderQuestionnaireInfo
              title="Company name"
              data={vacancy.company_name}
            />
            <RenderQuestionnaireInfo
              title="Company address"
              data={vacancy.company_address}
            />
            <RenderQuestionnaireInfo
              title="Phone number"
              data={vacancy.phone_number}
              href={vacancy.phone_number && `tel:${vacancy.phone_number}`}
            />
            <RenderQuestionnaireInfo
              title="Email"
              data={vacancy.email}
              href={vacancy.email && `mailto:${vacancy.email}`}
            />
            <RenderQuestionnaireInfo
              title="Linkedin link"
              data={vacancy.linkedin_link}
              href={vacancy.linkedin_link}
            />
            {isAdmin && (
              <ModerateJob
                moderationStatus={vacancy.status}
                questionnaireId={vacancy.status}
              />
            )}
          </div>
        </div>
        {isCandidate && (
          <VacancyResponse
            vacancyId={vacancy.status}
            employerId={vacancy.status}
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
    "select vacancy_uuid from vacancy;",
  );
  const vacancies = vacancyQuery.rows as never as Pick<
    Vacancy,
    "vacancy_uuid"
  >[];

  const paths: StaticPath[] = vacancies.map((job) => ({
    params: { job: job.vacancy_uuid },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }: StaticPath) => {
  const vacancyQuery = await dbClient.execute({
    sql: "\
select v.vacancy_uuid,\
       v.employer_id,\
       v.specialty,\
       v.salary,\
       v.duties,\
       v.requirements,\
       v.conditions,\
       v.work_schedule,\
       v.employment,\
       v.publication_date,\
       status,\
       company_name,\
       company_address,\
       phone_number,\
       email,\
       linkedin_link \
from vacancy v \
         inner join employer on employer.id = v.employer_id \
         inner join user on user.id = v.employer_id \
         inner join status_type on v.moderation_status_id = status_type.id \
where v.vacancy_uuid = :vacancy_uuid;",
    args: { vacancy_uuid: params.job },
  });

  const vacancy = vacancyQuery.rows[0] as never as Omit<Vacancy, "id"> &
    Pick<StatusType, "status"> &
    Omit<Employer, "id"> &
    Pick<User, "phone_number" | "email" | "linkedin_link">;

  return {
    props: {
      vacancy,
    },
    revalidate: 20,
  };
};
