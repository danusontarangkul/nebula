import type { JSX } from "react";
import type { StageDurationRow as StageDurationRowData, StageDurationSummary } from "../types/data.ts";
import { Panel } from "./shared/Panel.tsx";
import { TableHeaderCell } from "./shared/TableHeaderCell.tsx";
import { TableHeaderRow } from "./shared/TableHeaderRow.tsx";
import { StageDurationRow } from "./StageDurationRow.tsx";

type StageDurationsPanelProps = {
  summary: StageDurationSummary;
};

export const StageDurationsPanel = ({ summary }: StageDurationsPanelProps): JSX.Element => {
  return (
    <Panel
      id="stage-durations"
      title="Stage durations"
      description="Median days per stage. Highlighted cells are over target."
    >
      <div className="mt-4 overflow-x-auto">
        <table className="w-full max-w-3xl border-collapse text-left text-sm">
          <thead>
            <TableHeaderRow>
              <TableHeaderCell align="left">Stage</TableHeaderCell>
              <TableHeaderCell align="right">Target</TableHeaderCell>
              {summary.products.map(
                (product: string): JSX.Element => (
                  <TableHeaderCell key={product} align="right">
                    {product}
                  </TableHeaderCell>
                ),
              )}
            </TableHeaderRow>
          </thead>
          <tbody>
            {summary.rows.map(
              (row: StageDurationRowData): JSX.Element => (
                <StageDurationRow key={row.stage.id} row={row} products={summary.products} />
              ),
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
};
