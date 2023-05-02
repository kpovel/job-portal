import Link from "next/link";

export function GuestOnlyHeader() {
  return (
    <header className="bg-gray-800 sm:items-stretch sm:justify-start">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-16 content-center items-center">
          <Link
            className="flex-1 flex-shrink-0 items-center text-lg text-white"
            href="/"
          >
            Job Portal
          </Link>
          <div className="space-x-4">
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
            >
              Увійти
            </Link>
            <Link
              href="/signup"
              className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
            >
              Зареєструватись
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
