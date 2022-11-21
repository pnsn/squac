import {
  PiecewiseVisualMapComponentOption,
  ContinousVisualMapComponentOption,
  DefaultLabelFormatterCallbackParams,
  SingleAxisComponentOption,
  Color,
} from "echarts";
import { TypeGuard } from "../shared/pipes/guard-type.pipe";

interface VisualMapBase {
  type: "stoplight" | "piecewise" | "continuous";
}

export interface PiecewiseVisualMapOption
  extends PiecewiseVisualMapComponentOption,
    VisualMapBase {
  type: "piecewise";
}

export interface ContinousVisualMapOption
  extends ContinousVisualMapComponentOption,
    VisualMapBase {
  type: "continuous";
}

export type VisualMapTypes =
  | PiecewiseVisualMapOption
  | ContinousVisualMapOption
  | StoplightVisualMapOption;

export const isPiecewise: TypeGuard<
  VisualMapTypes,
  PiecewiseVisualMapOption
> = (visualMap: VisualMapTypes): visualMap is PiecewiseVisualMapOption =>
  visualMap.type === "piecewise";

export const isContinuous: TypeGuard<
  VisualMapTypes,
  ContinousVisualMapOption
> = (visualMap: VisualMapTypes): visualMap is ContinousVisualMapOption =>
  visualMap.type === "continuous";

export const isStoplight: TypeGuard<
  VisualMapTypes,
  StoplightVisualMapOption
> = (visualMap: VisualMapTypes): visualMap is StoplightVisualMapOption =>
  visualMap.type === "stoplight";

export interface StoplightVisualMapOption extends VisualMapBase {
  type: "stoplight";
  colors: {
    in: string;
    middle: string;
    out: string;
  };
  min: number;
  max: number;
}
export type VisualMap = Record<number, VisualMapTypes>;

// Copied from Echarts because they're not exported
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
