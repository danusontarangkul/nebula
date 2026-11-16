import Papa, { type ParseResult } from "papaparse";
import type { KitEvent, Order } from "../types/data.ts";

type CsvRow = Record<string, string | undefined>;

const ORDER_COLUMNS: readonly string[] = [
  "order_id",
  "created_at",
  "customer_id",
  "product",
  "country",
  "status",
  "is_test",
];

const KIT_EVENT_COLUMNS: readonly string[] = [
  "event_id",
  "order_id",
  "kit_id",
  "event_type",
  "occurred_at",
  "source",
];

const parseRows = (text: string, requiredColumns: readonly string[], fileLabel: string): CsvRow[] => {
  const result: ParseResult<CsvRow> = Papa.parse<CsvRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string): string => header.trim(),
  });
  const columns: string[] = result.meta.fields ?? [];
  const missingColumns: string[] = requiredColumns.filter(
    (column: string): boolean => !columns.includes(column),
  );
  if (missingColumns.length > 0) {
    throw new Error(`${fileLabel} is missing required columns: ${missingColumns.join(", ")}`);
  }
  return result.data;
};

const readField = (row: CsvRow, column: string): string => row[column] ?? "";

export const parseOrders = (text: string): Order[] => {
  const rows: CsvRow[] = parseRows(text, ORDER_COLUMNS, "orders.csv");
  return rows.map(
    (row: CsvRow): Order => ({
      orderId: readField(row, "order_id"),
      createdAt: readField(row, "created_at"),
      customerId: readField(row, "customer_id"),
      product: readField(row, "product"),
      country: readField(row, "country"),
      status: readField(row, "status"),
      isTest: readField(row, "is_test"),
    }),
  );
};

export const parseKitEvents = (text: string): KitEvent[] => {
  const rows: CsvRow[] = parseRows(text, KIT_EVENT_COLUMNS, "kit_events.csv");
  return rows.map(
    (row: CsvRow): KitEvent => ({
      eventId: readField(row, "event_id"),
      orderId: readField(row, "order_id"),
      kitId: readField(row, "kit_id"),
      eventType: readField(row, "event_type"),
      occurredAt: readField(row, "occurred_at"),
      source: readField(row, "source"),
    }),
  );
};
