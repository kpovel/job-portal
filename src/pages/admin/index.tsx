import type { GetServerSidePropsContext } from "next";
import { Layout } from "~/component/layout/layout";
import { AdminNavigationMenu } from "~/component/admin/adminNavigationMenu";
import Head from "next/head";
import { adminOnlyAccess } from "~/utils/admin/adminOnlyAccess";

export default function Admin() {
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const isAdmin = await adminOnlyAccess(context);

  if (!isAdmin) {
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
