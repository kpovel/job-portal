import Head from "next/head";
import { type GetServerSideProps } from "next";
import { Layout } from "~/component/layout/layout";
import { withoutAuth } from "~/utils/auth/withoutAuth";

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

export const getServerSideProps: GetServerSideProps = withoutAuth();
