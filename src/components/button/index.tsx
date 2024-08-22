import React from "react";
import { Pressable, PressableProps, ViewStyle } from "react-native";

interface ButtonProps extends PressableProps {
  style?: ViewStyle;
}

export const Button = ({ children, style, ...props }: ButtonProps) => (
  <Pressable
    style={({ pressed }) => ({
      opacity: pressed ? 0.6 : 1,
      ...style,
    })}
    {...props}
  >
    {children}
  </Pressable>
);
