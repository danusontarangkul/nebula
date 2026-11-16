import { useCallback, useMemo, useState, type Dispatch, type JSX, type SetStateAction } from "react";
import type {
  Dataset,
  OrderDetail,
  PipelineOverview,
  StageDurationSummary,
  StuckKitsSummary,
} from "../types/data.ts";
import { buildOrderDetail } from "../utils/orderDetail.ts";
import { buildPipelineOverview } from "../utils/pipelineOverview.ts";
import { buildStageDurations } from "../utils/stageDurations.ts";
import { buildStuckKits } from "../utils/stuckKits.ts";
import { OrderDetailDialog } from "./OrderDetailDialog.tsx";
import { OrderSearch } from "./OrderSearch.tsx";
import { PipelineOverviewPanel } from "./PipelineOverviewPanel.tsx";
import { StageDurationsPanel } from "./StageDurationsPanel.tsx";
import { StuckKitsPanel } from "./StuckKitsPanel.tsx";

type DashboardProps = {
  data: Dataset;
};

export const Dashboard = ({ data }: DashboardProps): JSX.Element => {
  const [selectedOrderId, setSelectedOrderId]: [string | null, Dispatch<SetStateAction<string | null>>] =
    useState<string | null>(null);

  const overview: PipelineOverview = useMemo((): PipelineOverview => buildPipelineOverview(data), [data]);
  const stageDurations: StageDurationSummary = useMemo(
    (): StageDurationSummary => buildStageDurations(data),
    [data],
  );
  const stuckKits: StuckKitsSummary = useMemo((): StuckKitsSummary => buildStuckKits(data), [data]);
  const orderDetail: OrderDetail | null = useMemo(
    (): OrderDetail | null => (selectedOrderId === null ? null : buildOrderDetail(data, selectedOrderId)),
    [data, selectedOrderId],
  );

  const searchOrder = (orderId: string): boolean => {
    setSelectedOrderId(orderId);
    return buildOrderDetail(data, orderId) !== null;
  };

  const closeOrder: () => void = useCallback((): void => {
    setSelectedOrderId(null);
  }, []);

  const notFoundOrderId: string | null = selectedOrderId !== null && orderDetail === null ? selectedOrderId : null;

  return (
    <>
      <OrderSearch onSearch={searchOrder} notFoundOrderId={notFoundOrderId} />
      <PipelineOverviewPanel overview={overview} />
      <StageDurationsPanel summary={stageDurations} />
      <StuckKitsPanel summary={stuckKits} onSelectOrder={setSelectedOrderId} />
      {orderDetail !== null && <OrderDetailDialog detail={orderDetail} onClose={closeOrder} />}
    </>
  );
};
