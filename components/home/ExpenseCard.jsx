import { MaterialIcons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";

const ExpenseCard = () => {
    const items = [
        { id: 1, name: "Starbucks", category: "Coffee", amount: -5000, icon: "coffee" },
        { id: 2, name: "Amazon", category: "Shopping", amount: -15000, icon: "shopping-cart" },
        { id: 3, name: "Uber", category: "Transport", amount: -3000, icon: "directions-car" },
        { id: 4, name: "Netflix", category: "Entertainment", amount: -12000, icon: "tv" },
        { id: 5, name: "Groceries", category: "Food", amount: -8000, icon: "local-grocery-store" },
        { id: 6, name: "Gym", category: "Fitness", amount: -6000, icon: "fitness-center" },
        { id: 7, name: "Dining Out", category: "Food", amount: -7000, icon: "restaurant" },
        { id: 8, name: "Spotify", category: "Entertainment", amount: -5000, icon: "music-note" },
        { id: 9, name: "Electricity Bill", category: "Utilities", amount: -4000, icon: "flash-on" },
        { id: 10, name: "Water Bill", category: "Utilities", amount: -3000, icon: "water" },
        { id: 11, name: "Internet Bill", category: "Utilities", amount: -2000, icon: "wifi" },
        { id: 12, name: "Phone Bill", category: "Utilities", amount: -2500, icon: "phone" },
        { id: 13, name: "Clothing", category: "Shopping", amount: -10000, icon: "checkroom" },
        { id: 14, name: "Books", category: "Education", amount: -7000, icon: "book" },
        { id: 15, name: "Travel", category: "Leisure", amount: -20000, icon: "flight" },
        { id: 16, name: "Insurance", category: "Finance", amount: -15000, icon: "shield" },
        { id: 17, name: "Charity", category: "Donation", amount: -5000, icon: "favorite" },
        { id: 18, name: "Pet Care", category: "Pets", amount: -6000, icon: "pets" },
        { id: 19, name: "Subscriptions", category: "Entertainment", amount: -8000, icon: "subscriptions" },
        { id: 20, name: "Miscellaneous", category: "Other", amount: -3000, icon: "more-horiz" }
    ];

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 15
            }}>
                <MaterialIcons name={item.icon} size={24} />
                <View>
                    <Text style={{ fontSize: 16 }}>{item.name}</Text>
                    <Text style={{ fontSize: 14, color: "#888" }}>{item.category}</Text>
                </View>
            </View>
            <View>
                <Text style={{ fontSize: 16, color: '#DC2626' }}>{item.amount}</Text>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                // initialNumToRender={20}
                // removeClippedSubviews={false}
            />
        </View>
    );
}

export default ExpenseCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        padding: 15,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    }
});
// card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
// }