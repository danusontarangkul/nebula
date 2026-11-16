import type { JSX } from "react";
import { DataStatus } from "./components/DataStatus.tsx";
import { useBundledData } from "./hooks/useBundledData.ts";
import type { AsyncState, Dataset } from "./types/data.ts";

export const App = (): JSX.Element => {
  const state: AsyncState<Dataset> = useBundledData();

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <h1 className="text-3xl font-semibold">Kit Lifecycle Dashboard</h1>
      <DataStatus state={state} />
    </main>
  );
};
