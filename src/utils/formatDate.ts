import { toTime } from "./toTime.ts";

export const formatUtcDate = (time: number): string => {
  return new Date(time).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};

export const formatUtcDateTime = (time: number): string => {
  const dateTime: string = new Date(time).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
  return `${dateTime} UTC`;
};

export const formatTimestamp = (raw: string): string => {
  const time: number | null = toTime(raw);
  return time === null ? raw : formatUtcDateTime(time);
};
