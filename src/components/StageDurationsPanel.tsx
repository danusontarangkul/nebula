import type { JSX } from "react";
import type { StageDurationRow, StageDurationSummary } from "../types/data.ts";
import { formatDays } from "../utils/formatNumber.ts";
import { DurationCell } from "./DurationCell.tsx";

type StageDurationsPanelProps = {
  summary: StageDurationSummary;
};

export const StageDurationsPanel = ({ summary }: StageDurationsPanelProps): JSX.Element => {
  return (
    <section aria-labelledby="stage-durations-heading" className="mt-10">
      <h2 id="stage-durations-heading" className="text-xl font-semibold">
        Stage durations
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Median days per stage. Highlighted cells are over target.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full max-w-3xl border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 pr-3 font-medium">Stage</th>
              <th className="px-3 py-2 text-right font-medium">Target</th>
              {summary.products.map(
                (product: string): JSX.Element => (
                  <th key={product} className="px-3 py-2 text-right font-medium">
                    {product}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {summary.rows.map(
              (row: StageDurationRow): JSX.Element => (
                <tr key={row.stage.id} className="border-b border-slate-100">
                  <td className="py-2 pr-3">{row.stage.label}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatDays(row.stage.targetDays, 0)}</td>
                  {summary.products.map(
                    (product: string): JSX.Element => (
                      <DurationCell
                        key={product}
                        medianDays={row.medianDaysByProduct[product] ?? null}
                        targetDays={row.stage.targetDays}
                      />
                    ),
                  )}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
