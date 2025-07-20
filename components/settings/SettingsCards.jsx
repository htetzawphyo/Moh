import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SettingsCard = ({ onPressCategory, onPressBudget, onPressLimitBudget, onPressSuggestion }) => {
  return (
    <View>
      <TouchableOpacity style={styles.card} onPress={onPressCategory}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
          <MaterialIcons name="list" size={24} />
          <View>
            <Text style={{ fontSize: 16 }}>Category</Text>
          </View>
        </View>
        <View>
          <MaterialIcons name="chevron-right" size={24} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={onPressBudget}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
          <MaterialIcons name="attach-money" size={24} />
          <View>
            <Text style={{ fontSize: 16 }}>Budget</Text>
          </View>
        </View>
        <View>
          <MaterialIcons name="chevron-right" size={24} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={onPressLimitBudget}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
          <MaterialCommunityIcons name="bell-alert" size={22} />
          <View>
            <Text style={{ fontSize: 16 }}>Limit Budget</Text>
          </View>
        </View>
        <View>
          <MaterialIcons name="chevron-right" size={24} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={onPressSuggestion}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5,
          }}
        >
          <MaterialIcons name="message" size={22} />
          <View>
            <Text style={{ fontSize: 16 }}>Suggestion</Text>
          </View>
        </View>
        <View>
          <MaterialIcons name="chevron-right" size={24} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f1f1f1",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderRadius: 10,
    padding: 15,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 10,
    elevation: 2,
  },
});

export default SettingsCard;
