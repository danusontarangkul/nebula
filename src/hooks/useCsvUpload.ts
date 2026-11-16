import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { readFileText } from "../services/readFileText.ts";
import type { CsvUpload, Dataset, UploadState } from "../types/data.ts";
import { parseKitEvents, parseOrders } from "../utils/parseCsv.ts";

export const useCsvUpload = (): CsvUpload => {
  const [state, setState]: [UploadState, Dispatch<SetStateAction<UploadState>>] = useState<UploadState>({
    status: "idle",
  });
  const [dataset, setDataset]: [Dataset | null, Dispatch<SetStateAction<Dataset | null>>] =
    useState<Dataset | null>(null);
  const [uploadCount, setUploadCount]: [number, Dispatch<SetStateAction<number>>] = useState<number>(0);

  const upload: (ordersFile: File, kitEventsFile: File) => Promise<void> = useCallback(
    async (ordersFile: File, kitEventsFile: File): Promise<void> => {
      setState({ status: "loading" });
      try {
        const [ordersText, kitEventsText]: [string, string] = await Promise.all([
          readFileText(ordersFile),
          readFileText(kitEventsFile),
        ]);
        const uploadedDataset: Dataset = {
          orders: parseOrders(ordersText),
          kitEvents: parseKitEvents(kitEventsText),
        };
        setDataset(uploadedDataset);
        setUploadCount((count: number): number => count + 1);
        setState({ status: "success", fileNames: [ordersFile.name, kitEventsFile.name] });
      } catch (error: unknown) {
        const message: string = error instanceof Error ? error.message : "Failed to load the files";
        setState({ status: "error", message });
      }
    },
    [],
  );

  return { state, dataset, uploadCount, upload };
};
