import { useCallback, useMemo, useState, type Dispatch, type JSX, type SetStateAction } from "react";
import { EMPTY_FILTERS } from "../constants/filters.ts";
import type {
  CleanedData,
  DashboardFilters,
  Dataset,
  FilterOptions,
  OrderDetail,
  PipelineOverview,
  StageDurationSummary,
  StuckKitsSummary,
} from "../types/data.ts";
import { cleanDataset } from "../utils/cleanDataset.ts";
import { filterDataset } from "../utils/filterDataset.ts";
import { getFilterOptions } from "../utils/filterOptions.ts";
import { buildKitTimelines } from "../utils/kitTimelines.ts";
import { buildOrderDetail } from "../utils/orderDetail.ts";
import { buildPipelineOverview } from "../utils/pipelineOverview.ts";
import { buildStageDurations } from "../utils/stageDurations.ts";
import { buildStuckKits, getAsOfTime } from "../utils/stuckKits.ts";
import { DataQualityPanel } from "./DataQualityPanel.tsx";
import { FilterBar } from "./FilterBar.tsx";
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

  const [filters, setFilters]: [DashboardFilters, Dispatch<SetStateAction<DashboardFilters>>] =
    useState<DashboardFilters>(EMPTY_FILTERS);

  const cleaned: CleanedData = useMemo((): CleanedData => cleanDataset(data), [data]);
  const cleanData: Dataset = cleaned.dataset;
  const filterOptions: FilterOptions = useMemo((): FilterOptions => getFilterOptions(cleanData), [cleanData]);
  const asOfTime: number | null = useMemo(
    (): number | null => getAsOfTime(buildKitTimelines(cleanData.kitEvents)),
    [cleanData],
  );
  const filteredData: Dataset = useMemo(
    (): Dataset => filterDataset(cleanData, filters),
    [cleanData, filters],
  );

  const overview: PipelineOverview = useMemo(
    (): PipelineOverview => buildPipelineOverview(filteredData),
    [filteredData],
  );
  const stageDurations: StageDurationSummary = useMemo(
    (): StageDurationSummary => buildStageDurations(filteredData),
    [filteredData],
  );
  const stuckKits: StuckKitsSummary = useMemo(
    (): StuckKitsSummary => buildStuckKits(filteredData, asOfTime),
    [filteredData, asOfTime],
  );
  const orderDetail: OrderDetail | null = useMemo(
    (): OrderDetail | null => (selectedOrderId === null ? null : buildOrderDetail(cleanData, selectedOrderId)),
    [cleanData, selectedOrderId],
  );

  const searchOrder = (orderId: string): boolean => {
    setSelectedOrderId(orderId);
    return buildOrderDetail(cleanData, orderId) !== null;
  };

  const closeOrder: () => void = useCallback((): void => {
    setSelectedOrderId(null);
  }, []);

  const clearFilters = (): void => {
    setFilters(EMPTY_FILTERS);
  };

  const notFoundOrderId: string | null = selectedOrderId !== null && orderDetail === null ? selectedOrderId : null;

  return (
    <>
      <OrderSearch onSearch={searchOrder} notFoundOrderId={notFoundOrderId} />
      <FilterBar filters={filters} options={filterOptions} onChange={setFilters} onClear={clearFilters} />
      <PipelineOverviewPanel overview={overview} />
      <StageDurationsPanel summary={stageDurations} />
      <StuckKitsPanel summary={stuckKits} onSelectOrder={setSelectedOrderId} />
      <DataQualityPanel report={cleaned.report} includeTestOrders={filters.includeTestOrders} />
      {orderDetail !== null && <OrderDetailDialog detail={orderDetail} onClose={closeOrder} />}
    </>
  );
};
