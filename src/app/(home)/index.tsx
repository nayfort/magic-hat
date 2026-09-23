import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";

import {
  Button,
  HouseButton,
  ScoreBoard,
  ThemedText,
  ThemedView,
} from "@/components";
import { useColors } from "@/hooks";
import { TColorSet } from "@/styles/types";
import { useScoreActions } from "@/store/score";
import { GuessResult, TCharacterHouse } from "@/types";
import {
  useActiveCharacter,
  useCharacterActions,
  useCharacterStore,
} from "@/store/character";
import { DEFAULT_CHARACTER_IMAGE } from "@/constants";
import { sh, sw } from "@/utils";

const gryffindor = require("@/assets/images/gryffindor.png");
const hufflepuff = require("@/assets/images/hufflepuff.png");
const ravenclaw = require("@/assets/images/ravenclaw.png");
const slytherin = require("@/assets/images/slytherin.png");

export default function HomeTab() {
  const colors = useColors();
  const styles = getStyles(colors);

  const activeCharacter = useActiveCharacter();
  const { getRandomCharacter, guessCharacterHouse, loadCharacters } =
    useCharacterActions();
  const { incrementSuccess, incrementFailed } = useScoreActions();

  const isRefreshing = useCharacterStore((state) => state.isLoading);
  const error = useCharacterStore((state) => state.error);
  const onRefresh = async () => {
    if (isRefreshing) return;
    if (error || !useCharacterStore.getState().characters.length)
      await loadCharacters();
    getRandomCharacter();
  };

  const guess = (house: TCharacterHouse) => {
    if (isRefreshing) {
      return;
    }
    const guessResult = guessCharacterHouse(house);
    switch (guessResult) {
      case GuessResult.ALREADY_GUESSED:
        return;
      case GuessResult.SUCCESS:
        incrementSuccess();
        break;
      case GuessResult.FAILED:
        incrementFailed();
        break;
    }
    getRandomCharacter();
  };

  return (
    <ThemedView style={styles.container}>
      <ScoreBoard />
      {error ? (
        <ThemedText accessibilityRole="alert">{error}</ThemedText>
      ) : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.character}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <Image
          source={activeCharacter.image || DEFAULT_CHARACTER_IMAGE}
          contentFit={"contain"}
          style={styles.characterImage}
        />
        <ThemedText type={"title"}>{activeCharacter.name}</ThemedText>
      </ScrollView>
      <View style={styles.buttons}>
        <View style={styles.buttonsRow}>
          <HouseButton
            disabled={isRefreshing || activeCharacter.isGuessed}
            source={gryffindor}
            title={"Gryffindor"}
            onPress={() => guess("Gryffindor")}
          />
          <HouseButton
            disabled={isRefreshing || activeCharacter.isGuessed}
            source={slytherin}
            title={"Slytherin"}
            onPress={() => guess("Slytherin")}
          />
        </View>
        <View style={styles.buttonsRow}>
          <HouseButton
            disabled={isRefreshing || activeCharacter.isGuessed}
            source={ravenclaw}
            title={"Ravenclaw"}
            onPress={() => guess("Ravenclaw")}
          />
          <HouseButton
            disabled={isRefreshing || activeCharacter.isGuessed}
            source={hufflepuff}
            title={"Hufflepuff"}
            onPress={() => guess("Hufflepuff")}
          />
        </View>
        <Button
          disabled={isRefreshing || activeCharacter.isGuessed}
          style={styles.notInHouseButton}
          onPress={() => guess("")}
        >
          <ThemedText type={"subtitle"}>Not in house</ThemedText>
        </Button>
      </View>
    </ThemedView>
  );
}

const getStyles = (colors: TColorSet) =>
  StyleSheet.create({
    buttons: {
      gap: sh(12),
    },
    buttonsRow: {
      flexDirection: "row",
      gap: sw(12),
      justifyContent: "space-between",
    },
    character: {
      alignItems: "center",
      flexGrow: 1,
      justifyContent: "center",
    },
    characterImage: {
      height: sh(150),
      width: "100%",
    },
    container: {
      paddingHorizontal: sw(20),
      paddingVertical: sh(24),
    },
    notInHouseButton: {
      alignItems: "center",
      borderColor: colors.accent,
      borderRadius: sw(8),
      borderWidth: sw(1),
      paddingVertical: sh(12),
    },
  });
