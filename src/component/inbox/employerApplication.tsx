import type { FeedbackResult } from "@prisma/client";
import { useContext } from "react";
import { AuthContext } from "~/utils/auth/authContext";
import { UserType } from "../../utils/dbSchema/userType";

export function EmployerApplication({
  feedback,
}: {
  feedback: FeedbackResult | null;
}) {
  const authContext = useContext(AuthContext);
  const noFeedbackMessage =
    authContext?.userType === UserType.EMPLOYER
      ? "Кандидат ще не відповів на вашу пропозицію"
      : "Роботодавець ще не відповів на ваш відгук";

  return (
    <div>
      {feedback ? (
        <div>
          <p>
            <strong>Результат відгуку: </strong>
            {feedback.responseResult}
          </p>
          <p className="pt-2">
            <strong>Відповідь на пропозицію: </strong>
            {feedback.response}
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
