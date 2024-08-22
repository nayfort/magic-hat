import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { ThemedText, ThemedView } from "@/components";
import { ICharacter } from "@/types";
import { useColors } from "@/hooks";
import { TColorSet } from "@/styles/types";
import { DEFAULT_CHARACTER_IMAGE } from "@/constants";
import { sh, sw } from "@/utils";

export default function DetailsScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ character: string }>();
  const character: ICharacter = JSON.parse(params.character);
  const styles = getStyles(colors);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerTitle: character.name }} />
      <View style={styles.info}>
        <Image
          source={character.image || DEFAULT_CHARACTER_IMAGE}
          contentFit={"contain"}
          style={styles.image}
        />
        <View style={styles.bioContainer}>
          {character.isGuessed ? (
            <View style={styles.bio}>
              <ThemedText type={"subtitle"}>
                House: <ThemedText>{character.house || "-"}</ThemedText>
              </ThemedText>
              <ThemedText type={"subtitle"}>
                {"Date of birth: "}
                <ThemedText>{character.dateOfBirth ?? "-"}</ThemedText>
              </ThemedText>
              <ThemedText type={"subtitle"}>
                Actor: <ThemedText>{character.actor || "-"}</ThemedText>
              </ThemedText>
              <ThemedText type={"subtitle"}>
                Patronus: <ThemedText>{character.patronus || "-"}</ThemedText>
              </ThemedText>
            </View>
          ) : (
            <ThemedText type={"subtitle"} style={styles.accessDenied}>
              Access denied
            </ThemedText>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const getStyles = (colors: TColorSet) =>
  StyleSheet.create({
    accessDenied: {
      borderColor: colors.red,
      borderRadius: sw(8),
      borderWidth: 1,
      color: colors.red,
      paddingHorizontal: sw(16),
      paddingVertical: sh(12),
    },
    bio: {
      gap: sh(12),
    },
    bioContainer: {
      alignItems: "center",
      flex: 1,
      flexShrink: 1,
    },
    container: {
      paddingVertical: sh(24),
      paddingHorizontal: sw(20),
    },
    image: {
      width: "40%",
      justifyContent: "flex-start",
    },
    info: {
      minHeight: sh(150),
      flexDirection: "row",
    },
  });
