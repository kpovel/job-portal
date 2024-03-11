import { RenderQuestionnaireInfo } from "~/component/questionnaire/renderQuestionnaireInfo";
import { RenderQuestionnaireDetail } from "~/component/questionnaire/renderQuestionnaireDetail";
import { ModerateCandidate } from "~/component/admin/moderation/moderateCandidate";
import type { ResumePreview } from "~/pages/candidate/[candidate]";
import type { UserType } from "~/server/db/types/schema";

export function CandidateProfileViewer({
  userType,
  candidateResume,
}: {
  userType: UserType["type"] | undefined;
  candidateResume: ResumePreview;
}) {
  const isAdmin = userType === "ADMIN";

  return (
    <>
      <div className="w-2/3 rounded-lg border bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold">
          {candidateResume.first_name} {candidateResume.last_name}
        </h2>
        <h3 className="mb-4 text-xl font-medium">
          {candidateResume.specialty}
        </h3>
        <RenderQuestionnaireDetail
          title="Досвід роботи"
          data={candidateResume.work_experience}
        />
        <RenderQuestionnaireDetail
          title="Навички"
          data={candidateResume.skills}
        />
        <RenderQuestionnaireDetail
          title="Освіта"
          data={candidateResume.education}
        />
        <RenderQuestionnaireDetail
          title="Іноземні мови"
          data={candidateResume.foreign_languages}
        />
        <RenderQuestionnaireDetail
          title="Інтереси"
          data={candidateResume.interests}
        />
        <RenderQuestionnaireDetail
          title="Досягнення"
          data={candidateResume.achievements}
        />
      </div>
      <div className="w-1/3 rounded-lg border bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-medium">Контактна інформація</h3>
        <RenderQuestionnaireInfo
          title="Бажана зарплата"
          data={candidateResume.desired_salary}
        />
        <RenderQuestionnaireInfo
          title="Бажана зайнятість"
          data={candidateResume.employment}
        />
        <RenderQuestionnaireInfo
          title="Номере телефону"
          data={candidateResume.phone_number}
          href={
            candidateResume?.phone_number
              ? `tel:${candidateResume.phone_number}`
              : ""
          }
        />
        <RenderQuestionnaireInfo
          title="Email"
          data={candidateResume.email}
          href={candidateResume.email ? `mailto:${candidateResume.email}` : ""}
        />
        <RenderQuestionnaireInfo
          title="Linkedin"
          data={candidateResume.linkedin_link}
          href={candidateResume.linkedin_link}
        />
        <RenderQuestionnaireInfo
          title="Github"
          data={candidateResume.github_link}
          href={candidateResume.github_link}
        />
        {isAdmin && (
          <ModerateCandidate
            candidateUUID={candidateResume.user_uuid}
            moderationStatus={candidateResume.status}
          />
        )}
      </div>
    </>
  );
}
