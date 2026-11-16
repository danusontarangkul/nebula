import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { fetchText } from "../services/fetchText.ts";
import type { AsyncState, Dataset } from "../types/data.ts";
import { parseKitEvents, parseOrders } from "../utils/parseCsv.ts";

export const useBundledData = (): AsyncState<Dataset> => {
  const [state, setState]: [AsyncState<Dataset>, Dispatch<SetStateAction<AsyncState<Dataset>>>] =
    useState<AsyncState<Dataset>>({ status: "loading" });

  useEffect((): (() => void) => {
    let isCancelled: boolean = false;

    const load = async (): Promise<void> => {
      try {
        const [ordersText, kitEventsText]: [string, string] = await Promise.all([
          fetchText("orders.csv"),
          fetchText("kit_events.csv"),
        ]);
        const dataset: Dataset = {
          orders: parseOrders(ordersText),
          kitEvents: parseKitEvents(kitEventsText),
        };
        if (isCancelled) {
          return;
        }
        console.log("Loaded bundled data", dataset);
        setState({ status: "success", data: dataset });
      } catch (error: unknown) {
        if (isCancelled) {
          return;
        }
        const message: string = error instanceof Error ? error.message : "Failed to load data";
        setState({ status: "error", message });
      }
    };

    void load();

    return (): void => {
      isCancelled = true;
    };
  }, []);

  return state;
};
