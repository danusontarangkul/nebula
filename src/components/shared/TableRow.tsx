import type { JSX, ReactNode } from "react";

type TableRowProps = {
  children: ReactNode;
};

export const TableRow = ({ children }: TableRowProps): JSX.Element => {
  return <tr className="border-b border-slate-100">{children}</tr>;
};
