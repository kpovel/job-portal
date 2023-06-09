import React, { type FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "~/utils/auth/authContext";
import type { Response } from "@prisma/client";
import type { ModerationStatus } from "@prisma/client";
import { api } from "~/utils/api";

export function VacancyResponse({
  vacancyId,
  employerId,
}: {
  vacancyId: string;
  employerId: string;
}) {
  const authContext = useContext(AuthContext);

  const [coverLetter, setCoverLetter] = useState("");
  const [isSentResponse, setIsSentResponse] = useState<boolean>(false);
  const [moderationStatus, setModerationStatus] =
    useState<ModerationStatus>("PENDING");
  const isFormFieldOut = coverLetter.length > 100;

  const { data: candidatesQuestionnaire } =
    api.candidate.findQuestionnaireByCandidateId.useQuery({
      candidateId: authContext?.id || "",
    });

  useEffect(() => {
    if (candidatesQuestionnaire) {
      setModerationStatus(candidatesQuestionnaire.moderationStatus);
    }
  }, [candidatesQuestionnaire]);

  useEffect(() => {
    void checkIsSentResponse();
  }, []);

  async function checkIsSentResponse(): Promise<void> {
    try {
      const responsesByCandidate = await fetch(
        "/api/response/findResponsesByCandidate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            candidateId: authContext?.id,
            vacancyId,
          }),
        }
      );

      const parsedResponses = (await responsesByCandidate.json()) as {
        responsesByCandidate: Response[];
        message: string;
      };

      const isExistResponseOnTheVacancy =
        parsedResponses.responsesByCandidate.find(
          (element) =>
            element.vacancyId === vacancyId &&
            element.candidateId === authContext?.id
        );

      setIsSentResponse(!!isExistResponseOnTheVacancy);
    } catch (e) {
      console.log(e);
    }
  }

  function handleSubmitCoverLetter(e: FormEvent) {
    e.preventDefault();
    void sendResponse();
  }

  async function sendResponse() {
    const candidateId = authContext?.id;

    try {
      await fetch("/api/response/responseOnVacancy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId,
          employerId,
          vacancyId,
          coverLetter,
        }),
      });

      setIsSentResponse(true);
      setCoverLetter("");
    } catch (e) {
      console.log(e);
    }
  }

  function buttonText() {
    if (isSentResponse) {
      return "Ви вже відправили відгук на цю вакансію";
    }

    if (moderationStatus === "PENDING") {
      return "Почекайте допоки адміністратор не підтвердить вашу анкету";
    }

    return "Відгукнутись на вакансію";
  }

  return (
    <div className="container mx-auto mt-4 mb-6 flex flex-col rounded-lg border bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-xl font-bold">Надішліть відгук на вакансію</h2>
      <form onSubmit={handleSubmitCoverLetter} className="w-full max-w-md">
        <div className="sm:col-span-2">
          <label
            htmlFor="coverLetter"
            className="text-md block font-semibold leading-6 text-gray-900"
          >
            Супровідний лист:
          </label>
          <div className="mt-2.5">
            <textarea
              name="coverLetter"
              id="coverLetter"
              autoComplete="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <button
            type="submit"
            className={`mt-6 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              isSentResponse ||
              !isFormFieldOut ||
              moderationStatus === "PENDING"
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            {buttonText()}
          </button>
        </div>
      </form>
    </div>
  );
}
