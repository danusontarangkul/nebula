import type { JSX, ReactNode } from "react";

type TableHeaderRowProps = {
  children: ReactNode;
};

export const TableHeaderRow = ({ children }: TableHeaderRowProps): JSX.Element => {
  return <tr className="border-b border-slate-200 text-slate-500">{children}</tr>;
};
