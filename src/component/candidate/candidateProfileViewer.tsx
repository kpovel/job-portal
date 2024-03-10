import { RenderQuestionnaireInfo } from "~/component/questionnaire/renderQuestionnaireInfo";
import { RenderQuestionnaireDetail } from "~/component/questionnaire/renderQuestionnaireDetail";
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
        {RenderQuestionnaireDetail(
          "Досвід роботи",
          candidateResume?.workExperience,
        )}
        {RenderQuestionnaireDetail("Навички", candidateResume?.skills)}
        {RenderQuestionnaireDetail("Освіта", candidateResume?.education)}
        {RenderQuestionnaireDetail(
          "Іноземні мови",
          candidateResume?.foreignLanguages,
        )}
        {RenderQuestionnaireDetail("Інтереси", candidateResume?.interests)}
        {RenderQuestionnaireDetail("Досягнення", candidateResume?.achievements)}
      </div>
      <div className="w-1/3 rounded-lg border bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-medium">Контактна інформація</h3>
        {RenderQuestionnaireInfo(
          "Бажана зарплата",
          candidateResume?.desiredSalary,
        )}
        {RenderQuestionnaireInfo(
          "Бажана зайнятість",
          candidateResume?.employment,
        )}
        {RenderQuestionnaireInfo(
          "Номере телефону",
          candidateResume?.phoneNumber,
          candidateResume?.phoneNumber
            ? `tel:${candidateResume.phoneNumber}`
            : "",
        )}
        {RenderQuestionnaireInfo(
          "Email",
          candidateResume?.email,
          candidateResume?.email ? `mailto:${candidateResume.email}` : "",
        )}
        {RenderQuestionnaireInfo(
          "Linkedin",
          candidateResume?.linkedinLink,
          candidateResume?.linkedinLink,
        )}
        {RenderQuestionnaireInfo(
          "Github",
          candidateResume?.githubLink,
          candidateResume?.githubLink,
        )}
        {RenderQuestionnaireInfo(
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
