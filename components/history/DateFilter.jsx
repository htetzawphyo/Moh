import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

const DateFilter = () => {
  return (
    <TouchableOpacity
      style={styles.container}
    >
      <MaterialIcons name="date-range" size={24} />
      <Text style={{ fontSize: 16 }}>Date</Text>
    </TouchableOpacity>
  );
};

export default DateFilter;

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
};
