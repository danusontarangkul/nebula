import type { JSX } from "react";
import type { AsyncState, Dataset } from "../types/data.ts";
import { Dashboard } from "./Dashboard.tsx";
import { DashboardSkeleton } from "./DashboardSkeleton.tsx";
import { ErrorMessage } from "./shared/ErrorMessage.tsx";

type DataStatusProps = {
  state: AsyncState<Dataset>;
  dataKey: number;
};

export const DataStatus = ({ state, dataKey }: DataStatusProps): JSX.Element => {
  if (state.status === "loading") {
    return <DashboardSkeleton label="Loading data…" />;
  }
  if (state.status === "error") {
    return <ErrorMessage>{state.message}</ErrorMessage>;
  }
  return <Dashboard key={dataKey} data={state.data} />;
};
