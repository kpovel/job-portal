import Link from "next/link";
import type { ResumePreview } from "~/pages/candidates";

export function CandidateResumePreview({ resume }: { resume: ResumePreview }) {
  return (
    <div className="rounded-md border border-gray-300 p-4">
      <Link
        href={`/candidate/${resume.user_uuid}`}
        className="mb-3 flex items-center"
      >
        <div>
          <div className="font-bold text-blue-600  hover:text-blue-800">
            {resume.first_name} {resume.last_name}
          </div>
          <div className="text-sm text-gray-500">{resume.specialty}</div>
        </div>
      </Link>
      {resume.work_experience && (
        <div className="mb-2">
          <strong>Work Experience:</strong> {resume.work_experience}
        </div>
      )}
      {resume.skills && (
        <div className="mb-2">
          <strong>Skills:</strong> {resume.skills}
        </div>
      )}
      {resume.education && (
        <div className="mb-2">
          <strong>Education:</strong> {resume.education}
        </div>
      )}
      {resume.foreign_languages && (
        <div className="mb-2">
          <strong>Foreign Languages:</strong> {resume.foreign_languages}
        </div>
      )}
      {resume.interests && (
        <div className="mb-2">
          <strong>Interests:</strong> {resume.interests}
        </div>
      )}
      {resume.achievements && (
        <div className="mb-2">
          <strong>Achievements:</strong> {resume.achievements}
        </div>
      )}
    </div>
  );
}
