import { type ChangeEvent, type FormEvent, useState } from "react";
import { FormInput } from "~/component/profileForm/formInput";
import type { NestedCandidateProfile } from "~/pages/my/profile";

type ResumeInput = {
  label: string;
  type: string;
  name: string;
  id: string;
};

const resumeInputs: ResumeInput[] = [
  {
    label: "Досвід роботи",
    type: "text",
    name: "workExperience",
    id: "workExperience",
  },
  {
    label: "Навички",
    type: "text",
    name: "skills",
    id: "skills",
  },
  {
    label: "Освіта",
    type: "text",
    name: "education",
    id: "education",
  },
  {
    label: "Іноземні мови",
    type: "text",
    name: "foreignLanguages",
    id: "foreignLanguages",
  },
  {
    label: "Інтереси",
    type: "text",
    name: "interests",
    id: "interests",
  },
  {
    label: "Досягнення",
    type: "text",
    name: "achievements",
    id: "achievements",
  },
  {
    label: "Посада",
    type: "text",
    name: "specialty",
    id: "specialty",
  },
  {
    label: "Очікувана заробітня плата",
    type: "text",
    name: "desiredSalary",
    id: "desiredSalary",
  },
  {
    label: "Бажана зайнятість",
    type: "text",
    name: "employment",
    id: "employment",
  },
];

type FormData = {
  [key: string]: string;
} & NestedCandidateProfile["resume"];

export function CandidateResumeForm({
  candidateResume,
  candidateId,
}: {
  candidateResume: NestedCandidateProfile["resume"];
  candidateId: string
}) {
  const [formData, setFormData] = useState<FormData>({
    workExperience: candidateResume.workExperience ?? "",
    skills: candidateResume.skills ?? "",
    education: candidateResume.education ?? "",
    foreignLanguages: candidateResume.foreignLanguages ?? "",
    interests: candidateResume.interests ?? "",
    achievements: candidateResume.achievements ?? "",
    specialty: candidateResume.specialty ?? "",
    desiredSalary: candidateResume.desiredSalary ?? "",
    employment: candidateResume.employment ?? "",
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  function handleFormSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    void updateCandidateResume();
  }

  async function updateCandidateResume(): Promise<void> {
    await fetch("/api/candidate/updateResume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        candidateId
      }),
    });
  }

  return (
    <form onSubmit={handleFormSubmit} className="mx-auto my-5 max-w-xl">
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        {resumeInputs.map((resumeInput) => {
          return (
            <FormInput
              key={resumeInput.id}
              type={resumeInput.type}
              label={resumeInput.label}
              name={resumeInput.name}
              id={resumeInput.id}
              value={formData[resumeInput.name] as string}
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
          Оновити моє резюме
        </button>
      </div>
    </form>
  );
}
