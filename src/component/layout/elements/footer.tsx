import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-800 py-4">
      <div className="container mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-5 text-gray-300 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
          <span className="items-center text-xl font-semibold text-white">
            Job portal
          </span>
          <div className="space-x-4">
            <Link href="/privacy" className="text-sm hover:text-white">
              Політика приватності
            </Link>
            <a
              href="https://savelife.in.ua/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-white"
            >
              Повернись живим
            </a>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          <div className=" text-center text-sm">
            З гордістю зроблено в Україні 🇺🇦
          </div>
          <div className="text-center text-sm">
            © {new Date().getFullYear()} Job portal
          </div>
        </div>
      </div>
    </footer>
  );
}
