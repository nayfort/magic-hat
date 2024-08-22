import { useEffect } from "react";
import { Stack } from "expo-router";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useColors } from "@/hooks";
import { useCharacterActions } from "@/store/character";

export default function RootLayout() {
  const colors = useColors();
  const { getCharacterIds } = useCharacterActions();

  const screenOptions: NativeStackNavigationOptions = {
    headerBackVisible: true,
    headerBackTitle: "Back",
    headerStyle: { backgroundColor: colors.main },
    headerTitleAlign: "center",
    headerTintColor: colors.accent,
    headerTitleStyle: { color: colors.text },
  };

  useEffect(() => {
    getCharacterIds();
  }, []);

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name={"(home)"} options={{ headerShown: false }} />
      <Stack.Screen name={"details"} options={{ title: "Details" }} />
    </Stack>
  );
}
