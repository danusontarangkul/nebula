import type { JSX, ReactNode } from "react";

type TableCellProps = {
  align: "left" | "right";
  isMonospace?: boolean;
  children: ReactNode;
};

export const TableCell = ({ align, isMonospace = false, children }: TableCellProps): JSX.Element => {
  const alignClass: string = align === "right" ? "text-right tabular-nums" : "";
  const fontClass: string = isMonospace ? "font-mono" : "";
  return <td className={`px-3 py-2 ${alignClass} ${fontClass}`}>{children}</td>;
};
