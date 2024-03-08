import { useContext, useEffect, useState } from "react";
import { AuthContext } from "~/utils/auth/authContext";
import { ModerationLabel } from "~/component/layout/elements/moderation/moderationLabel";

export function CandidateModerationStatus() {
  const authContext = useContext(AuthContext);
  const [moderationStatus, setModerationStatus] = useState<ModerationStatus>(
    ModerationStatus.PENDING,
  );

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/candidate/moderationStatus", {
        method: "POST",
        body: JSON.stringify({ candidateId: authContext?.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = (await response.json()) as {
        moderationStatus: ModerationStatus;
      };
      setModerationStatus(json.moderationStatus);
    })();
  }, [authContext?.id]);

  return <ModerationLabel moderationStatus={moderationStatus} />;
}
