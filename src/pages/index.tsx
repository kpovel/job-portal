import Head from "next/head";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { Layout } from "~/component/layout/layout";
import { parse as parseCookies } from "cookie";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";

const Home = () => {
  return (
    <>
      <Head>
        <title>Job Portal</title>
        <meta name="description" content="Job Portal Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>job portal</Layout>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { req } = context;
  const parsedCookies = parseCookies(req.headers.cookie ?? "");

  if (parsedCookies[AUTHORIZATION_TOKEN_KEY]) {
    return Promise.resolve({
      redirect: {
        destination: "/jobs",
        permanent: false,
      },
    });
  }

  return Promise.resolve({
    props: {},
  });
};
