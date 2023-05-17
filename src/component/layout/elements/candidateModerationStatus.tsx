import type { ModerationStatus } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { AuthContext } from "~/utils/auth/authContext";

export function CandidateModerationStatus() {
  const authContext = useContext(AuthContext);
  const [moderationStatus, setModerationStatus] =
    useState<ModerationStatus>("PENDING");

  const { data: candidatesQuestionnaire } =
    api.candidate.findQuestionnaireByCandidateId.useQuery({
      candidateId: authContext?.id || "",
    });

  useEffect(() => {
    if (candidatesQuestionnaire) {
      setModerationStatus(candidatesQuestionnaire.moderationStatus);
    }
  }, [candidatesQuestionnaire]);

  const moderationStyle = {
    ACCEPTED: "bg-green-50 text-green-700 ring-green-600/20",
    PENDING: "bg-yellow-50 text-yellow-800 ring-yellow-600/20",
    REJECTED: "bg-red-50 text-red-700 ring-red-600/10",
  };

  return (
    <div>
      <span
        className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset ${moderationStyle[moderationStatus]}`}
      >
        {moderationStatus}
      </span>
    </div>
  );
}
