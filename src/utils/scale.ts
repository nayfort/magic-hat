import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

// iPhone 15 Pro
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

export const scaleWidth = (size: number) => {
  const scale = width / BASE_WIDTH;
  const scaledSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

export const scaleHeight = (size: number) => {
  const scale = height / BASE_HEIGHT;
  const scaledSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

export const scaleFont = (size: number) => {
  const scale = width / BASE_WIDTH;
  const scaledSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};
