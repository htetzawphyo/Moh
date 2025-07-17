import Constants from 'expo-constants';
import { useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, TextInput, View } from "react-native";

const BOT_TOKEN = Constants.expoConfig?.extra?.EXPO_PUBLIC_BOT_TOKEN;
const CHAT_ID = Constants.expoConfig?.extra?.EXPO_PUBLIC_CHAT_ID;

const Suggestion = () => {
  const [suggestion, setSuggestion] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendSuggestion = async () => {
    if (suggestion.trim() === "") {
      Alert.alert("Error", "Please enter your suggestion.");
      return;
    }

    setIsLoading(true);

    const senderName = name.trim() === "" ? "Anonymous" : name.trim();
    const message = `<b>From:</b> ${senderName}\n\n<b>Suggestion:</b>\n${suggestion}`;
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      });

      const data = await response.json();

      if (data.ok) {
        Alert.alert("Success", "Your suggestion has been sent!");
        setSuggestion("");
        setName("");
      } else {
        Alert.alert("Error", `Failed to send suggestion: ${data.description}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert(
        "Error",
        "Could not send suggestion. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.nameInput}
        placeholder="Your Name (Optional)"
        placeholderTextColor={"#666666"}
        value={name}
        onChangeText={setName}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your suggestion here..."
        placeholderTextColor={"#666666"}
        multiline
        numberOfLines={4}
        value={suggestion}
        onChangeText={setSuggestion}
        editable={!isLoading}
      />
      <Button
        title="Send Suggestion"
        onPress={sendSuggestion}
        disabled={isLoading}
      />
      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.indicator}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  nameInput: {
    lineHeight: 26,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    color: '#666666',
  },
  input: {
    height: 120,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    color: '#666666',
  },
  indicator: {
    marginTop: 20,
  }
});

export default Suggestion;
