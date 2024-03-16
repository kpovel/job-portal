import { useContext } from "react";
import type { StatusType } from "~/server/db/types/schema";
import { AuthContext } from "~/utils/auth/authContext";

export function EmployerApplication({
  feedbackResponse,
  feedbackStatus,
}: {
  feedbackResponse: string | null;
  feedbackStatus: StatusType["status"] | null;
}) {
  const authContext = useContext(AuthContext);
  const noFeedbackMessage =
    authContext?.type === "EMPLOYER"
      ? "Кандидат ще не відповів на вашу пропозицію"
      : "Роботодавець ще не відповів на ваш відгук";

  return (
    <div>
      {feedbackStatus ? (
        <div>
          <p>
            <strong>Результат відгуку: </strong>
            {feedbackResponse}
          </p>
          <p className="pt-2">
            <strong>Відповідь на пропозицію: </strong>
            {feedbackStatus}
          </p>
        </div>
      ) : (
        <p>
          <strong>Результат відгуку: </strong>
          {noFeedbackMessage}
        </p>
      )}
    </div>
  );
}
