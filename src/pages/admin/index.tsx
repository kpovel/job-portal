import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import { Layout } from "~/component/layout/layout";
import { AdminNavigationMenu } from "~/component/admin/adminNavigationMenu";
import React from "react";
import Head from "next/head";

export default function Admin({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  return (
    <>
      <Head>
        <title>Job Portal – Hello admin!</title>
      </Head>
      <Layout>
        <div className="container mx-auto my-4 flex flex-col items-center space-y-8">
          <AdminNavigationMenu />
          <hr className="w-full border-gray-300" />
          <h1>Welcome to the club, buddy!</h1>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const authToken = context.req.cookies[AUTHORIZATION_TOKEN_KEY] || "";
  const verifiedToken = verifyToken(authToken) as VerifyToken | null;

  if (!verifiedToken) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const caller = appRouter.createCaller({ prisma });
  const admin = await caller.admin.findAdminById({
    adminId: verifiedToken.userId,
  });

  const isValidAdmin = admin && admin.userType === "ADMIN";

  if (!isValidAdmin) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { admin },
  };
};
