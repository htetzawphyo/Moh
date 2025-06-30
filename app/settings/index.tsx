import SettingsCard from "@/components/settings/SettingsCards";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Settings = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.child_container}>
        <Text style={styles.title_label}>Settings</Text>
        <Text style={{ marginBottom: 20, fontSize: 14, color: "#888" }}>Customize your app experience</Text>
        <SettingsCard />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 25 : StatusBar.currentHeight,
    backgroundColor: "#f1f1f1",
  },
  child_container: {
    padding: 20,
  },
  title_label: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#4CAF83",
  },
});
export default Settings;
