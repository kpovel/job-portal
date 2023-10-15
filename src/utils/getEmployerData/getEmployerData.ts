import type { GetServerSidePropsContext } from "next";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import type { VerifyToken } from "~/utils/auth/withoutAuth";
import { verifyToken } from "~/utils/auth/auth";

export async function getEmployerData(context: GetServerSidePropsContext) {
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

  const caller = appRouter.createCaller({ prisma });
  const employerData = await caller.employer.findEmployeeById({
    employerId: verifiedToken.userId,
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
}
