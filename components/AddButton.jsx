import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const AddButton = ({ setModalVisible }) => {
    return (
        <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.container}
        >
            <View>
                <MaterialIcons name="add" size={24} color="#000" />
            </View>
        </TouchableOpacity>
    );
}

export default AddButton;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4CAF83',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    }
})