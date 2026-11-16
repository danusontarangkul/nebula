import type { JSX } from "react";
import { KIT_STAGE_LABELS } from "../constants/pipeline.ts";
import type { KitStage } from "../types/data.ts";
import { formatCount } from "../utils/formatNumber.ts";
import { TableCell } from "./shared/TableCell.tsx";
import { TableRow } from "./shared/TableRow.tsx";

type StageCountRowProps = {
  stage: KitStage;
  count: number;
};

export const StageCountRow = ({ stage, count }: StageCountRowProps): JSX.Element => {
  return (
    <TableRow>
      <TableCell align="left">{KIT_STAGE_LABELS[stage]}</TableCell>
      <TableCell align="right">{formatCount(count)}</TableCell>
    </TableRow>
  );
};
