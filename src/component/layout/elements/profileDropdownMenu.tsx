import { Menu, Transition } from "@headlessui/react";
import { Fragment, useContext } from "react";
import Link from "next/link";
import { classNames } from "~/component/layout/elements/header";
import { AuthContext } from "~/utils/auth/authContext";
import Cookie from "js-cookie";
import { AUTHORIZATION_TOKEN_KEY } from "~/utils/auth/authorizationTokenKey";

export function ProfileDropdownMenu() {
  const authUser = useContext(AuthContext);
  const previewName =
    authUser?.firstName && authUser?.lastName
      ? authUser.firstName.slice(0, 1) + authUser.lastName.slice(0, 1)
      : authUser?.login.slice(0, 2);

  function signOut() {
    Cookie.set(AUTHORIZATION_TOKEN_KEY, "");
  }

  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
      {/*todo: add profile status*/}
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
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700"
                  )}
                >
                  Your Profile
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700"
                  )}
                >
                  Settings
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  onClick={signOut}
                  href="/"
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700"
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
