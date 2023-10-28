import { useContext } from "react";
import { AuthContext } from "~/utils/auth/authContext";
import { type ResponseResult, UserType } from "dbSchema/enums";

export function EmployerApplication({
  response,
  responseResult
}: {
  responseResult: ResponseResult | null;
  response: string | null
}) {
  const authContext = useContext(AuthContext);
  const noFeedbackMessage =
    authContext?.userType === UserType.EMPLOYER
      ? "Кандидат ще не відповів на вашу пропозицію"
      : "Роботодавець ще не відповів на ваш відгук";

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
        <p>
          <strong>Результат відгуку: </strong>
          {noFeedbackMessage}
        </p>
      )}
    </div>
  );
}
