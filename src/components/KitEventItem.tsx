import type { JSX } from "react";
import type { KitEventEntry } from "../types/data.ts";
import { formatTimestamp } from "../utils/formatDate.ts";
import { formatEventType } from "../utils/formatEventType.ts";

type KitEventItemProps = {
  entry: KitEventEntry;
};

export const KitEventItem = ({ entry }: KitEventItemProps): JSX.Element => {
  return (
    <li className="text-sm">
      <span className="font-medium">{formatEventType(entry.eventType)}</span>
      <span className="ml-2 text-slate-500">{formatTimestamp(entry.occurredAt)}</span>
      <span className="ml-2 text-xs text-slate-400">{entry.source}</span>
    </li>
  );
};
