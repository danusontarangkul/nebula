import type { JSX } from "react";

type SpinnerProps = {
  label: string;
};

export const Spinner = ({ label }: SpinnerProps): JSX.Element => {
  return (
    <p role="status" className="mt-2 flex items-center gap-2 text-sm text-slate-500">
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"
      />
      {label}
    </p>
  );
};
