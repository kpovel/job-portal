import { SelectModerationStatus } from "~/component/admin/moderation/selectModerationStatus";
import React, { useState } from "react";
import type { ModerationStatus } from "~/utils/dbSchema/enums";

export function ModerateCandidate({
  moderationStatus,
  questionnaireId
}: {
  moderationStatus: ModerationStatus,
  questionnaireId: string
}) {
  const [selectedStatus, setSelectedStatus] =
    useState<ModerationStatus>(moderationStatus);

  function handleChangeStatus(moderationStatus: ModerationStatus) {
    void updateModerationStatus(moderationStatus);
  }

  async function updateModerationStatus(
    moderationStatus: ModerationStatus
  ): Promise<void> {
    try {
      const response = await fetch("/api/candidate/updateModerationStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moderationStatus,
          questionnaireId,
        }),
      });

      if (response.ok) {
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
