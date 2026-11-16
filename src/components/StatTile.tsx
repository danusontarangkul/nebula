import type { JSX } from "react";
import { formatCount } from "../utils/formatNumber.ts";

type StatTileProps = {
  label: string;
  value: number;
};

export const StatTile = ({ label, value }: StatTileProps): JSX.Element => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{formatCount(value)}</p>
    </div>
  );
};
