import { Stack } from "expo-router";

export default function SettingsBudgetLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
