import { Layout } from "~/component/layout/layout";
import { EmployerNavigationMenu } from "~/component/employer/employerNavigationMenu";
import React, { type ChangeEvent, type FormEvent, useState } from "react";
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
import { UserType } from "~/utils/dbSchema/enums";

type AboutEmployer = {
  id: string;
  userType: UserType;
  companyName: string | null;
  companyAddress: string | null;
};

export default function About({
   employerCompany,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  type FormData = {
    [key: string]: string | number;
    companyName: string;
    companyAddress: string;
  };

  const [formData, setFormData] = useState<FormData>({
    companyName: employerCompany.companyName ?? "",
    companyAddress: employerCompany.companyAddress ?? "",
  });

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
    try {
      await fetch("/api/employer/updateCompanyData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          employerId: employerCompany.id,
        }),
      });
    } catch (e) {
      console.log(e);
    }
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
                id="companyName"
                name="companyName"
                autoComplete="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleUpdateForm}
              />
              <FormInput
                label="Адреса компанії"
                id="companyAddress"
                name="companyAddress"
                autoComplete="companyAddress"
                type="text"
                value={formData.companyAddress}
                onChange={handleUpdateForm}
              />
            </div>
            <button
              type="submit"
              className="mt-6 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

  const aboutEmployerQuery = await dbClient.execute(
    `select id, userType, companyAddress, companyName
      from User
      left join Employer on User.id = Employer.employerId
      where id = :employerId;`,
    { employerId: verifiedToken.userId },
  );

  const employerCompany = aboutEmployerQuery.rows[0] as AboutEmployer;

  if (employerCompany.userType !== UserType.EMPLOYER) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      employerCompany
    },
  };
};
