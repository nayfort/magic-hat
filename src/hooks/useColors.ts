import { useColorScheme } from "react-native";
import { colors } from "@/styles";
import { TColorSet } from "@/styles/types";

export const useColors = (): TColorSet => {
  const theme = useColorScheme() ?? "light";
  return colors[theme];
};
