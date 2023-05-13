import type { VacancyFields } from "~/pages/home/create-vacancy";
import React from "react";
import { FormInput } from "~/component/profileForm/formInput";

export function VacancyInputField(props: {
  formData: { [p: string]: string | number } & VacancyFields;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <FormInput
        label="Посада"
        id="specialty"
        name="specialty"
        autoComplete="specialty"
        type="text"
        value={props.formData.specialty}
        onChange={props.onChange}
      />
      <FormInput
        label="Зарплата"
        id="salary"
        name="salary"
        autoComplete="salary"
        type="text"
        value={props.formData.salary}
        onChange={props.onChange}
      />
      <FormInput
        label="Обов'язки"
        id="duties"
        name="duties"
        autoComplete="duties"
        type="text"
        value={props.formData.duties}
        onChange={props.onChange}
      />
      <FormInput
        label="Вимоги"
        id="requirements"
        name="requirements"
        autoComplete="requirements"
        type="text"
        value={props.formData.requirements}
        onChange={props.onChange}
      />
      <FormInput
        label="Умови праці"
        id="conditions"
        name="conditions"
        autoComplete="conditions"
        type="text"
        value={props.formData.conditions}
        onChange={props.onChange}
      />
      <FormInput
        label="Графік роботи"
        id="workSchedule"
        name="workSchedule"
        autoComplete="workSchedule"
        type="text"
        value={props.formData.workSchedule}
        onChange={props.onChange}
      />
      <FormInput
        label="Тип зайнятості"
        id="employment"
        name="employment"
        autoComplete="employment"
        type="text"
        value={props.formData.employment}
        onChange={props.onChange}
      />
    </div>
  );
}
