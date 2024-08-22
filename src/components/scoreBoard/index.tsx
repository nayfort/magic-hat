import { StyleSheet, View } from "react-native";

import { ThemedText } from "../themedText";
import { ThemedView } from "../themedView";
import { useScore } from "@/store/score";
import { TColorSet } from "@/styles/types";
import { useColors } from "@/hooks";
import { sh, sw } from "@/utils";

export const ScoreBoard = () => {
  const colors = useColors();
  const styles = getStyles(colors);
  const { total, success, failed } = useScore();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.box}>
        <ThemedText type={"subtitle"}>{total}</ThemedText>
        <ThemedText>Total</ThemedText>
      </View>
      <View style={styles.box}>
        <ThemedText type={"subtitle"}>{success}</ThemedText>
        <ThemedText>Success</ThemedText>
      </View>
      <View style={styles.box}>
        <ThemedText type={"subtitle"}>{failed}</ThemedText>
        <ThemedText>Failed</ThemedText>
      </View>
    </ThemedView>
  );
};

const getStyles = (colors: TColorSet) =>
  StyleSheet.create({
    box: {
      alignItems: "center",
      borderColor: colors.gray,
      borderRadius: sw(10),
      borderWidth: 1,
      gap: sh(8),
      paddingHorizontal: sw(20),
      paddingVertical: sh(12),
    },
    container: {
      flex: 0,
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
