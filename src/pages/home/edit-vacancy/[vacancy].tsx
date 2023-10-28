import Head from "next/head";
import { Layout } from "~/component/layout/layout";
import { dbClient } from "~/server/db";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { EmployerNavigationMenu } from "~/component/employer/employerNavigationMenu";
import { type FormEvent, useState } from "react";
import type { VacancyFields } from "~/pages/home/create-vacancy";
import { VacancyInputField } from "~/component/employer/vacancyInputField";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";

type Vacancy = {
  questionnaireId: string;
  specialty: string;
  salary: string | null;
  duties: string | null;
  requirements: string | null;
  conditions: string | null;
  workSchedule: string | null;
  employment: string | null;
};

export default function EditVacancy({
  vacancy,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [formData, setFormData] = useState<VacancyFields>({
    specialty: vacancy.specialty,
    salary: vacancy.salary || "",
    duties: vacancy.duties || "",
    requirements: vacancy.requirements || "",
    conditions: vacancy.conditions || "",
    workSchedule: vacancy.workSchedule || "",
    employment: vacancy.employment || "",
  });

  function handleUpdateForm(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleUpdateVacancy(e: FormEvent) {
    e.preventDefault();
    void updateVacancy();
  }

  async function updateVacancy(): Promise<void> {
    try {
      await fetch("/api/employer/updateVacancy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          questionnaireId: vacancy.questionnaireId,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Head>
        <title>Job Portal – Редагування вакансії</title>
      </Head>
      <Layout>
        <div className="container mx-auto my-4 mb-8 flex flex-col items-center space-y-8">
          <EmployerNavigationMenu />
          <hr className="w-full border-gray-300" />
          <form
            onSubmit={handleUpdateVacancy}
            className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
          >
            <VacancyInputField
              formData={formData}
              onChange={handleUpdateForm}
            />
            <button
              type="submit"
              className="mt-6 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Оновити дані вакансії
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext & {
    params: { vacancy: string };
  },
) {
  const authToken = context.req?.cookies[AUTHORIZATION_TOKEN_KEY];
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

  const vacancyQuery = await dbClient.execute(
    `select questionnaireId, specialty, salary, duties, requirements, conditions, workSchedule, employment
    from Vacancy where questionnaireId = :questionnaireId and employerId = :employerId;`,
    {
      questionnaireId: context.params.vacancy,
      employerId: verifiedToken.userId,
    },
  );

  const vacancy = vacancyQuery.rows[0] as Vacancy | undefined;

  if (!vacancy) {
    return {
      redirect: {
        destination: "/home/vacancies",
        permanent: false,
      },
    };
  }

  return {
    props: {
      vacancy,
    },
  };
}
