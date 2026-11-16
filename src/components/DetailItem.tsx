import type { JSX } from "react";

type DetailItemProps = {
  label: string;
  value: string;
};

export const DetailItem = ({ label, value }: DetailItemProps): JSX.Element => {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
};
