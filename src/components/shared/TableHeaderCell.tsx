import type { JSX, ReactNode } from "react";

type TableHeaderCellProps = {
  align: "left" | "right";
  children: ReactNode;
};

export const TableHeaderCell = ({ align, children }: TableHeaderCellProps): JSX.Element => {
  const alignClass: string = align === "right" ? "text-right" : "";
  return <th className={`px-3 py-2 font-medium ${alignClass}`}>{children}</th>;
};
