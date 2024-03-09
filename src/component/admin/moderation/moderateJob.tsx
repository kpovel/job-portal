import { SelectModerationStatus } from "~/component/admin/moderation/selectModerationStatus";
import { useState } from "react";
import type { StatusType } from "~/server/db/types/schema";

export function ModerateJob({
  questionnaireId,
  moderationStatus,
}: {
  questionnaireId: string;
  moderationStatus: StatusType["status"];
}) {
  const [selectedStatus, setSelectedStatus] =
    useState<StatusType["status"]>(moderationStatus);

  function handleChangeStatus(moderationStatus: StatusType["status"]) {
    void updateModerationStatus(moderationStatus);
  }

  async function updateModerationStatus(
    moderationStatus: StatusType["status"],
  ): Promise<void> {
    try {
      const response = await fetch("/api/employer/updateModerationStatus", {
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
