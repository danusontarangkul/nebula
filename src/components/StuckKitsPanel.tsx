import type { JSX } from "react";
import type { StuckKit, StuckKitsSummary } from "../types/data.ts";
import { formatUtcDate } from "../utils/formatDate.ts";
import { formatKitCount } from "../utils/formatNumber.ts";
import { Panel } from "./shared/Panel.tsx";
import { TableHeaderCell } from "./shared/TableHeaderCell.tsx";
import { TableHeaderRow } from "./shared/TableHeaderRow.tsx";
import { StuckKitRow } from "./StuckKitRow.tsx";

type StuckKitsPanelProps = {
  summary: StuckKitsSummary;
  onSelectOrder: (orderId: string) => void;
};

export const StuckKitsPanel = ({ summary, onSelectOrder }: StuckKitsPanelProps): JSX.Element => {
  const kitCountLabel: string = `${formatKitCount(summary.kits.length)} past target`;
  const description: string =
    summary.asOfTime === null ? kitCountLabel : `${kitCountLabel}, as of ${formatUtcDate(summary.asOfTime)}`;

  return (
    <Panel id="stuck-kits" title="Stuck kits" description={description}>
      {summary.kits.length === 0 ? (
        <p className="mt-4 text-slate-500">No kits are past their stage target.</p>
      ) : (
        <div className="mt-4 max-h-[32rem] overflow-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-white">
              <TableHeaderRow>
                <TableHeaderCell align="left">Order ID</TableHeaderCell>
                <TableHeaderCell align="left">Kit ID</TableHeaderCell>
                <TableHeaderCell align="left">Product</TableHeaderCell>
                <TableHeaderCell align="left">Current stage</TableHeaderCell>
                <TableHeaderCell align="right">Days over target</TableHeaderCell>
              </TableHeaderRow>
            </thead>
            <tbody>
              {summary.kits.map(
                (kit: StuckKit): JSX.Element => (
                  <StuckKitRow key={kit.kitId ?? kit.orderId} kit={kit} onSelectOrder={onSelectOrder} />
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
};
