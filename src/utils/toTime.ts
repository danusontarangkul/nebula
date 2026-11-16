import { toUtcDate } from "./toUtcDate.ts";

export const toTime = (raw: string): number | null => {
  const date: Date | null = toUtcDate(raw);
  return date === null ? null : date.getTime();
};
