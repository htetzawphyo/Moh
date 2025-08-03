import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="category"
        options={{
          // headerShown: false,
          headerTitle: "Category",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
          },
          headerRight: () => (
            <TouchableOpacity
            // onPress={() => {
            //   router.replace("/settings");
            // }}
            >
              <MaterialIcons
                name="settings"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="budget"
        options={{
          // headerShown: false
          headerTitle: "Budget",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
          },
          headerRight: () => (
            <TouchableOpacity>
              <MaterialIcons
                name="settings"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="limit_budget"
        options={{
          headerTitle: "Budget Limit",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
          },
          headerRight: () => (
            <TouchableOpacity
            >
              <MaterialIcons
                name="settings"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="suggestion"
        options={{
          headerTitle: "Suggestion",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
          },
          headerRight: () => (
            <TouchableOpacity
            >
              <MaterialIcons
                name="settings"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
