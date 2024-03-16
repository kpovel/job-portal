import { Layout } from "~/component/layout/layout";
import { EmployerNavigationMenu } from "~/component/employer/employerNavigationMenu";
import { type ChangeEvent, type FormEvent, useState } from "react";
import Head from "next/head";
import { FormInput } from "~/component/profileForm/formInput";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { dbClient } from "~/server/db";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import type { Employer } from "~/server/db/types/schema";

export default function About({
  employerCompany,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [formData, setFormData] = useState({
    company_name: employerCompany.company_name ?? "",
    company_address: employerCompany.company_address ?? "",
  });
  const [submitting, setSubmitting] = useState(false);

  function handleUpdateForm(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleUpdateEmployerCompany(e: FormEvent) {
    e.preventDefault();
    void updateEmployerCompanyData();
  }

  async function updateEmployerCompanyData(): Promise<void> {
    setSubmitting(true);
    try {
      await fetch("/api/employer/updateCompanyData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (e) {
      console.log(e);
    }
    setSubmitting(false);
  }

  return (
    <>
      <Head>
        <title>Job Portal – Про компанію</title>
      </Head>
      <Layout>
        <div className="container mx-auto my-4 flex flex-col items-center space-y-8">
          <EmployerNavigationMenu />
          <hr className="w-full border-gray-300" />
          <form
            onSubmit={handleUpdateEmployerCompany}
            className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
          >
            <div className="space-y-4">
              <FormInput
                label="Назва компанії"
                id="company_name"
                name="company_name"
                autoComplete="company_name"
                type="text"
                value={formData.company_name}
                onChange={handleUpdateForm}
              />
              <FormInput
                label="Адреса компанії"
                id="company_address"
                name="company_address"
                autoComplete="company_address"
                type="text"
                value={formData.company_address}
                onChange={handleUpdateForm}
              />
            </div>
            <button
              type="submit"
              className="mt-6 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5
              text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-indigo-600 disabled:bg-indigo-600/50"
              aria-disabled={submitting}
              disabled={submitting}
            >
              Оновити дані компанії
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

  const aboutEmployerQuery = await dbClient.execute({
    sql: "\
select company_address, company_name \
from user\
         left join employer on user.id = employer.id \
where user.id = :employer_id \
  and user_type_id = (select id from user_type where type = 'EMPLOYER');",
    args: { employer_id: verifiedToken.userId },
  });

  const employerCompany = aboutEmployerQuery.rows[0] as
    | Pick<Employer, "company_name" | "company_address">
    | undefined;

  if (!employerCompany) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      employerCompany,
    },
  };
};
