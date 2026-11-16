import type { JSX } from "react";
import { KIT_STAGES } from "../constants/pipeline.ts";
import type { KitStage, PipelineOverview } from "../types/data.ts";
import { Panel } from "./shared/Panel.tsx";
import { StatTile } from "./shared/StatTile.tsx";
import { TableHeaderCell } from "./shared/TableHeaderCell.tsx";
import { TableHeaderRow } from "./shared/TableHeaderRow.tsx";
import { StageCountRow } from "./StageCountRow.tsx";
import { TileGrid } from "./shared/TileGrid.tsx";

type PipelineOverviewPanelProps = {
  overview: PipelineOverview;
};

export const PipelineOverviewPanel = ({ overview }: PipelineOverviewPanelProps): JSX.Element => {
  return (
    <Panel id="pipeline-overview" title="Pipeline overview">
      <TileGrid>
        <StatTile label="Total orders" value={overview.totalOrders} />
        <StatTile label="Total kits" value={overview.totalKits} />
        <StatTile label="Kits finished" value={overview.finishedKits} />
      </TileGrid>
      <table className="mt-6 w-full max-w-md border-collapse text-left text-sm">
        <thead>
          <TableHeaderRow>
            <TableHeaderCell align="left">Current stage</TableHeaderCell>
            <TableHeaderCell align="right">Kits</TableHeaderCell>
          </TableHeaderRow>
        </thead>
        <tbody>
          {KIT_STAGES.map(
            (stage: KitStage): JSX.Element => (
              <StageCountRow key={stage} stage={stage} count={overview.kitsByStage[stage]} />
            ),
          )}
        </tbody>
      </table>
    </Panel>
  );
};
