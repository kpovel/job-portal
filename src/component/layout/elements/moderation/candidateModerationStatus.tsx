import type { ModerationStatus } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { AuthContext } from "~/utils/auth/authContext";
import { ModerationLabel } from "~/component/layout/elements/moderation/moderationLabel";

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

  return <ModerationLabel moderationStatus={moderationStatus} />;
}
