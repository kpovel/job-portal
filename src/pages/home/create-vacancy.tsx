import { Layout } from "~/component/layout/layout";
import Head from "next/head";
import { EmployerNavigationMenu } from "~/component/employer/employerNavigationMenu";
import React, { type FormEvent, useState } from "react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import { VacancyInputField } from "~/component/employer/vacancyInputField";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import { dbClient } from "~/server/db";
import { UserType } from "~/utils/dbSchema/enums";

export type VacancyFields = {
  specialty: string;
  salary: string;
  duties: string;
  requirements: string;
  conditions: string;
  workSchedule: string;
  employment: string;
};

type Employer = {
  id: string;
  userType: UserType;
};

export default function CreateVacancy({
  employer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

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
          employerId: employer.id,
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

  const employerQuery = await dbClient.execute(
    `select id, userType from User where id = :employerId;`,
    { employerId: verifiedToken.userId },
  );

  const employer = employerQuery.rows[0] as Employer;

  if (employer.userType !== UserType.EMPLOYER) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      employer
    },
  };
};
