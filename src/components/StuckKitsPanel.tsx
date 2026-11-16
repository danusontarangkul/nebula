import type { JSX } from "react";
import { KIT_STAGE_LABELS } from "../constants/pipeline.ts";
import type { StuckKit, StuckKitsSummary } from "../types/data.ts";

const formatAsOfDate = (asOfTime: number): string => {
  return new Date(asOfTime).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};

type StuckKitsPanelProps = {
  summary: StuckKitsSummary;
};

export const StuckKitsPanel = ({ summary }: StuckKitsPanelProps): JSX.Element => {
  const kitCountLabel: string = `${summary.kits.length.toLocaleString()} ${summary.kits.length === 1 ? "kit" : "kits"} past target`;

  return (
    <section aria-labelledby="stuck-kits-heading" className="mt-10">
      <h2 id="stuck-kits-heading" className="text-xl font-semibold">
        Stuck kits
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {kitCountLabel}
        {summary.asOfTime !== null && `, as of ${formatAsOfDate(summary.asOfTime)}`}
      </p>
      {summary.kits.length === 0 ? (
        <p className="mt-4 text-slate-500">No kits are past their stage target.</p>
      ) : (
        <div className="mt-4 max-h-[32rem] overflow-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-3 py-2 font-medium">Order ID</th>
                <th className="px-3 py-2 font-medium">Kit ID</th>
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 font-medium">Current stage</th>
                <th className="px-3 py-2 text-right font-medium">Days over target</th>
              </tr>
            </thead>
            <tbody>
              {summary.kits.map(
                (kit: StuckKit): JSX.Element => (
                  <tr key={kit.kitId} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-mono">{kit.orderId}</td>
                    <td className="px-3 py-2 font-mono">{kit.kitId}</td>
                    <td className="px-3 py-2">{kit.product}</td>
                    <td className="px-3 py-2">{KIT_STAGE_LABELS[kit.currentStage]}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{kit.daysOverTarget.toFixed(1)}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
