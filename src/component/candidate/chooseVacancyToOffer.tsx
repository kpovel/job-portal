import type { Vacancy } from "@prisma/client";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

export function ChooseVacancyToOffer({
  vacancies,
  selectedVacancy,
  selectVacancy
}: {
  vacancies: Vacancy[];
  selectedVacancy: Vacancy | null;
  selectVacancy: (questionnaireId: string) => void

}) {
  return (
    <Select.Root
      value={selectedVacancy?.questionnaireId}
      onValueChange={selectVacancy}
    >
      <Select.Trigger
        className="inline-flex h-9 items-center justify-center gap-2 rounded border bg-white px-[15px] leading-none shadow-xl outline-none hover:bg-gray-50"
        aria-label="вакансії"
      >
        <Select.Value placeholder="Оберіть вакансію" />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden rounded-md border bg-white shadow-xl">
          <Select.ScrollUpButton className="flex h-6 cursor-default items-center justify-center bg-white text-purple-800">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-2">
            <Select.Group>
              <Select.Label className="h-7 px-6 text-base leading-6">
                Оберіть вакансію
              </Select.Label>
              {vacancies.map((vacancy) => {
                return (
                  <SelectVacancy
                    key={vacancy.questionnaireId}
                    vacancy={vacancy}
                  />
                );
              })}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className="flex h-6 cursor-default items-center justify-center bg-white text-purple-800">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

const SelectVacancy = ({ vacancy }: { vacancy: Vacancy }) => {
  return (
    <Select.Item
      className="text-s relative my-1 flex h-7 select-none items-center rounded px-6 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet-500 data-[disabled]:text-gray-400 data-[highlighted]:text-purple-50 data-[highlighted]:outline-none"
      value={vacancy.questionnaireId}
    >
      <Select.ItemText>{vacancy.specialty}</Select.ItemText>
      {/* todo: add vacancy desctiption*/}
      <Select.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
};
