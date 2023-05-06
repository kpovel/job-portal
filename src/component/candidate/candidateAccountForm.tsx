import React, { type ChangeEvent, type FormEvent, useState } from "react";
import { FormInput } from "~/component/profileForm/formInput";

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
    name: "firstName",
    id: "firstName",
    autoComplete: "given-name",
  },
  {
    label: "Імʼя",
    type: "text",
    name: "lastName",
    id: "lastName",
    autoComplete: "family-name",
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

export function CandidateAccountForm({
  onFormSubmit,
}: {
  onFormSubmit: (e: FormEvent) => void;
}) {
  const [formData, setFormData] = useState(
    Object.fromEntries(formInputs.map(({ name }) => [name, ""]))
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <form onSubmit={onFormSubmit} className="mx-auto my-5 max-w-xl">
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
