import type { JSX } from "react";
import { CsvUploadForm } from "./components/CsvUploadForm.tsx";
import { DataStatus } from "./components/DataStatus.tsx";
import { useBundledData } from "./hooks/useBundledData.ts";
import { useCsvUpload } from "./hooks/useCsvUpload.ts";
import type { AsyncState, CsvUpload, Dataset } from "./types/data.ts";

export const App = (): JSX.Element => {
  const bundledState: AsyncState<Dataset> = useBundledData();
  const csvUpload: CsvUpload = useCsvUpload();
  const state: AsyncState<Dataset> =
    csvUpload.dataset === null ? bundledState : { status: "success", data: csvUpload.dataset };

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <h1 className="text-3xl font-semibold">Kit Lifecycle Dashboard</h1>
      <CsvUploadForm state={csvUpload.state} onUpload={csvUpload.upload} />
      <DataStatus state={state} dataKey={csvUpload.uploadCount} />
    </main>
  );
};
