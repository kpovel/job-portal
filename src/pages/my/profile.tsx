import { Layout } from "~/component/layout/layout";
import { type FormEvent } from "react";
import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { FormInput } from "~/component/profileForm/formInput";

export type FormInputConfig = {
  label: string;
  type: string;
  name: string;
  autoComplete: string;
  id: string;
};

const formInputs: FormInputConfig[] = [
  {
    label: "Прізвище",
    type: "text",
    name: "first-name",
    id: "first-name",
    autoComplete: "given-name",
  },
  {
    label: "Імʼя",
    type: "text",
    name: "last-name",
    id: "last-name",
    autoComplete: "family-name",
  },
  {
    label: "Вік",
    type: "text",
    name: "company",
    id: "company",
    autoComplete: "organization",
  },
  {
    label: "Номер телефону",
    type: "tel",
    name: "phone-number",
    id: "phone-number",
    autoComplete: "tel",
  },
  {
    label: "Електронна пошта",
    type: "email",
    name: "email",
    id: "email",
    autoComplete: "email",
  },
  {
    label: "Посилання на LinkedIn акаунт",
    type: "url",
    name: "url",
    id: "LinedInUrl",
    autoComplete: "LinkedIn",
  },
  {
    label: "Посилання на GitHub акаунт",
    type: "url",
    name: "GitHubUrl",
    id: "GitHubUrl",
    autoComplete: "GitHub",
  },
  {
    label: "Посилання на Telegram акаунт",
    type: "url",
    name: "TelegramUrl",
    id: "TelegramUrl",
    autoComplete: "Telegram",
  },
];

export default function Profile() {
  function updateCandidateData(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <Layout>
      <div className="isolate px-6 lg:px-8">
        <div
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="flex h-full items-center justify-center">
          <div className="mx-auto w-full max-w-3xl">
            <Tabs.Root
              className="my-8 flex-col rounded-md border border-slate-500"
              defaultValue="tab1"
            >
              <Tabs.List
                className="border-mauve6 flex shrink-0 border-b"
                aria-label="Manage your account"
              >
                <Tabs.Trigger
                  className="text-mauve11 hover:text-violet11 data-[state=active]:text-violet11 flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none outline-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative"
                  value="tab1"
                >
                  Мій акаунт
                </Tabs.Trigger>
                <Tabs.Trigger
                  className="text-mauve11 hover:text-violet11 data-[state=active]:text-violet11 flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none outline-none first:rounded-tl-md last:rounded-tr-md data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative"
                  value="tab2"
                >
                  Резюме
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content
                className="rounded-b-md bg-white p-5 outline-none"
                value="tab1"
              >
                <form
                  onSubmit={updateCandidateData}
                  className="mx-auto my-5 max-w-xl"
                >
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    {formInputs.map((formInput) => {
                      return (
                        <FormInput
                          key={formInput.id}
                          type={formInput.type}
                          label={formInput.label}
                          name={formInput.name}
                          id={formInput.id}
                          autoComplete={formInput.autoComplete}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-10">
                    <button
                      type="submit"
                      className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Оновити дані мого акаунту
                    </button>
                  </div>
                </form>
              </Tabs.Content>
              <Tabs.Content value="tab2">some content</Tabs.Content>
            </Tabs.Root>
          </div>
        </div>
      </div>
    </Layout>
  );
}
