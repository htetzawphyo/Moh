import { MaterialIcons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";

const Expenses = () => {
  const items = [
    {
      id: 1,
      name: "Starbucks",
      date: "2025-06-01",
      amount: -5000,
      icon: "coffee",
    },
    {
      id: 2,
      name: "Amazon",
      date: "2025-06-03",
      amount: -15000,
      icon: "shopping-cart",
    },
    {
      id: 3,
      name: "Uber",
      date: "2025-06-05",
      amount: -3000,
      icon: "directions-car",
    },
    {
      id: 4,
      name: "Netflix",
      date: "2025-06-07",
      amount: -12000,
      icon: "tv",
    },
    {
      id: 5,
      name: "Groceries",
      date: "2025-06-08",
      amount: -8000,
      icon: "local-grocery-store",
    },
    {
      id: 6,
      name: "Gym",
      date: "2025-06-10",
      amount: -6000,
      icon: "fitness-center",
    },
    {
      id: 7,
      name: "Dining Out",
      date: "2025-06-12",
      amount: -7000,
      icon: "restaurant",
    },
    {
      id: 8,
      name: "Spotify",
      date: "2025-06-14",
      amount: -5000,
      icon: "music-note",
    },
    {
      id: 9,
      name: "Electricity Bill",
      date: "2025-06-15",
      amount: -4000,
      icon: "flash-on",
    },
    {
      id: 10,
      name: "Water Bill",
      date: "2025-06-17",
      amount: -3000,
      icon: "water",
    },
    {
      id: 11,
      name: "Internet Bill",
      date: "2025-06-19",
      amount: -2000,
      icon: "wifi",
    },
    {
      id: 12,
      name: "Phone Bill",
      date: "2025-06-20",
      amount: -2500,
      icon: "phone",
    },
    {
      id: 13,
      name: "Clothing",
      date: "2025-06-22",
      amount: -10000,
      icon: "checkroom",
    },
    {
      id: 14,
      name: "Books",
      date: "2025-06-24",
      amount: -7000,
      icon: "book",
    },
    {
      id: 15,
      name: "Travel",
      date: "2025-06-25",
      amount: -20000,
      icon: "flight",
    },
    {
      id: 16,
      name: "Insurance",
      date: "2025-06-26",
      amount: -15000,
      icon: "shield",
    },
    {
      id: 17,
      name: "Charity",
      date: "2025-06-27",
      amount: -5000,
      icon: "favorite",
    },
    {
      id: 18,
      name: "Pet Care",
      date: "2025-06-28",
      amount: -6000,
      icon: "pets",
    },
    {
      id: 19,
      name: "Subscriptions",
      date: "2025-06-29",
      amount: -8000,
      icon: "subscriptions",
    },
    {
      id: 20,
      name: "Miscellaneous",
      date: "2025-06-30",
      amount: -3000,
      icon: "more-horiz",
    },
  ];

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
        <MaterialIcons name={item.icon} size={24} />
        <View>
          <Text style={{ fontSize: 16 }}>{item.name}</Text>
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
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
