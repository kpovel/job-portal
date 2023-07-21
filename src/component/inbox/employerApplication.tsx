import type { FeedbackResult } from "@prisma/client";

export function EmployerApplication({
  feedback,
}: {
  feedback: FeedbackResult | null;
}) {
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
          Кандидат ще не відповів на вашу пропозицію
        </p>
      )}
    </div>
  );
}
