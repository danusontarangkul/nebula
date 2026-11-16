import type { JSX } from "react";
import { Skeleton } from "./shared/Skeleton.tsx";
import { TileGrid } from "./shared/TileGrid.tsx";

const TILE_COUNT: number = 3;
const ROW_COUNT: number = 6;

type DashboardSkeletonProps = {
  label: string;
};

export const DashboardSkeleton = ({ label }: DashboardSkeletonProps): JSX.Element => {
  const tileKeys: number[] = Array.from({ length: TILE_COUNT }, (_: unknown, index: number): number => index);
  const rowKeys: number[] = Array.from({ length: ROW_COUNT }, (_: unknown, index: number): number => index);

  return (
    <div role="status" className="mt-6">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="mt-6 h-6 w-48" />
      <TileGrid>
        {tileKeys.map(
          (key: number): JSX.Element => (
            <Skeleton key={key} className="h-20" />
          ),
        )}
      </TileGrid>
      <div className="mt-6 max-w-md space-y-3">
        {rowKeys.map(
          (key: number): JSX.Element => (
            <Skeleton key={key} className="h-5 w-full" />
          ),
        )}
      </div>
    </div>
  );
};
