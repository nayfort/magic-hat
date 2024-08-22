import { Tabs } from "expo-router";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { useColors } from "@/hooks";
import { Button, TabBarIcon, ThemedText } from "@/components";
import { useScoreActions } from "@/store/score";
import { useCharacterActions } from "@/store/character";
import { sw } from "@/utils";

const headerRight = (onPress: () => void, color: string) => (
  <Button style={{ paddingRight: sw(20) }} onPress={onPress}>
    <ThemedText style={{ color }}>Reset</ThemedText>
  </Button>
);

const tabBarIcon = (name: string, isFocused: boolean) => (
  <TabBarIcon name={name} isFocused={isFocused} />
);

export default function HomeLayout() {
  const colors = useColors();
  const { resetScore } = useScoreActions();
  const { resetGuessedCharacters } = useCharacterActions();

  const reset = () => {
    resetScore();
    resetGuessedCharacters();
  };

  const screenOptions: BottomTabNavigationOptions = {
    headerRight: () => headerRight(reset, colors.accent),
    headerStyle: { backgroundColor: colors.main, shadowColor: colors.shadow },
    headerTitleAlign: "center",
    headerTitleStyle: { color: colors.text },
    tabBarActiveTintColor: colors.accent,
    tabBarInactiveTintColor: colors.text,
    tabBarStyle: {
      backgroundColor: colors.main,
      borderTopColor: colors.shadow,
    },
  };

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name={"index"}
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => tabBarIcon("home", focused),
        }}
      />
      <Tabs.Screen
        name={"list"}
        options={{
          title: "List",
          tabBarIcon: ({ focused }) => tabBarIcon("list-ul", focused),
        }}
      />
    </Tabs>
  );
}
