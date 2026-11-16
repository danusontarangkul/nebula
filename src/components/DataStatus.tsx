import type { JSX } from "react";
import type { AsyncState, Dataset } from "../types/data.ts";
import { Dashboard } from "./Dashboard.tsx";

type DataStatusProps = {
  state: AsyncState<Dataset>;
  dataKey: number;
};

export const DataStatus = ({ state, dataKey }: DataStatusProps): JSX.Element => {
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
  return <Dashboard key={dataKey} data={state.data} />;
};
