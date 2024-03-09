import { type FormEvent, useEffect, useState } from "react";
import type { StatusType } from "~/server/db/types/schema";

export function VacancyResponse({
  vacancyId,
  employerId,
}: {
  vacancyId: string;
  employerId: string;
}) {
  const [coverLetter, setCoverLetter] = useState("");
  const [isSentResponse, setIsSentResponse] = useState<boolean>(false);
  const [resumeModerationStatus, setResumeModerationStatus] =
    useState<StatusType["status"]>("PENDING");

  const isFormFieldOut = coverLetter.length > 100;

  useEffect(() => {
    void checkIsSentResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkIsSentResponse(): Promise<void> {
    // todo: find candidate id using token on server side
    try {
      const responsesByCandidate = await fetch(
        "/api/response/findResponsesByCandidate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // candidateId: authContext?.id,
            vacancyId,
          }),
        },
      );

      if (responsesByCandidate.ok) {
        const parsedResponses = (await responsesByCandidate.json()) as {
          isSentResponse: boolean;
          resumeModerationStatus: StatusType["status"];
          message: string;
        };

        setIsSentResponse(parsedResponses.isSentResponse);
        setResumeModerationStatus(parsedResponses.resumeModerationStatus);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function handleSubmitCoverLetter(e: FormEvent) {
    e.preventDefault();
    void sendResponse();
  }

  async function sendResponse() {
    try {
      // todo: find candidate id using token on server side
      await fetch("/api/response/responseOnVacancy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // candidateId,
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

    if (resumeModerationStatus === "PENDING") {
      return "Почекайте допоки адміністратор не підтвердить вашу анкету";
    }

    return "Відгукнутись на вакансію";
  }

  return (
    <div className="container mx-auto mb-6 mt-4 flex flex-col rounded-lg border bg-white p-6 shadow-lg">
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
            disabled={
              isSentResponse ||
              !isFormFieldOut ||
              resumeModerationStatus === "PENDING"
            }
            className={`mt-6 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              isSentResponse ||
              !isFormFieldOut ||
              resumeModerationStatus === "PENDING"
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
