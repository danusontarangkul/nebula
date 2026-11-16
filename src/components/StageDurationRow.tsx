import type { JSX } from "react";
import type { StageDurationRow as StageDurationRowData } from "../types/data.ts";
import { formatDays } from "../utils/formatNumber.ts";
import { DurationCell } from "./DurationCell.tsx";
import { TableCell } from "./shared/TableCell.tsx";
import { TableRow } from "./shared/TableRow.tsx";

type StageDurationRowProps = {
  row: StageDurationRowData;
  products: string[];
};

export const StageDurationRow = ({ row, products }: StageDurationRowProps): JSX.Element => {
  return (
    <TableRow>
      <TableCell align="left">{row.stage.label}</TableCell>
      <TableCell align="right">{formatDays(row.stage.targetDays, 0)}</TableCell>
      {products.map(
        (product: string): JSX.Element => (
          <DurationCell
            key={product}
            medianDays={row.medianDaysByProduct[product] ?? null}
            targetDays={row.stage.targetDays}
          />
        ),
      )}
    </TableRow>
  );
};
