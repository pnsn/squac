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
  /** show visual map component */
  show?: boolean;
}

export type VisualMap = Record<number, VisualMapTypes>;

/** Copied from Echarts because they're not exported */
export interface VisualPiece {
  /** min value */
  min?: number;
  /** max value */
  max?: number;
  /** less than value */
  lt?: number;
  /** greater than value */
  gt?: number;
  /** less than or equal to value */
  lte?: number;
  /** greater than or equal to value */
  gte?: number;
  /** single value */
  value?: number;
  /** piece text label */
  label?: string;
  /** symbol representation */
  symbol?: string;
  /** symbol size */
  symbolSize?: number;
  /** piece color */
  color?: string;
  /** piece transparency */
  colorAlpha?: number;
  /** piece opacity */
  opacity?: number;
  /** color lightness */
  colorLightness?: number;
  /** color saturation */
  colorSaturation?: number;
  /**color hue */
  colorHue?: number;
  /** z index */
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
