import type { ModerationStatus } from "@prisma/client";

export function ModerationLabel({
  moderationStatus,
}: {
  moderationStatus: ModerationStatus;
}) {
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
