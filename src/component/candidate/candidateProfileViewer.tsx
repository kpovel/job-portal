import { renderQuestionnaireInfo } from "~/component/questionnaire/renderQuestionnaireInfo";
import { renderQuestionnaireDetail } from "~/component/questionnaire/renderQuestionnaireDetail";
import { ModerateCandidate } from "~/component/admin/moderation/moderateCandidate";
import type { UserType } from "@prisma/client";
import type { ParsedCandidate } from "~/pages/candidates";

export function CandidateProfileViewer({
  userType,
  candidateData,
}: {
  userType: UserType | undefined;
  candidateData: ParsedCandidate | null;
}) {
  const isAdmin = userType === "ADMIN";
  const candidatesResume = candidateData?.candidate?.questionnaires?.resume;

  return (
    <>
      <div className="w-2/3 rounded-lg border bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold">
          {candidateData?.firstName} {candidateData?.lastName}
          {candidateData?.age ? ` - ${candidateData?.age}` : ""}
        </h2>
        <h3 className="mb-4 text-xl font-medium">
          {candidatesResume?.specialty}
        </h3>
        {renderQuestionnaireDetail(
          "Досвід роботи",
          candidatesResume?.workExperience
        )}
        {renderQuestionnaireDetail("Навички", candidatesResume?.skills)}
        {renderQuestionnaireDetail("Освіта", candidatesResume?.education)}
        {renderQuestionnaireDetail(
          "Іноземні мови",
          candidatesResume?.foreignLanguages
        )}
        {renderQuestionnaireDetail("Інтереси", candidatesResume?.interests)}
        {renderQuestionnaireDetail(
          "Досягнення",
          candidatesResume?.achievements
        )}
        {renderQuestionnaireDetail(
          "Досвід роботи",
          candidatesResume?.workExperience
        )}
      </div>
      <div className="w-1/3 rounded-lg border bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-medium">Контактна інформація</h3>
        {renderQuestionnaireInfo(
          "Бажана зарплата",
          candidatesResume?.desiredSalary
        )}
        {renderQuestionnaireInfo(
          "Бажана зайнятість",
          candidatesResume?.employment
        )}
        {renderQuestionnaireInfo(
          "Номере телефону",
          candidateData?.phoneNumber,
          candidateData?.phoneNumber ? `tel:${candidateData.phoneNumber}` : ""
        )}
        {renderQuestionnaireInfo(
          "Email",
          candidateData?.email,
          candidateData?.email ? `mailto:${candidateData.email}` : ""
        )}
        {renderQuestionnaireInfo(
          "Linkedin",
          candidateData?.linkedinLink,
          candidateData?.linkedinLink
        )}
        {renderQuestionnaireInfo(
          "Github",
          candidateData?.githubLink,
          candidateData?.githubLink
        )}
        {renderQuestionnaireInfo(
          "Telegram",
          candidateData?.telegramLink,
          candidateData?.telegramLink
        )}
        {isAdmin && <ModerateCandidate candidateData={candidateData} />}
      </div>
    </>
  );
}
