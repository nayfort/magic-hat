import { useEffect, ComponentProps } from "react";
import { Stack } from "expo-router";

import { useColors } from "@/hooks";
import { useCharacterActions } from "@/store/character";

export default function RootLayout() {
  const colors = useColors();
  const { loadCharacters } = useCharacterActions();

  const screenOptions: ComponentProps<typeof Stack>["screenOptions"] = {
    headerBackVisible: true,
    headerBackTitle: "Back",
    headerStyle: { backgroundColor: colors.main },
    headerTitleAlign: "center",
    headerTintColor: colors.accent,
    headerTitleStyle: { color: colors.text },
  };

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name={"(home)"} options={{ headerShown: false }} />
      <Stack.Screen name={"details"} options={{ title: "Details" }} />
    </Stack>
  );
}
