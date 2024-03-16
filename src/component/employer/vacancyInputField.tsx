import type { VacancyFields } from "~/pages/home/create-vacancy";
import { FormInput } from "~/component/profileForm/formInput";
import type { ChangeEvent } from "react";

export function VacancyInputField({
  formData,
  onChange,
}: {
  formData: VacancyFields;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <FormInput
        label="Посада"
        id="specialty"
        name="specialty"
        autoComplete="specialty"
        type="text"
        value={formData.specialty}
        onChange={onChange}
      />
      <FormInput
        label="Зарплата"
        id="salary"
        name="salary"
        autoComplete="salary"
        type="text"
        value={formData.salary}
        onChange={onChange}
      />
      <FormInput
        label="Обов'язки"
        id="duties"
        name="duties"
        autoComplete="duties"
        type="text"
        value={formData.duties}
        onChange={onChange}
      />
      <FormInput
        label="Вимоги"
        id="requirements"
        name="requirements"
        autoComplete="requirements"
        type="text"
        value={formData.requirements}
        onChange={onChange}
      />
      <FormInput
        label="Умови праці"
        id="conditions"
        name="conditions"
        autoComplete="conditions"
        type="text"
        value={formData.conditions}
        onChange={onChange}
      />
      <FormInput
        label="Графік роботи"
        id="work_schedule"
        name="work_schedule"
        autoComplete="work_schedule"
        type="text"
        value={formData.work_schedule}
        onChange={onChange}
      />
      <FormInput
        label="Тип зайнятості"
        id="employment"
        name="employment"
        autoComplete="employment"
        type="text"
        value={formData.employment}
        onChange={onChange}
      />
    </div>
  );
}
