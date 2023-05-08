import React, { type ChangeEvent, type FormEvent, useState } from "react";
import { FormInput } from "~/component/profileForm/formInput";
import type { ParsedCandidateData } from "~/pages/my/profile";

export type FormInputConfig = {
  label: string;
  type: string;
  name: string;
  autoComplete?: string;
  id: string;
};

const formInputs: FormInputConfig[] = [
  {
    label: "Прізвище",
    type: "text",
    name: "lastName",
    id: "lastName",
    autoComplete: "family-name",
  },
  {
    label: "Імʼя",
    type: "text",
    name: "firstName",
    id: "firstName",
    autoComplete: "given-name",
  },
  {
    label: "Вік",
    type: "text",
    name: "age",
    id: "age",
    autoComplete: "age",
  },
  {
    label: "Номер телефону",
    type: "tel",
    name: "phoneNumber",
    id: "phoneNumber",
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
    name: "linkedinLink",
    id: "linkedinLink",
    autoComplete: "LinkedIn",
  },
  {
    label: "Посилання на GitHub акаунт",
    type: "url",
    name: "githubLink",
    id: "githubLink",
    autoComplete: "GitHub",
  },
  {
    label: "Посилання на Telegram акаунт",
    type: "url",
    name: "telegramLink",
    id: "telegramLink",
    autoComplete: "Telegram",
  },
];

/**
 * CandidateAccountForm component for rendering a form that allows candidates to update their account data.
 *
 * @prop {Function} onFormSubmit - A function that handles form submission.
 */
type CandidateAccountFormProps = {
  candidateData: ParsedCandidateData;
};

export type CandidateFields = {
  firstName: string;
  lastName: string;
  age: string;
  phoneNumber: string;
  email: string;
  linkedinLink: string;
  githubLink: string;
  telegramLink: string;
};

type FormData = {
  [key: string]: string;
} & CandidateFields;

export function CandidateAccountForm({
  candidateData,
}: CandidateAccountFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: candidateData?.firstName ?? "",
    lastName: candidateData?.lastName ?? "",
    age: candidateData?.age ?? "",
    phoneNumber: candidateData?.phoneNumber ?? "",
    email: candidateData?.email ?? "",
    linkedinLink: candidateData?.linkedinLink ?? "",
    githubLink: candidateData?.githubLink ?? "",
    telegramLink: candidateData?.telegramLink ?? "",
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function handleFormSubmit(e: FormEvent): void {
    e.preventDefault();
    void updateCandidateAccountData();
  }

  async function updateCandidateAccountData(): Promise<void> {
    try {
      await fetch("/api/user/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: candidateData?.id }),
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="mx-auto my-5 max-w-xl">
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
              value={formData[formInput.name] as string}
              onChange={handleInputChange}
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
  );
}
