import React from "react";

export function RenderQuestionnaireDetail({
  title,
  data,
}: {
  title: string;
  data: string | null | undefined;
}) {
  if (!data) {
    return null;
  }

  return (
    <div className="mb-4">
      <strong className="text-lg font-semibold">{title}:</strong>
      <p className="mt-2 text-gray-700">{data}</p>
    </div>
  );
}
