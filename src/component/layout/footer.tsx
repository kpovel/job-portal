import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-800 py-3">
      <div className="container mx-auto flex flex-col items-start justify-between px-3 text-gray-300">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
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
        <div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
            <div className=" text-center text-sm">
              З гордістю зроблено в Україні 🇺🇦
            </div>
            <div className="text-center text-sm">
              © {new Date().getFullYear()} Job portal
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
