import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { CharacterItem, ScoreBoard, SearchBar, ThemedView } from "@/components";
import {
  useActiveCharacter,
  useCharacterActions,
  useGuessedCharacters,
} from "@/store/character";
import { ICharacter } from "@/types";
import { useColors } from "@/hooks";
import { sh, sw } from "@/utils";

export default function ListTab() {
  const colors = useColors();
  const activeCharacter = useActiveCharacter();
  const guessedCharacters = useGuessedCharacters();
  const { setActiveCharacter } = useCharacterActions();

  const [searchText, setSearchText] = useState("");
  const [filteredCharacters, setFilteredCharacters] = useState<ICharacter[]>(
    [],
  );

  useEffect(() => {
    if (!guessedCharacters.length) {
      setSearchText("");
      setFilteredCharacters([]);
    }
  }, [guessedCharacters.length]);

  const search = (text: string) => {
    setSearchText(text);
    if (!text) {
      setFilteredCharacters([]);
      return;
    }
    const filtered = guessedCharacters.filter((character) =>
      character.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredCharacters(filtered);
  };

  const toDetails = (character: ICharacter) =>
    router.navigate({
      pathname: "/details",
      params: { character: JSON.stringify(character) },
    });

  const renderItem = useCallback(
    ({ item }: { item: ICharacter }) => (
      <CharacterItem
        character={item}
        colors={colors}
        isActive={activeCharacter.id === item.id}
        onCharacterPress={() => toDetails(item)}
        onReloadPress={setActiveCharacter}
      />
    ),
    [activeCharacter.id],
  );

  const separator = useCallback(() => <View style={styles.separator} />, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ScoreBoard />
        <SearchBar
          autoCorrect={false}
          placeholder={"Filter characters..."}
          value={searchText}
          onChangeText={search}
        />
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={
          filteredCharacters.length ? filteredCharacters : guessedCharacters
        }
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={separator}
        renderItem={renderItem}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: sh(20),
    paddingTop: sh(24),
  },
  header: {
    gap: sh(20),
    paddingHorizontal: sw(20),
  },
  list: {
    paddingHorizontal: sh(20),
  },
  separator: {
    height: sh(20),
  },
});
