import { TextStyle } from "react-native";

type Theme = "dark" | "light";

export type TColorSet = {
  accent: string;
  gray: string;
  green: string;
  main: string;
  red: string;
  shadow: string;
  text: string;
};

export type TColors = Record<Theme, TColorSet>;

export type TFontType = "caption" | "default" | "subtitle" | "title";

export type TFont = {
  fontSize: TextStyle["fontSize"];
  fontWeight: TextStyle["fontWeight"];
};

export type TFonts = Record<TFontType, TFont>;
