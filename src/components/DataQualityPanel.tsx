import type { JSX } from "react";
import type { CleaningReport } from "../types/data.ts";
import { Panel } from "./shared/Panel.tsx";
import { StatRow } from "./shared/StatRow.tsx";

type DataQualityPanelProps = {
  report: CleaningReport;
  includeTestOrders: boolean;
};

export const DataQualityPanel = ({ report, includeTestOrders }: DataQualityPanelProps): JSX.Element => {
  return (
    <Panel
      id="data-quality"
      title="Data quality"
      description="Rows excluded or corrected before the numbers above."
    >
      <dl className="mt-4 grid max-w-3xl grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        <StatRow label="Duplicate events removed" value={report.duplicateEvents} />
        <StatRow label="Orders with a missing order ID excluded" value={report.missingIdOrders} />
        <StatRow label="Events with a missing order or kit ID excluded" value={report.missingIdEvents} />
        <StatRow label="Orphan events excluded" value={report.orphanEvents} />
        <StatRow label="Events with unreadable timestamps excluded" value={report.invalidTimestampEvents} />
        <StatRow label="Timestamps converted to UTC" value={report.normalizedTimestamps} />
        <StatRow
          label={includeTestOrders ? "Test orders included" : "Test orders excluded"}
          value={report.testOrders}
        />
      </dl>
    </Panel>
  );
};
