import type { JSX, ReactNode } from "react";

type FormFieldProps = {
  label: string;
  children: ReactNode;
};

export const FormField = ({ label, children }: FormFieldProps): JSX.Element => {
  return (
    <label className="flex flex-col text-sm text-slate-600">
      {label}
      {children}
    </label>
  );
};
