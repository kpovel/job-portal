import { Layout } from "~/component/layout/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import { verifyToken } from "~/utils/auth/auth";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import type { GetServerSidePropsContext } from "next";
import superjson from "superjson";

export default function EmployeeProfile() {
  return <Layout>employee profile</Layout>;
}

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const authToken = req?.cookies[AUTHORIZATION_TOKEN_KEY] ?? "";
  const verifiedToken = verifyToken(authToken) as VerifyToken | null;

  const caller = appRouter.createCaller({ prisma });
  const employerData = await caller.employer.findEmployeeById({
    employerId: verifiedToken?.userId ?? "",
  });

  const isUserEmployer = employerData?.userType === "EMPLOYER";

  if (!verifiedToken || !isUserEmployer) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const serializedEmployerData = superjson.stringify(employerData);

  return {
    props: {
      employer: serializedEmployerData,
    },
  };
};
