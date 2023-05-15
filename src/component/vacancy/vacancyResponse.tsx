import React, { type FormEvent, useState } from "react";

export function VacancyResponse() {
  const [coverLetter, setCoverLetter] = useState("");

  function handleSubmitCoverLetter(e: FormEvent) {
    e.preventDefault();
    console.log(coverLetter);
  }

  return (
    <div className="container mx-auto my-6 flex flex-col rounded-lg border bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-xl font-bold">Надішліть відгук на вакансію</h2>
      <form onSubmit={handleSubmitCoverLetter} className="w-full max-w-md  ">
        <div className="sm:col-span-2">
          <label
            htmlFor="coverLetter"
            className="text-md block font-semibold leading-6 text-gray-900"
          >
            Супровідний лист:
          </label>
          <div className="mt-2.5">
            <textarea
              name="coverLetter"
              id="coverLetter"
              autoComplete="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <button
            type="submit"
            className="mt-6 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Відгукнутись на вакансію
          </button>
        </div>
      </form>
    </div>
  );
}
