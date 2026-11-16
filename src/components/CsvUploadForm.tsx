import { useState, type ChangeEvent, type Dispatch, type JSX, type SetStateAction, type SubmitEvent } from "react";
import type { UploadState } from "../types/data.ts";

type CsvUploadFormProps = {
  state: UploadState;
  onUpload: (ordersFile: File, kitEventsFile: File) => Promise<void>;
};

const FILE_INPUT_CLASS: string =
  "mt-1 block text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium";

export const CsvUploadForm = ({ state, onUpload }: CsvUploadFormProps): JSX.Element => {
  const [ordersFile, setOrdersFile]: [File | null, Dispatch<SetStateAction<File | null>>] = useState<File | null>(
    null,
  );
  const [kitEventsFile, setKitEventsFile]: [File | null, Dispatch<SetStateAction<File | null>>] =
    useState<File | null>(null);

  const isLoading: boolean = state.status === "loading";
  const canSubmit: boolean = ordersFile !== null && kitEventsFile !== null && !isLoading;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (ordersFile === null || kitEventsFile === null) {
      return;
    }
    void onUpload(ordersFile, kitEventsFile);
  };

  return (
    <section aria-labelledby="csv-upload-heading" className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
      <h2 id="csv-upload-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Load your own CSVs
      </h2>
      <form onSubmit={handleSubmit} className="mt-2 flex flex-wrap items-end gap-4">
        <label className="flex flex-col text-sm text-slate-600">
          Orders CSV
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              setOrdersFile(event.currentTarget.files?.[0] ?? null)
            }
            className={FILE_INPUT_CLASS}
          />
        </label>
        <label className="flex flex-col text-sm text-slate-600">
          Kit events CSV
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              setKitEventsFile(event.currentTarget.files?.[0] ?? null)
            }
            className={FILE_INPUT_CLASS}
          />
        </label>
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Load files
        </button>
      </form>
      {state.status === "loading" && <p className="mt-2 text-sm text-slate-500">Loading files…</p>}
      {state.status === "error" && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {state.message}. The current data is still loaded.
        </p>
      )}
      {state.status === "success" && (
        <p role="status" className="mt-2 text-sm text-green-700">
          Showing uploaded data from {state.fileNames.join(" and ")}
        </p>
      )}
    </section>
  );
};
