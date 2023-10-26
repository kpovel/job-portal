import Link from "next/link";
import type { Resume } from "~/utils/dbSchema/models";

export function CandidateResumePreview({
  resume,
}: {
  resume: Omit<Resume, "moderationStation"> & {
    firstName: string;
    lastName: string;
  };
}) {
  return (
    <div className="rounded-md border border-gray-300 p-4">
      <Link
        href={`/candidate/${resume.candidateId}`}
        className="mb-3 flex items-center"
      >
        <div>
          <div className="font-bold text-blue-600  hover:text-blue-800">
            {resume.firstName} {resume.lastName}
          </div>
          <div className="text-sm text-gray-500">{resume.specialty}</div>
        </div>
      </Link>
      {resume.workExperience && (
        <div className="mb-2">
          <strong>Work Experience:</strong> {resume.workExperience}
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
      {resume.foreignLanguages && (
        <div className="mb-2">
          <strong>Foreign Languages:</strong> {resume.foreignLanguages}
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
