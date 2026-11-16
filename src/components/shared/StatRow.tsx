import type { JSX } from "react";
import { formatCount } from "../../utils/formatNumber.ts";

type StatRowProps = {
  label: string;
  value: number;
};

export const StatRow = ({ label, value }: StatRowProps): JSX.Element => {
  return (
    <div className="flex justify-between border-b border-slate-100 py-1">
      <dt>{label}</dt>
      <dd className="tabular-nums">{formatCount(value)}</dd>
    </div>
  );
};
