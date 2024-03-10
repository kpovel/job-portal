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
      const res = await fetch("/api/candidate/moderationStatus");
      const text = await res.text();

      if (res.status === 401) {
        console.error(text);
      } else if (res.status === 500) {
        console.error(text);
      } else if (res.status === 200) {
        setModerationStatus(text as StatusType["status"]);
      }
    })();
  }, [authContext?.user_uuid]);

  return <ModerationLabel moderationStatus={moderationStatus} />;
}
