import { PressableProps, StyleSheet } from "react-native";
import { Image, ImageProps } from "expo-image";

import { Button } from "../button";
import { ThemedText } from "../themedText";
import { TColorSet } from "@/styles/types";
import { useColors } from "@/hooks";
import { sh, sw } from "@/utils";

interface HouseButtonProps extends PressableProps {
  source: ImageProps["source"];
  title: string;
}

export const HouseButton = ({
  source,
  title,
  onPress,
  ...props
}: HouseButtonProps) => {
  const colors = useColors();
  const styles = getStyles(colors);

  return (
    <Button onPress={onPress} {...props} style={styles.button}>
      <Image source={source} contentFit={"contain"} style={styles.logo} />
      <ThemedText type={"subtitle"}>{title}</ThemedText>
    </Button>
  );
};

const getStyles = (colors: TColorSet) =>
  StyleSheet.create({
    button: {
      alignItems: "center",
      borderColor: colors.accent,
      borderRadius: sw(8),
      borderWidth: sw(1),
      flex: 1,
      paddingHorizontal: sw(20),
      paddingVertical: sh(12),
    },
    logo: {
      width: sw(60),
      height: sh(60),
    },
  });
