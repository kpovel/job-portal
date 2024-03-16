import { SelectModerationStatus } from "~/component/admin/moderation/selectModerationStatus";
import { useState } from "react";
import type { StatusType } from "~/server/db/types/schema";

export function ModerateJob({
  vacancyUUID,
  moderationStatus,
}: {
  vacancyUUID: string;
  moderationStatus: StatusType["status"];
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
      const response = await fetch("/api/employer/updateModerationStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moderationStatus,
          vacancyUUID,
        }),
      });

      if (response.status === 204) {
        setSelectedStatus(moderationStatus);
      }
    } catch (e) {
      console.error(e);
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
