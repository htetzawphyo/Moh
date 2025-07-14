import { useFetchHistory } from "@/utils/useFetchHistory";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";

const Expenses = ({ refreshKey }) => {
  const { data, isLoading } = useFetchHistory(refreshKey);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!data || data.length === 0) {
    return <Text style={{ lineHeight: 26 }}>ကုန်ကျငွေ မရှိသေးပါ။</Text>;
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 15,
        }}
      >
        <MaterialIcons name={item.icon || "category"} size={24} />
        <View>
          <Text style={{ fontSize: 16, lineHeight: 26 }}>{item.name}</Text>
          <Text style={{ fontSize: 14, color: "#888" }}>{item.date}</Text>
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 16, color: "#DC2626" }}>{item.amount}</Text>
      </View>
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Expenses;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    shadowColor: "#fff",
    // backgroundColor: "#f1f1f1",
    // shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderRadius: 20,
    padding: 5,
    // padding: 15,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 10,
    elevation: 2,
  },
});
