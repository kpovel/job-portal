import Head from "next/head";
import { type GetServerSideProps } from "next";
import { Layout } from "~/component/layout/layout";
import { withoutAuth } from "~/utils/auth/withoutAuth";
import Image from "next/image";
import JobPortalLogo from "~/../public/images/job-portal-logo.png";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <Head>
        <title>Job Portal</title>
        <meta name="description" content="Job Portal Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex flex-col items-center justify-center">
          <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <Image
                src={JobPortalLogo}
                alt="Job Portal logo"
                className="mx-auto mb-8 h-20 w-auto"
              ></Image>
              <h1 className="mb-4 text-4xl font-bold text-gray-800">
                Job Portal
              </h1>
              <h2 className="mb-6 text-2xl font-semibold text-gray-700">
                Надійний сайт пошуку роботи
              </h2>
              <div className="max-w-2xl text-xl text-gray-600">
                Ви описуєте свій досвід, очікування від роботи та побажання по
                зарплаті, а компанії пропонують вакансії. Тільки ви вирішуєте,
                кому і коли відкрити контакти.
              </div>
              <div className="mt-8">
                <Link
                  href="/signup"
                  className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 active:bg-blue-800"
                >
                  Розпочати пошук роботи
                </Link>
              </div>
            </div>
          </div>
          <div className="mx-auto flex w-screen flex-col content-center items-center justify-center bg-gray-100 px-4 py-16">
            <div className="container">
              <h2 className="mb-8 text-center text-3xl font-semibold">
                Особливості
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="text-center">
                  <i className="fas fa-search mb-4 text-5xl"></i>
                  <h3 className="mb-4 text-2xl font-semibold">Швидкий пошук</h3>
                  <p>
                    Знайдіть вакансії, що відповідають вашим навичкам та
                    бажанням.
                  </p>
                </div>
                <div className="text-center">
                  <i className="fas fa-users mb-4 text-5xl"></i>
                  <h3 className="mb-4 text-2xl font-semibold">
                    Велика база роботодавців
                  </h3>
                  <p>Сотні компаній з різних галузей шукають співробітників.</p>
                </div>
                <div className="text-center">
                  <i className="fas fa-cog mb-4 text-5xl"></i>
                  <h3 className="mb-4 text-2xl font-semibold">
                    Персональні налаштування
                  </h3>
                  <p>Налаштуйте пошук вакансій відповідно до ваших потреб.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="mb-8 text-3xl font-semibold">
                Почніть пошук роботи сьогодні
              </h2>
              <p className="mx-auto mb-8 max-w-2xl">
                Зареєструйтеся на Job Portal та отримайте доступ до великої
                кількості вакансій від провідних компаній.
              </p>
              <Link
                href="/signup"
                className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 active:bg-blue-800"
              >
                Реєстрація
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = withoutAuth();
