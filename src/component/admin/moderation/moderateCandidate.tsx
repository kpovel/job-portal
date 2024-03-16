import { SelectModerationStatus } from "~/component/admin/moderation/selectModerationStatus";
import React, { useState } from "react";
import type { StatusType } from "~/server/db/types/schema";

export function ModerateCandidate({
  moderationStatus,
  candidateUUID,
}: {
  moderationStatus: StatusType["status"];
  candidateUUID: string;
}) {
  const [selectedStatus, setSelectedStatus] =
    useState<StatusType["status"]>(moderationStatus);

  function handleChangeStatus(moderationStatus: StatusType["status"]) {
    void updateModerationStatus(moderationStatus);
  }

  async function updateModerationStatus(
    moderationStatus: StatusType["status"],
  ) {
    try {
      const response = await fetch("/api/candidate/updateModerationStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moderationStatus,
          candidateUUID,
        }),
      });

      if (response.status === 200) {
        setSelectedStatus(moderationStatus);
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <hr className="w-full border-gray-300" />
      <strong className="py-4 text-lg font-semibold">Статус модерації:</strong>
      <SelectModerationStatus
        moderationStatus={selectedStatus}
        handleChangeStatus={handleChangeStatus}
      />
    </>
  );
}
