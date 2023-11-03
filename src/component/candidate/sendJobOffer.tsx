import { type FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "~/utils/auth/authContext";
import { ChooseVacancyToOffer } from "./chooseVacancyToOffer";
import type { Vacancy } from "~/utils/dbSchema/models";

export function SendJobOffer({ candidateId }: { candidateId: string }) {
  const authContext = useContext(AuthContext);

  const [offerDescription, setOfferDescription] = useState("");
  const [isSentOffer, setIsSentOffer] = useState<boolean>(false);
  const [availableVacancies, setAvailableVacancies] = useState<Vacancy[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);

  function setCurrentVacancy(questionnaireId: string) {
    const selectedVacancy = availableVacancies.find(
      (vacancy) => vacancy.questionnaireId === questionnaireId,
    );
    setSelectedVacancy(selectedVacancy || null);
  }

  const isFormFieldOut = offerDescription.length > 100;

  async function checkIsSentOffer(candidateId: string, employerId: string) {
    try {
      const isSentOffer = await fetch("/api/employer/isSentOffer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId, employerId }),
      });

      type SuccessResponse = {
        message: string;
        isSentOffer: boolean;
      };

      type ErrorResponse = {
        message: string;
        error: string;
      };

      type OfferResponse = SuccessResponse | ErrorResponse;

      const offerResponse = (await isSentOffer.json()) as OfferResponse;
      if ("isSentOffer" in offerResponse) {
        setIsSentOffer(offerResponse.isSentOffer);
      } else if ("error" in offerResponse) {
        console.error(offerResponse.error);
        setIsSentOffer(true);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function getEmployerVacancies(employerId: string): Promise<void> {
    try {
      const response = await fetch("/api/employer/acceptedVacancies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employerId }),
      });

      type SuccessResponse = {
        message: string;
        acceptedVacancies: Vacancy[];
      };

      type ErrorResponse = {
        message: string;
        error: string;
      };

      type OfferResponse = SuccessResponse | ErrorResponse;
      const vacanciesResponse = (await response.json()) as OfferResponse;

      if ("acceptedVacancies" in vacanciesResponse) {
        setAvailableVacancies(vacanciesResponse.acceptedVacancies);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    void getEmployerVacancies(authContext?.id || "");
  }, [authContext?.id]);

  useEffect(() => {
    if (authContext?.id) {
      void checkIsSentOffer(candidateId, authContext.id);
    }
  }, [authContext?.id, candidateId]);

  function handleSubmitCoverLetter(e: FormEvent) {
    e.preventDefault();
    void sendJobOffer();
  }

  async function sendJobOffer() {
    try {
      const sentOffer = await fetch("/api/employer/sendOffer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerId: authContext?.id,
          candidateId,
          offerDescription,
          vacancyId: selectedVacancy?.questionnaireId,
        }),
      });

      if (sentOffer.ok) {
        setIsSentOffer(true);
        setOfferDescription("");
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="container mx-auto mb-6 mt-4 basis-2/3 rounded-lg border bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-xl font-bold">Запропонувати вакансію</h2>
      <form onSubmit={handleSubmitCoverLetter} className="w-full max-w-md">
        <div className="sm:col-span-2">
          <label
            htmlFor="coverLetter"
            className="text-md block font-semibold leading-6 text-gray-900"
          >
            Напишіть опис вакансії:
          </label>
          <div className="mt-2.5">
            <textarea
              name="coverLetter"
              id="coverLetter"
              autoComplete="coverLetter"
              value={offerDescription}
              onChange={(e) => setOfferDescription(e.target.value)}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <p className="text-md block py-2 font-semibold leading-6 text-gray-900">
            Оберіть вакансію яку ви хочете запропонувати кандидатові
          </p>
          <ChooseVacancyToOffer
            vacancies={availableVacancies}
            selectedVacancy={selectedVacancy}
            selectVacancy={setCurrentVacancy}
          />
          <button
            type="submit"
            className={`mt-6 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
            ${
              isSentOffer || !isFormFieldOut || !selectedVacancy
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            {isSentOffer
              ? "Ви вже запронували вакансію цьому кандидату"
              : "Запропонувати вакансію"}
          </button>
        </div>
      </form>
    </div>
  );
}
