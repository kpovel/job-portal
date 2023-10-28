import { renderQuestionnaireInfo } from "~/component/questionnaire/renderQuestionnaireInfo";
import { renderQuestionnaireDetail } from "~/component/questionnaire/renderQuestionnaireDetail";
import { ModerateCandidate } from "~/component/admin/moderation/moderateCandidate";
import { UserType } from "~/utils/dbSchema/enums";
import type { ResumePreview } from "~/pages/candidate/[candidate]";

export function CandidateProfileViewer({
  userType,
  candidateResume,
}: {
  userType: UserType | undefined;
  candidateResume: ResumePreview;
}) {
  const isAdmin = userType === UserType.ADMIN;

  return (
    <>
      <div className="w-2/3 rounded-lg border bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold">
          {candidateResume?.firstName} {candidateResume?.lastName}
          {candidateResume?.age ? ` - ${candidateResume?.age}` : ""}
        </h2>
        <h3 className="mb-4 text-xl font-medium">
          {candidateResume?.specialty}
        </h3>
        {renderQuestionnaireDetail(
          "Досвід роботи",
          candidateResume?.workExperience,
        )}
        {renderQuestionnaireDetail("Навички", candidateResume?.skills)}
        {renderQuestionnaireDetail("Освіта", candidateResume?.education)}
        {renderQuestionnaireDetail(
          "Іноземні мови",
          candidateResume?.foreignLanguages,
        )}
        {renderQuestionnaireDetail("Інтереси", candidateResume?.interests)}
        {renderQuestionnaireDetail("Досягнення", candidateResume?.achievements)}
      </div>
      <div className="w-1/3 rounded-lg border bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-medium">Контактна інформація</h3>
        {renderQuestionnaireInfo(
          "Бажана зарплата",
          candidateResume?.desiredSalary,
        )}
        {renderQuestionnaireInfo(
          "Бажана зайнятість",
          candidateResume?.employment,
        )}
        {renderQuestionnaireInfo(
          "Номере телефону",
          candidateResume?.phoneNumber,
          candidateResume?.phoneNumber
            ? `tel:${candidateResume.phoneNumber}`
            : "",
        )}
        {renderQuestionnaireInfo(
          "Email",
          candidateResume?.email,
          candidateResume?.email ? `mailto:${candidateResume.email}` : "",
        )}
        {renderQuestionnaireInfo(
          "Linkedin",
          candidateResume?.linkedinLink,
          candidateResume?.linkedinLink,
        )}
        {renderQuestionnaireInfo(
          "Github",
          candidateResume?.githubLink,
          candidateResume?.githubLink,
        )}
        {renderQuestionnaireInfo(
          "Telegram",
          candidateResume?.telegramLink,
          candidateResume?.telegramLink,
        )}
        {isAdmin && candidateResume?.questionnaireId && (
          <ModerateCandidate
            questionnaireId={candidateResume.questionnaireId}
            moderationStatus={candidateResume.moderationStatus}
          />
        )}
      </div>
    </>
  );
}
