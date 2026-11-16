import type { JSX } from "react";
import type { KitDetail, KitEventEntry } from "../types/data.ts";
import { formatTimestamp } from "../utils/formatDate.ts";
import { formatEventType } from "../utils/formatEventType.ts";

type KitTimelineProps = {
  kit: KitDetail;
  index: number;
};

export const KitTimeline = ({ kit, index }: KitTimelineProps): JSX.Element => {
  return (
    <li className="rounded-lg border border-slate-200 p-4">
      <h4 className="font-medium">
        Kit {index + 1} <span className="font-mono text-slate-600">{kit.kitId}</span>
        {kit.isReplacement && (
          <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">Replacement</span>
        )}
      </h4>
      <ol aria-label={`Events for ${kit.kitId}`} className="mt-3 space-y-2 border-l border-slate-200 pl-4">
        {kit.events.map(
          (entry: KitEventEntry): JSX.Element => (
            <li key={entry.eventId} className="text-sm">
              <span className="font-medium">{formatEventType(entry.eventType)}</span>
              <span className="ml-2 text-slate-500">{formatTimestamp(entry.occurredAt)}</span>
              <span className="ml-2 text-xs text-slate-400">{entry.source}</span>
            </li>
          ),
        )}
      </ol>
    </li>
  );
};
