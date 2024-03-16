import { Layout } from "~/component/layout/layout";
import Head from "next/head";
import { EmployerNavigationMenu } from "~/component/employer/employerNavigationMenu";
import { type FormEvent, type ChangeEvent, useState } from "react";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { VacancyInputField } from "~/component/employer/vacancyInputField";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import { dbClient } from "~/server/db";
import type { User } from "~/server/db/types/schema";

export type VacancyFields = {
  specialty: string;
  salary: string;
  duties: string;
  requirements: string;
  conditions: string;
  work_schedule: string;
  employment: string;
};

export default function CreateVacancy() {
  const router = useRouter();

  const [formData, setFormData] = useState<VacancyFields>({
    specialty: "",
    salary: "",
    duties: "",
    requirements: "",
    conditions: "",
    work_schedule: "",
    employment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleUpdateForm(event: ChangeEvent<HTMLInputElement>) {
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

  async function createVacancy() {
    setSubmitting(true);
    try {
      const createdVacancy = await fetch("/api/employer/createVacancy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (createdVacancy.status === 201) {
        await router.push("/home/vacancies");
        return;
      }

      const text = await createdVacancy.text();
      setError(text);
    } catch (e) {
      console.error(e);
      setError("Vacancy creation error");
    }
    setSubmitting(false);
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
              className="mt-6 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5
              text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-indigo-600 disabled:bg-indigo-600/50"
              aria-disabled={submitting}
              disabled={submitting}
            >
              Створити нову вакансію
            </button>
            <div className="text-red-500">{error}</div>
          </form>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
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

  const employerQuery = await dbClient.execute({
    sql: "\
select user.id \
from user \
         inner join user_type on user_type.id = user.user_type_id \
where user.id = :employer_id \
  and user_type_id = (select id from user_type where type = 'EMPLOYER');",
    args: { employer_id: verifiedToken.userId },
  });

  const employer = employerQuery.rows[0] as Pick<User, "id"> | undefined;

  if (!employer) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
