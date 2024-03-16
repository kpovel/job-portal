import { type ChangeEvent, type FormEvent, useState } from "react";
import { FormInput } from "~/component/profileForm/formInput";
import type { NestedCandidateProfile } from "~/pages/my/profile";

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
    name: "last_name",
    id: "lastName",
    autoComplete: "family-name",
  },
  {
    label: "Імʼя",
    type: "text",
    name: "first_name",
    id: "firstName",
    autoComplete: "given-name",
  },
  {
    label: "Номер телефону",
    type: "tel",
    name: "phone_number",
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
    name: "linkedin_link",
    id: "linkedinLink",
    autoComplete: "LinkedIn",
  },
  {
    label: "Посилання на GitHub акаунт",
    type: "url",
    name: "github_link",
    id: "githubLink",
    autoComplete: "GitHub",
  },
];

/**
 * CandidateAccountForm component for rendering a form that allows candidates to update their account data.
 */
export function CandidateAccountForm({
  candidateData,
}: {
  candidateData: NestedCandidateProfile["candidate"];
}) {
  const [formData, setFormData] = useState({
    first_name: candidateData.first_name ?? "",
    last_name: candidateData.last_name ?? "",
    phone_number: candidateData.phone_number ?? "",
    email: candidateData.email ?? "",
    linkedin_link: candidateData.linkedin_link ?? "",
    github_link: candidateData.github_link ?? "",
  });
  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);
    try {
      await fetch("/api/user/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
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
              value={formData[formInput.name as never]}
              onChange={handleInputChange}
            />
          );
        })}
      </div>
      <button
        type="submit"
        className="mt-10 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5
          text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-indigo-600 disabled:bg-indigo-600/50"
        aria-disabled={submitting}
        disabled={submitting}
      >
        Оновити дані мого акаунту
      </button>
    </form>
  );
}
