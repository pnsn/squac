/** Color options for widgets */
export interface SolidColorOption {
  /** array of hex colors */
  color: string[];
  /** label for display */
  label: string;
  /** type of color gradient from library */
  type: string;
}

/** Combination of color types */
export type GradientColorOption = ColorGradientOption | CustomGradientOption;

/** for gradients created in library */
export interface ColorGradientOption {
  /** display label */
  label: string;
  /** gradient type */
  type: string;
}

/** for gradients created by array of color values */
export interface CustomGradientOption {
  /** array of hex colors */
  color: string[];
  /** display label */
  label: string;
}
