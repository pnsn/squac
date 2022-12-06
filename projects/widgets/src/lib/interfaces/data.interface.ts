import { MeasurementTypes } from "squacapi";

export type ProcessedData = Map<number, Map<number, MeasurementTypes[]>>;
export type DataRange = Record<
  number,
  { min?: number; max?: number; count: number }
>;
