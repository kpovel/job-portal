import Head from "next/head";
import { Layout } from "~/component/layout/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getEmployerData } from "~/utils/getEmployerData/getEmployerData";
import superjson from "superjson";
import type { EmployerData } from "~/pages/home/profile";
import { EmployerNavigationMenu } from "~/component/employer/employerNavigationMenu";
import React, { type FormEvent, useState } from "react";
import type { VacancyFields } from "~/pages/home/create-vacancy";
import type { Questionnaire, Vacancy } from "@prisma/client";
import { VacancyInputField } from "~/component/employer/vacancyInputField";

export default function EditVacancy({
  vacancy,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const parsedVacancy: Questionnaire & {
    vacancy: Vacancy;
  } = superjson.parse(vacancy || "");

  type FormData = {
    [key: string]: string | number;
  } & VacancyFields;

  const [formData, setFormData] = useState<FormData>({
    specialty: parsedVacancy.vacancy.specialty || "",
    salary: parsedVacancy.vacancy.salary || "",
    duties: parsedVacancy.vacancy.duties || "",
    requirements: parsedVacancy.vacancy.requirements || "",
    conditions: parsedVacancy.vacancy.conditions || "",
    workSchedule: parsedVacancy.vacancy.workSchedule || "",
    employment: parsedVacancy.vacancy.employment || "",
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
          questionnaireId: parsedVacancy.vacancy.questionnaireId,
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext & {
    params: { vacancy: string };
  }
) => {
  const vacancyId = context.params.vacancy;
  const employer = await getEmployerData(context);
  const employerSerialized = employer?.props?.employer as string;
  const employerData: EmployerData = superjson.parse(employerSerialized);

  const caller = appRouter.createCaller({ prisma });
  const vacancy = await caller.employer.getQuestionnaireById({
    questionnaireId: vacancyId,
  });

  if (employerData.id !== vacancy?.employerId) {
    return {
      props: {},
      redirect: {
        destination: "/jobs",
        permanent: false,
      },
    };
  }

  return {
    props: {
      vacancy: superjson.stringify(vacancy),
    },
  };
};
