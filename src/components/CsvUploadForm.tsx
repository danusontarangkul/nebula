import { useState, type ChangeEvent, type Dispatch, type JSX, type SetStateAction, type SubmitEvent } from "react";
import type { UploadState } from "../types/data.ts";
import { Button } from "./shared/Button.tsx";
import { Card } from "./shared/Card.tsx";
import { ErrorMessage } from "./shared/ErrorMessage.tsx";
import { FormField } from "./shared/FormField.tsx";
import { Spinner } from "./shared/Spinner.tsx";

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
    <Card id="csv-upload" title="Load your own CSVs">
      <form onSubmit={handleSubmit} className="mt-2 flex flex-wrap items-end gap-4">
        <FormField label="Orders CSV">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              setOrdersFile(event.currentTarget.files?.[0] ?? null)
            }
            className={FILE_INPUT_CLASS}
          />
        </FormField>
        <FormField label="Kit events CSV">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event: ChangeEvent<HTMLInputElement>): void =>
              setKitEventsFile(event.currentTarget.files?.[0] ?? null)
            }
            className={FILE_INPUT_CLASS}
          />
        </FormField>
        <Button type="submit" variant="primary" disabled={!canSubmit}>
          Load files
        </Button>
      </form>
      {state.status === "loading" && <Spinner label="Loading files…" />}
      {state.status === "error" && (
        <ErrorMessage>{state.message}. The current data is still loaded.</ErrorMessage>
      )}
      {state.status === "success" && (
        <p role="status" className="mt-2 text-sm text-green-700">
          Showing uploaded data from {state.fileNames.join(" and ")}
        </p>
      )}
    </Card>
  );
};
