import type { JSX } from "react";
import { KIT_STAGE_LABELS, KIT_STAGES } from "../constants/pipeline.ts";
import type { KitStage, PipelineOverview } from "../types/data.ts";

type StatTileProps = {
  label: string;
  value: number;
};

const StatTile = ({ label, value }: StatTileProps): JSX.Element => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value.toLocaleString()}</p>
    </div>
  );
};

type PipelineOverviewPanelProps = {
  overview: PipelineOverview;
};

export const PipelineOverviewPanel = ({ overview }: PipelineOverviewPanelProps): JSX.Element => {
  return (
    <section aria-labelledby="pipeline-overview-heading" className="mt-6">
      <h2 id="pipeline-overview-heading" className="text-xl font-semibold">
        Pipeline overview
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total orders" value={overview.totalOrders} />
        <StatTile label="Total kits" value={overview.totalKits} />
        <StatTile label="Kits finished" value={overview.finishedKits} />
      </div>
      <table className="mt-6 w-full max-w-md border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="py-2 font-medium">Current stage</th>
            <th className="py-2 text-right font-medium">Kits</th>
          </tr>
        </thead>
        <tbody>
          {KIT_STAGES.map(
            (stage: KitStage): JSX.Element => (
              <tr key={stage} className="border-b border-slate-100">
                <td className="py-2">{KIT_STAGE_LABELS[stage]}</td>
                <td className="py-2 text-right tabular-nums">
                  {overview.kitsByStage[stage].toLocaleString()}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </section>
  );
};
