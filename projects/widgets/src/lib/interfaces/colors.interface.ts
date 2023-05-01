/** Color options for widgets */
export interface SolidColorOption {
  color: string[];
  label: string;
  type: string;
}

/** Combination of color types */
export type GradientColorOption = ColorGradientOption | CustomGradientOption;

/** for gradients created in library */
export interface ColorGradientOption {
  label: string;
  type: string;
}

/** for gradients created by array of color values */
export interface CustomGradientOption {
  color: string[];
  label: string;
}
