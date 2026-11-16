export type Order = {
  orderId: string;
  createdAt: string;
  customerId: string;
  product: string;
  country: string;
  status: string;
  isTest: string;
};

export type KitEvent = {
  eventId: string;
  orderId: string;
  kitId: string;
  eventType: string;
  occurredAt: string;
  source: string;
};

export type Dataset = {
  orders: Order[];
  kitEvents: KitEvent[];
};

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };

export type KitStage =
  | "kit_shipped"
  | "kit_delivered"
  | "sample_mailed"
  | "sample_received"
  | "qc_passed"
  | "qc_failed"
  | "sequencing_complete"
  | "report_ready"
  | "kit_replaced";

export type PipelineOverview = {
  totalOrders: number;
  totalKits: number;
  finishedKits: number;
  kitsByStage: Record<KitStage, number>;
};

export type DurationStageId =
  | "order_to_shipped"
  | "shipped_to_delivered"
  | "delivered_to_mailed"
  | "mailed_to_received"
  | "received_to_qc"
  | "qc_to_sequenced"
  | "sequenced_to_report";

export type DurationStage = {
  id: DurationStageId;
  label: string;
  start: KitStage | "order_created";
  end: readonly KitStage[];
  targetDays: number;
};

export type StageDurationRow = {
  stage: DurationStage;
  medianDaysByProduct: Record<string, number | null>;
};

export type StageDurationSummary = {
  products: string[];
  rows: StageDurationRow[];
};

export type KitTimeline = {
  orderId: string;
  times: Map<KitStage, number>;
};

export type StuckKit = {
  orderId: string;
  kitId: string;
  product: string;
  currentStage: KitStage;
  daysOverTarget: number;
};

export type StuckKitsSummary = {
  asOfTime: number | null;
  kits: StuckKit[];
};

export type KitEventEntry = {
  eventId: string;
  eventType: string;
  occurredAt: string;
  time: number | null;
  source: string;
};

export type KitDetail = {
  kitId: string;
  isReplacement: boolean;
  events: KitEventEntry[];
};

export type OrderDetail = {
  order: Order;
  kits: KitDetail[];
};

export type DashboardFilters = {
  startDate: string;
  endDate: string;
  product: string;
  country: string;
};

export type FilterOptions = {
  products: string[];
  countries: string[];
};
