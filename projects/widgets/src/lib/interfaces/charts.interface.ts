import {
  PiecewiseVisualMapComponentOption,
  ContinousVisualMapComponentOption,
  DefaultLabelFormatterCallbackParams,
  SingleAxisComponentOption,
  Color,
} from "echarts";

export interface StoplightVisualMapOption {
  type: "stoplight";
  colors: {
    in: string;
    middle: string;
    out: string;
  };
  min: number;
  max: number;
}
export type VisualMap = Record<
  number,
  | PiecewiseVisualMapComponentOption
  | ContinousVisualMapComponentOption
  | StoplightVisualMapOption
>;

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
