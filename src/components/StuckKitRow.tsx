import type { JSX } from "react";
import { KIT_STAGE_LABELS } from "../constants/pipeline.ts";
import type { StuckKit } from "../types/data.ts";
import { formatDecimal } from "../utils/formatNumber.ts";
import { TableCell } from "./shared/TableCell.tsx";
import { TableRow } from "./shared/TableRow.tsx";

type StuckKitRowProps = {
  kit: StuckKit;
  onSelectOrder: (orderId: string) => void;
};

export const StuckKitRow = ({ kit, onSelectOrder }: StuckKitRowProps): JSX.Element => {
  return (
    <TableRow>
      <TableCell align="left" isMonospace>
        <button
          type="button"
          onClick={(): void => onSelectOrder(kit.orderId)}
          className="text-blue-700 underline-offset-2 hover:underline"
        >
          {kit.orderId}
        </button>
      </TableCell>
      <TableCell align="left" isMonospace>
        {kit.kitId}
      </TableCell>
      <TableCell align="left">{kit.product}</TableCell>
      <TableCell align="left">{KIT_STAGE_LABELS[kit.currentStage]}</TableCell>
      <TableCell align="right">{formatDecimal(kit.daysOverTarget)}</TableCell>
    </TableRow>
  );
};
