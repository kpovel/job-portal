import { type FormEvent, useState, useContext } from "react";
import type { StatusType } from "~/server/db/types/schema";
import { AuthContext } from "~/utils/auth/authContext";

export function EmployerFeedback({
  feedbackResponse,
  feedbackStatus,
  responseUUID,
}: {
  feedbackResponse: string | null;
  feedbackStatus: StatusType["status"] | null;
  responseUUID: string;
}) {
  const [isOpenFeedbackMenu, setIsOpenFeedbackMany] = useState<boolean>(false);
  const [feedbackContent, setFeedbackContent] = useState<string>("");
  const [responseResult, setResponseResult] = useState<
    StatusType["status"] | null
  >(feedbackStatus);
  const authContext = useContext(AuthContext);

  function handleSubmitForm(e: FormEvent) {
    e.preventDefault();
    void sendFeedbackResult();
  }

  async function sendFeedbackResult() {
    try {
      // todo: update api
      await fetch("/api/response/createFeedbackResult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responseUUID,
          responseResult,
          feedbackContent,
        }),
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      {responseResult ? (
        <div>
          <p>
            <strong>Результат відгуку: </strong>
            {responseResult}
          </p>
          <p className="pt-2">
            <strong>Відповідь на пропозицію: </strong>
            {feedbackResponse}
          </p>
        </div>
      ) : (
        <button
          onClick={() => setIsOpenFeedbackMany(!isOpenFeedbackMenu)}
          className="mt-2 rounded-md border bg-gray-300 p-2"
        >
          Відповісти{" "}
          {authContext?.type === "EMPLOYER" ? "кандидату" : "роботодавцю"}
        </button>
      )}
      {isOpenFeedbackMenu && !responseResult && (
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
