import type { JSX } from "react";
import type { CleaningReport } from "../types/data.ts";
import { formatCount } from "../utils/formatNumber.ts";

type DataQualityPanelProps = {
  report: CleaningReport;
  includeTestOrders: boolean;
};

export const DataQualityPanel = ({ report, includeTestOrders }: DataQualityPanelProps): JSX.Element => {
  return (
    <section aria-labelledby="data-quality-heading" className="mt-10">
      <h2 id="data-quality-heading" className="text-xl font-semibold">
        Data quality
      </h2>
      <p className="mt-1 text-sm text-slate-500">Rows excluded or corrected before the numbers above.</p>
      <dl className="mt-4 grid max-w-3xl grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        <div className="flex justify-between border-b border-slate-100 py-1">
          <dt>Duplicate events removed</dt>
          <dd className="tabular-nums">{formatCount(report.duplicateEvents)}</dd>
        </div>
        <div className="flex justify-between border-b border-slate-100 py-1">
          <dt>Orphan events excluded</dt>
          <dd className="tabular-nums">{formatCount(report.orphanEvents)}</dd>
        </div>
        <div className="flex justify-between border-b border-slate-100 py-1">
          <dt>Events with unreadable timestamps excluded</dt>
          <dd className="tabular-nums">{formatCount(report.invalidTimestampEvents)}</dd>
        </div>
        <div className="flex justify-between border-b border-slate-100 py-1">
          <dt>Timestamps converted to UTC</dt>
          <dd className="tabular-nums">{formatCount(report.normalizedTimestamps)}</dd>
        </div>
        <div className="flex justify-between border-b border-slate-100 py-1">
          <dt>{includeTestOrders ? "Test orders included" : "Test orders excluded"}</dt>
          <dd className="tabular-nums">{formatCount(report.testOrders)}</dd>
        </div>
      </dl>
    </section>
  );
};
