import { Menu, Transition } from "@headlessui/react";
import { Fragment, useContext } from "react";
import Link from "next/link";
import { classNames } from "~/component/layout/elements/header";
import { AuthContext } from "~/utils/auth/authContext";
import Cookie from "js-cookie";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";
import type { UserType } from "~/server/db/types/schema";

export function ProfileDropdownMenu() {
  const authContext = useContext(AuthContext);
  const userType = authContext?.type as UserType["type"];
  const previewName =
    authContext?.first_name && authContext?.last_name
      ? authContext.first_name.slice(0, 1) + authContext.last_name.slice(0, 1)
      : authContext?.login.slice(0, 2);

  function signOut() {
    Cookie.set(AUTHORIZATION_TOKEN_KEY, "");
  }

  const navigationsLinks: {
    [key in UserType["type"]]: { name: string; href: string }[];
  } = {
    CANDIDATE: [{ name: "Мій профіль", href: "/my/profile" }],
    EMPLOYER: [
      { name: "Мій профіль", href: "/home/profile" },
      { name: "Про компанію", href: "/home/about" },
      { name: "Мої вакансії", href: "/home/vacancies" },
    ],
    ADMIN: [
      { name: "Головна", href: "/admin" },
      { name: "Кандидати", href: "/admin/candidates" },
      { name: "Вакансії", href: "/admin/employer" },
    ],
  };

  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
      <Menu as="div" className="relative ml-3">
        <div>
          <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="sr-only">Open user menu</span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
              <span className="font-medium leading-none text-white">
                {previewName?.toUpperCase()}
              </span>
            </span>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {navigationsLinks[userType].map((item) => {
              return (
                <Menu.Item key={item.href}>
                  {({ active }) => (
                    <Link
                      href={item.href}
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700",
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </Menu.Item>
              );
            })}
            <Menu.Item>
              {({ active }) => (
                <Link
                  onClick={signOut}
                  href="/"
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700",
                  )}
                >
                  Вийти
                </Link>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
