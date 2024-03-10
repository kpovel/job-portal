import { useContext, useEffect, useState } from "react";
import { AuthContext } from "~/utils/auth/authContext";
import { ModerationLabel } from "~/component/layout/elements/moderation/moderationLabel";
import type { StatusType } from "~/server/db/types/schema";

export function CandidateModerationStatus() {
  const authContext = useContext(AuthContext);
  const [moderationStatus, setModerationStatus] =
    useState<StatusType["status"]>("PENDING");

  useEffect(() => {
    void (async () => {
      // todo: fix this route
      const response = await fetch("/api/candidate/moderationStatus", {
        method: "POST",
        // todo: find candidate id using token on server side
        // body: JSON.stringify({ candidateId: authContext?.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = (await response.json()) as {
        moderationStatus: StatusType["status"];
      };
      setModerationStatus(json.moderationStatus);
    })();
  }, [authContext?.user_uuid]);

  return <ModerationLabel moderationStatus={moderationStatus} />;
}
