import { useRouter } from "next/router";
import Link from "next/link";
import { classNames } from "~/component/layout/elements/header";

export function AdminNavigationMenu() {
  const router = useRouter();
  const isActivePage = (currentPage: string) => currentPage === router.pathname;

  const navigation: { name: string; href: string }[] = [
    { name: "Резюме кандидатів", href: "/admin/candidates" },
    { name: "Вакансії компаній", href: "/admin/employer" },
  ];

  return (
    <div className="flex space-x-4">
      {navigation.map((item) => {
        return (
          <Link
            key={item.name}
            href={item.href}
            className={classNames(
              isActivePage(item.href)
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-700 hover:text-white",
              "rounded-md px-3 py-2 text-sm font-medium"
            )}
            aria-current={isActivePage(item.href) ? "page" : undefined}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
