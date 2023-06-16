import type { Vacancy } from "@prisma/client";

export function ChooseVacancyToOffer({ vacancies }: { vacancies: Vacancy[] }) {
  // todo: select a vacancy to send an offer
  return <div>Choose a vacancy</div>;
}
