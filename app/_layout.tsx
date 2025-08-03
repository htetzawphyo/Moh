import { useDbStore } from "@/store/dbStore";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from 'expo-sqlite';

export default function RootLayout() {
  const { db, dbLoaded, dbError, initializeDb } = useDbStore();
  const router = useRouter();
  
  // =================== it's for dabase client ========================
  const showDb = SQLite.openDatabaseSync('moh_db.db');
  useDrizzleStudio(showDb);
  // =================== it's for dabase client =========================

  useEffect(() => {
    console.log("hello");

    if (!dbLoaded && !db && !dbError) {
      initializeDb();
    }
  }, [dbLoaded, db, dbError, initializeDb]); 

  if (dbError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Error loading database: {dbError.message}
        </Text>
      </View>
    );
  }

  if (!dbLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Initializing database...</Text>
      </View>
    );
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: () => <MaterialIcons name="home" size={24} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          headerShown: false,
          title: "History",
          tabBarIcon: () => <MaterialIcons name="history" size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: () => <MaterialIcons name="settings" size={24} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.replace("/settings");
          }
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});
