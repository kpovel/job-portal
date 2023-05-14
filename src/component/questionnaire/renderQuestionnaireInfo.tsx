import React from "react";

export function renderQuestionnaireInfo(
  title: string,
  data: string | null | undefined,
  href?: string | null
) {
  if (!data) return null;
  return (
    <div className="mb-4 flex items-center gap-2">
      <strong className="text-lg font-semibold">{title}:</strong>
      {href ? (
        <a href={href} className="text-blue-600 hover:text-blue-800">
          {data}
        </a>
      ) : (
        <p className="text-gray-700">{data}</p>
      )}
    </div>
  );
}
