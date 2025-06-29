import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function History() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Text>History app/index.tsx to edit this screen.</Text> */}
      <Text>History Screen</Text>
      <Button
        title="Go to Detail"
        onPress={() => router.push("/history/detail")}
      />
    </View>
  );
}
