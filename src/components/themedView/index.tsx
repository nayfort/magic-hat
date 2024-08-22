import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useColors } from "@/hooks";

interface ThemedViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ThemedView = ({ children, style }: ThemedViewProps) => {
  const colors = useColors();

  return (
    <View style={[{ backgroundColor: colors.main, flex: 1 }, style]}>
      {children}
    </View>
  );
};
