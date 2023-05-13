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
import { FormInput } from "~/component/profileForm/formInput";

export default function Jobs({
  employer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const parsedEmployerData: EmployerData = superjson.parse(employer);

  type VacancyFields = {
    specialty: string;
    salary: string;
    duties: string;
    requirements: string;
    conditions: string;
    workSchedule: string;
    employment: string;
  };

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
      await fetch("/api/employer/createVacancy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          employerId: parsedEmployerData?.id,
        }),
      });
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
            <div className="space-y-4">
              <FormInput
                label="Посада"
                id="specialty"
                name="specialty"
                autoComplete="specialty"
                type="text"
                value={formData.specialty}
                onChange={handleUpdateForm}
              />
              <FormInput
                label="Зарплата"
                id="salary"
                name="salary"
                autoComplete="salary"
                type="text"
                value={formData.salary}
                onChange={handleUpdateForm}
              />
              <FormInput
                label="Обов'язки"
                id="duties"
                name="duties"
                autoComplete="duties"
                type="text"
                value={formData.duties}
                onChange={handleUpdateForm}
              />
              <FormInput
                label="Вимоги"
                id="requirements"
                name="requirements"
                autoComplete="requirements"
                type="text"
                value={formData.requirements}
                onChange={handleUpdateForm}
              />
              <FormInput
                label="Умови праці"
                id="conditions"
                name="conditions"
                autoComplete="conditions"
                type="text"
                value={formData.conditions}
                onChange={handleUpdateForm}
              />
              <FormInput
                label="Графік роботи"
                id="workSchedule"
                name="workSchedule"
                autoComplete="workSchedule"
                type="text"
                value={formData.workSchedule}
                onChange={handleUpdateForm}
              />
              <FormInput
                label="Тип зайнятості"
                id="employment"
                name="employment"
                autoComplete="employment"
                type="text"
                value={formData.employment}
                onChange={handleUpdateForm}
              />
            </div>
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
