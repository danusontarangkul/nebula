import type { JSX } from "react";
import { PipelineOverviewPanel } from "./components/PipelineOverviewPanel.tsx";
import { StageDurationsPanel } from "./components/StageDurationsPanel.tsx";
import { useBundledData } from "./hooks/useBundledData.ts";
import type { AsyncState, Dataset } from "./types/data.ts";
import { buildPipelineOverview } from "./utils/pipelineOverview.ts";
import { buildStageDurations } from "./utils/stageDurations.ts";

const DataStatus = ({ state }: { state: AsyncState<Dataset> }): JSX.Element => {
  if (state.status === "loading") {
    return <p className="mt-4 text-slate-500">Loading data…</p>;
  }
  if (state.status === "error") {
    return (
      <p role="alert" className="mt-4 text-red-600">
        {state.message}
      </p>
    );
  }
  return (
    <>
      <PipelineOverviewPanel overview={buildPipelineOverview(state.data)} />
      <StageDurationsPanel summary={buildStageDurations(state.data)} />
    </>
  );
};

export const App = (): JSX.Element => {
  const state: AsyncState<Dataset> = useBundledData();

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <h1 className="text-3xl font-semibold">Kit Lifecycle Dashboard</h1>
      <DataStatus state={state} />
    </main>
  );
};
