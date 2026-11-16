import type { JSX } from "react";
import type { StageDurationRow, StageDurationSummary } from "../types/data.ts";

type DurationCellProps = {
  medianDays: number | null;
  targetDays: number;
};

const DurationCell = ({ medianDays, targetDays }: DurationCellProps): JSX.Element => {
  if (medianDays === null) {
    return <td className="px-3 py-2 text-right text-slate-400">—</td>;
  }
  const isOverTarget: boolean = medianDays > targetDays;
  const className: string = isOverTarget
    ? "px-3 py-2 text-right tabular-nums bg-red-50 font-semibold text-red-700"
    : "px-3 py-2 text-right tabular-nums";
  return (
    <td className={className}>
      {medianDays.toFixed(1)} d
      {isOverTarget && <span className="sr-only"> (over target)</span>}
    </td>
  );
};

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
                  <td className="px-3 py-2 text-right tabular-nums">{row.stage.targetDays} d</td>
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
