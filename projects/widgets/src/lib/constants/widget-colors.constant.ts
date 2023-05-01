import { GradientColorOption, SolidColorOption } from "../interfaces";

/** Solid widget color options */
export const WIDGET_SOLID_COLORS: SolidColorOption[] = [
  {
    color: ["lightgray"],
    label: "Light gray",
    type: "light-gray",
  },
  {
    color: ["white"],
    label: "no color",
    type: "white",
  },
  {
    color: ["#336178"],
    label: "solid blue",
    type: "solid-blue",
  },
  {
    color: ["#ff950a"],
    label: "solid yellow",
    type: "solid-yellow",
  },
  {
    color: ["red"],
    label: "solid red",
    type: "solid-red",
  },
  {
    color: ["green"],
    label: "solid green",
    type: "solid-green",
  },
  {
    color: ["black"],
    label: "solid black",
    type: "solid-black",
  },
  {
    color: ["gray"],
    label: "solid gray",
    type: "solid-gray",
  },
];

/** gradient widget color options */
export const WIDGET_GRADIENT_COLORS: GradientColorOption[] = [
  {
    label: "Rainbow",
    type: "rainbow",
  },
  {
    label: "Picnic",
    type: "picnic",
  },
  {
    label: "Jet",
    type: "jet",
  },
  {
    label: "Hot",
    type: "hot",
  },
  {
    label: "Blue to Red",
    type: "bluered",
  },
  {
    label: "Green and Red",
    color: ["green", "red"],
  },
  {
    label: "Viridis",
    type: "viridis",
  },
  {
    label: "Cool",
    type: "cool",
  },
  {
    label: "Greys",
    type: "greys",
  },
];
