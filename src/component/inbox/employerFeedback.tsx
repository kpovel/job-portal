import { type FormEvent, useState, useContext } from "react";
import { AuthContext } from "~/utils/auth/authContext";
import { ResponseResult, UserType } from "dbSchema/enums";

export function EmployerFeedback({
  response,
  responseresult,
  responseId,
}: {
  response: string | null;
  responseresult: ResponseResult | null;
  responseId: string;
}) {
  const [isOpenFeedbackMenu, setIsOpenFeedbackMany] = useState<boolean>(false);
  const [feedbackContent, setFeedbackContent] = useState<string>("");
  const [responseResult, setResponseResult] = useState<ResponseResult | null>(
    responseresult,
  );
  const authContext = useContext(AuthContext);

  function handleSubmitForm(e: FormEvent) {
    e.preventDefault();
    void sendFeedbackResult();
  }

  async function sendFeedbackResult() {
    try {
      // should I handle the request?
      await fetch("/api/response/createFeedbackResult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responseId,
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
            {response}
          </p>
        </div>
      ) : (
        <button
          onClick={() => setIsOpenFeedbackMany(!isOpenFeedbackMenu)}
          className="mt-2 rounded-md border bg-gray-300 p-2"
        >
          Відповісти{" "}
          {authContext?.userType === UserType.EMPLOYER
            ? "кандидату"
            : "роботодавцю"}
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
              onClick={() => setResponseResult(ResponseResult.REJECTED)}
            >
              Відхилити
            </button>
            <button
              type="submit"
              className="rounded-md border bg-green-400 p-2"
              onClick={() => setResponseResult(ResponseResult.ACCEPTED)}
            >
              Прийняти
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
