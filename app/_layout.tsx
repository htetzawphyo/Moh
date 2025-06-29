import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Overview",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
          },
          tabBarIcon: () => <MaterialIcons name="home" size={24} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold"
          },
          tabBarIcon: () => <MaterialIcons name="history" size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
          },
          tabBarIcon: () => <MaterialIcons name="settings" size={24} />,
        }}
      />
    </Tabs>
  );
}
