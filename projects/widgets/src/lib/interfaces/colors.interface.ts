export interface SolidColorOption {
  color: string[];
  label: string;
  type: string;
}

export type GradientColorOption = ColorGradientOption | CustomGradientOption;

/** for gradients created in library */
export interface ColorGradientOption {
  label: string;
  type: string;
}

export interface CustomGradientOption {
  color: string[];
  label: string;
}
