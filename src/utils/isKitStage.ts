import { KIT_STAGES } from "../constants/pipeline.ts";
import type { KitStage } from "../types/data.ts";

export const isKitStage = (value: string): value is KitStage => {
  return (KIT_STAGES as readonly string[]).includes(value);
};
