import Link from "next/link";
import type { ParsedCandidate } from "~/pages/candidates";

export function CandidateResumePreview({
  candidate,
}: {
  candidate: ParsedCandidate;
}) {
  return (
    <div className="rounded-md border border-gray-300 p-4" key={candidate.id}>
      <Link
        href={`/candidate/${candidate.id}`}
        className="mb-3 flex items-center"
      >
        <div>
          <div className="font-bold text-blue-600  hover:text-blue-800">
            {candidate.firstName} {candidate.lastName}
          </div>
          <div className="text-sm text-gray-500">
            {candidate.candidate?.questionnaires?.resume?.specialty}
          </div>
        </div>
      </Link>
      {candidate.candidate?.questionnaires?.resume?.workExperience && (
        <div className="mb-2">
          <strong>Work Experience:</strong>{" "}
          {candidate.candidate.questionnaires.resume.workExperience}
        </div>
      )}
      {candidate.candidate?.questionnaires?.resume?.skills && (
        <div className="mb-2">
          <strong>Skills:</strong>{" "}
          {candidate.candidate.questionnaires.resume.skills}
        </div>
      )}
      {candidate.candidate?.questionnaires?.resume?.education && (
        <div className="mb-2">
          <strong>Education:</strong>{" "}
          {candidate.candidate.questionnaires.resume.education}
        </div>
      )}
      {candidate.candidate?.questionnaires?.resume?.foreignLanguages && (
        <div className="mb-2">
          <strong>Foreign Languages:</strong>{" "}
          {candidate.candidate.questionnaires.resume.foreignLanguages}
        </div>
      )}
      {candidate.candidate?.questionnaires?.resume?.interests && (
        <div className="mb-2">
          <strong>Interests:</strong>{" "}
          {candidate.candidate.questionnaires.resume.interests}
        </div>
      )}
      {candidate.candidate?.questionnaires?.resume?.achievements && (
        <div className="mb-2">
          <strong>Achievements:</strong>{" "}
          {candidate.candidate.questionnaires.resume.achievements}
        </div>
      )}
    </div>
  );
}
