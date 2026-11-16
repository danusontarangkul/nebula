import type { JSX, ReactNode } from "react";

type TileGridProps = {
  children: ReactNode;
};

export const TileGrid = ({ children }: TileGridProps): JSX.Element => {
  return <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">{children}</div>;
};
