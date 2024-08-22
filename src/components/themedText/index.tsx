import { Text, TextProps } from "react-native";
import { useColors, useFonts } from "@/hooks";
import { TFontType } from "@/styles/types";

interface ThemedTextProps extends TextProps {
  type?: TFontType;
}

export const ThemedText = ({
  style,
  type = "default",
  ...props
}: ThemedTextProps) => {
  const colors = useColors();
  const font = useFonts(type);

  return <Text style={[{ color: colors.text, ...font }, style]} {...props} />;
};
