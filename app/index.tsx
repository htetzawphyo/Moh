import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import BudgetOverview from "../components/home/BudgetOverview";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <BudgetOverview />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "ios" ? 25 : 0
    // paddingTop: Platform.OS === "ios" ? 25 : StatusBar.currentHeight
    // backgroundColor: "#007a33",
  },
});
