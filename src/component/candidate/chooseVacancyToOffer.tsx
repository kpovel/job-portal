import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import type { AcceptedVacancy } from "./sendJobOffer";

export function ChooseVacancyToOffer({
  vacancies,
  selectedVacancy,
  selectVacancy,
}: {
  vacancies: AcceptedVacancy[];
  selectedVacancy: AcceptedVacancy | null;
  selectVacancy: (questionnaireId: string) => void;
}) {
  return (
    <Select.Root
      value={selectedVacancy?.vacancy_uuid}
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
                    key={vacancy.vacancy_uuid}
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

function SelectVacancy({ vacancy }: { vacancy: AcceptedVacancy }) {
  return (
    <Select.Item
      className="text-s relative my-1 flex h-7 select-none items-center rounded px-6 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet-500 data-[disabled]:text-gray-400 data-[highlighted]:text-purple-50 data-[highlighted]:outline-none"
      value={vacancy.vacancy_uuid}
    >
      <Select.ItemText>{vacancy.specialty}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 inline-flex w-6 items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
}
