import type { JSX } from "react";

type SkeletonProps = {
  className: string;
};

export const Skeleton = ({ className }: SkeletonProps): JSX.Element => {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-slate-200 ${className}`} />;
};
