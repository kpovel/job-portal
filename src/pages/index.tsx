import Head from "next/head";
import { Layout } from "~/component/layout/layout";

export default function Home() {
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
}
