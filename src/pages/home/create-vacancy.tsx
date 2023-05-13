import { Layout } from "~/component/layout/layout";
import Head from "next/head";
import { EmployerNavigationMenu } from "~/component/employer/employerNavigationMenu";
import React, { type FormEvent, useState } from "react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getEmployerData } from "~/utils/getEmployerData/getEmployerData";
import type { EmployerData } from "~/pages/home/profile";
import superjson from "superjson";
import { useRouter } from "next/router";
import { VacancyInputField } from "~/component/employer/vacancyInputField";

export type VacancyFields = {
  specialty: string;
  salary: string;
  duties: string;
  requirements: string;
  conditions: string;
  workSchedule: string;
  employment: string;
};

export default function CreateVacancy({
  employer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const parsedEmployerData: EmployerData = superjson.parse(employer);

  type FormData = {
    [key: string]: string | number;
  } & VacancyFields;

  const [formData, setFormData] = useState<FormData>({
    specialty: "",
    salary: "",
    duties: "",
    requirements: "",
    conditions: "",
    workSchedule: "",
    employment: "",
  });

  function handleUpdateForm(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleCreateVacancy(e: FormEvent) {
    e.preventDefault();
    void createVacancy();
  }

  async function createVacancy(): Promise<void> {
    try {
      const createdVacancy = await fetch("/api/employer/createVacancy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          employerId: parsedEmployerData?.id,
        }),
      });
      if (!createdVacancy.ok) throw new Error("Error creating vacancy");
      await router.push("/home/vacancies");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <Head>
        <title>Job Portal - Створити вакансію</title>
      </Head>
      <Layout>
        <div className="container mx-auto my-4 mb-8 flex flex-col items-center space-y-8">
          <EmployerNavigationMenu />
          <hr className="w-full border-gray-300" />
          <form
            onSubmit={handleCreateVacancy}
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
              Створити нову вакансію
            </button>
          </form>
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
