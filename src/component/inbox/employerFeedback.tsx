import type { FeedbackResult, ResponseResult } from "@prisma/client";
import { type FormEvent, useState, useContext } from "react";
import { AuthContext } from "~/utils/auth/authContext";
import { UserType } from "~/utils/dbSchema/userType";

export function EmployerFeedback({
  feedback,
  responseId,
}: {
  feedback: FeedbackResult | null;
  responseId: string;
}) {
  const [feedbackResult, setFeedbackResult] = useState<FeedbackResult | null>(
    feedback,
  );
  const [isOpenFeedbackMenu, setIsOpenFeedbackMany] = useState<boolean>(false);
  const [feedbackContent, setFeedbackContent] = useState<string>("");
  const [responseResult, setResponseResult] = useState<ResponseResult | null>(
    null,
  );
  const authContext = useContext(AuthContext);

  function handleSubmitForm(e: FormEvent) {
    e.preventDefault();
    void sendFeedbackResult();
  }

  async function sendFeedbackResult() {
    try {
      const response = await fetch("/api/response/createFeedbackResult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responseId,
          responseResult,
          feedbackContent,
        }),
      });
      const parsedFeedback = (await response.json()) as FeedbackResult;

      if (response.ok) {
        setFeedbackResult(parsedFeedback);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      {feedbackResult ? (
        <div>
          <p>
            <strong>Результат відгуку: </strong>
            {feedbackResult.responseResult}
          </p>
          <p className="pt-2">
            <strong>Відповідь на пропозицію: </strong>
            {feedbackResult.response}
          </p>
        </div>
      ) : (
        <button
          onClick={() => setIsOpenFeedbackMany(!isOpenFeedbackMenu)}
          className="mt-2 rounded-md border bg-gray-300 p-2"
        >
          Відповісти{" "}
          {authContext?.userType === UserType.EMPLOYER ? "кандидату" : "роботодавцю"}
        </button>
      )}
      {isOpenFeedbackMenu && !feedbackResult && (
        <form className="container my-6 max-w-md" onSubmit={handleSubmitForm}>
          <textarea
            className="my-6 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={feedbackContent}
            onChange={(e) => setFeedbackContent(e.target.value)}
          />

          <div className="flex gap-4">
            <button
              type="submit"
              className="rounded-md border bg-red-400 p-2"
              onClick={() => setResponseResult("REJECTED")}
            >
              Відхилити
            </button>
            <button
              type="submit"
              className="rounded-md border bg-green-400 p-2"
              onClick={() => setResponseResult("ACCEPTED")}
            >
              Прийняти
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
