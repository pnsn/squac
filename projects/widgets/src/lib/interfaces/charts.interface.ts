import {
  PiecewiseVisualMapComponentOption,
  ContinousVisualMapComponentOption,
  DefaultLabelFormatterCallbackParams,
  SingleAxisComponentOption,
  Color,
} from "echarts";
import { TypeGuard } from "../shared/pipes/guard-type.pipe";

/** Visual map base types */
interface VisualMapBase {
  type: "stoplight" | "piecewise" | "continuous";
}

/** Piecewise option */
export interface PiecewiseVisualMapOption
  extends PiecewiseVisualMapComponentOption,
    VisualMapBase {
  type: "piecewise";
}

/** continuous option */
export interface ContinousVisualMapOption
  extends ContinousVisualMapComponentOption,
    VisualMapBase {
  type: "continuous";
}

//** Visual map types */
export type VisualMapTypes =
  | PiecewiseVisualMapOption
  | ContinousVisualMapOption
  | StoplightVisualMapOption;

/**
 * typeguard for piecewise
 *
 * @param visualMap visual map to check
 * @returns true if visualmap is piecewise
 */
export const isPiecewise: TypeGuard<
  VisualMapTypes,
  PiecewiseVisualMapOption
> = (visualMap: VisualMapTypes): visualMap is PiecewiseVisualMapOption =>
  visualMap.type === "piecewise";

/**
 * typeguard for continuous
 *
 * @param visualMap visual map to check
 * @returns true if visualmap is continuous
 */
export const isContinuous: TypeGuard<
  VisualMapTypes,
  ContinousVisualMapOption
> = (visualMap: VisualMapTypes): visualMap is ContinousVisualMapOption =>
  visualMap.type === "continuous";

/**
 * typeguard for stoplight
 *
 * @param visualMap visual map to check
 * @returns true if visualmap is stoplight
 */
export const isStoplight: TypeGuard<
  VisualMapTypes,
  StoplightVisualMapOption
> = (visualMap: VisualMapTypes): visualMap is StoplightVisualMapOption =>
  visualMap.type === "stoplight";

/** options for stoplight visualmap */
export interface StoplightVisualMapOption extends VisualMapBase {
  /** type */
  type: "stoplight";
  /** colors */
  colors: {
    in: string;
    middle: string;
    out: string;
  };
  /** visual map min */
  min: number;
  /** visual map max */
  max: number;
}

export type VisualMap = Record<number, VisualMapTypes>;

/** Copied from Echarts because they're not exported */
export interface VisualPiece {
  min?: number;
  max?: number;
  lt?: number;
  gt?: number;
  lte?: number;
  gte?: number;
  value?: number;
  label?: string;
  symbol?: string;
  symbolSize?: number;
  color?: string;
  colorAlpha?: number;
  opacity?: number;
  colorLightness?: number;
  colorSaturation?: number;
  colorHue?: number;
  liftZ?: number;
}

export type LabelFormatterParams = {
  value: string | number | Date;
  axisDimension: string;
  axisIndex: number;
  seriesData: DefaultLabelFormatterCallbackParams[];
};

export type ParallelAxisOption = SingleAxisComponentOption & {
  /**
   * 0, 1, 2, ...
   */
  dim?: number | number[];
  parallelIndex?: number;
  areaSelectStyle?: {
    width?: number;
    borderWidth?: number;
    borderColor?: Color;
    color?: Color;
    opacity?: number;
  };
  realtime?: boolean;
};
