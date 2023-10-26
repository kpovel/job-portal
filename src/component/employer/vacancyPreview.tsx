import type { Vacancy } from "@prisma/client";
import Link from "next/link";
import { format } from "date-fns";

export function VacancyPreview({
  vacancy,
}: {
  vacancy: Omit<Vacancy, "employerId" | "moderationStatus">;
}) {
  return (
    <div className="w-full rounded-md border border-gray-300 p-4">
      <Link href={`/job/${vacancy.questionnaireId}`}>
        <div className="mb-3 flex items-center">
          <div className="font-bold text-blue-600 hover:text-blue-800">
            {vacancy.specialty}
          </div>
        </div>
      </Link>
      {vacancy.salary && (
        <div className="mb-2">
          <strong>Зарплата:</strong> ${vacancy.salary}
        </div>
      )}
      {vacancy.duties && (
        <div className="mb-2">
          <strong>Обов&apos;язки:</strong> {vacancy.duties}
        </div>
      )}
      {vacancy.requirements && (
        <div className="mb-2">
          <strong>Вимоги:</strong> {vacancy.requirements}
        </div>
      )}
      {vacancy.conditions && (
        <div className="mb-2">
          <strong>Умови:</strong> {vacancy.conditions}
        </div>
      )}
      {vacancy.workSchedule && (
        <div className="mb-2">
          <strong>Графік роботи:</strong> {vacancy.workSchedule}
        </div>
      )}
      {vacancy.employment && (
        <div className="mb-2">
          <strong>Тип зайнятості:</strong> {vacancy.employment}
        </div>
      )}
      <div className="mb-2">
        <strong>Опубліковано:</strong>{" "}
        {format(new Date(vacancy.dateOfPublication), "d MMMM yyyy, HH:mm")}
      </div>
    </div>
  );
}
