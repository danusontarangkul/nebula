import type { JSX } from "react";
import { formatDays } from "../utils/formatNumber.ts";

type DurationCellProps = {
  medianDays: number | null;
  targetDays: number;
};

export const DurationCell = ({ medianDays, targetDays }: DurationCellProps): JSX.Element => {
  if (medianDays === null) {
    return <td className="px-3 py-2 text-right text-slate-400">—</td>;
  }
  const isOverTarget: boolean = medianDays > targetDays;
  const className: string = isOverTarget
    ? "px-3 py-2 text-right tabular-nums bg-red-50 font-semibold text-red-700"
    : "px-3 py-2 text-right tabular-nums";
  return (
    <td className={className}>
      {formatDays(medianDays)}
      {isOverTarget && <span className="sr-only"> (over target)</span>}
    </td>
  );
};
