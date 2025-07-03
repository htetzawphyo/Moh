import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const AddCategoryButton = () => {
    const bounceAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: 1.05,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [bounceAnim])
    return (
        <AnimatedTouchable
            style={[styles.container, { transform: [{ scale: bounceAnim }] }]}
        >
            <Text style={styles.buttonText}>Add New</Text>
            <MaterialIcons name="arrow-forward" size={24} color="#000" />
        </AnimatedTouchable>
    );
}

export default AddCategoryButton;

const styles = StyleSheet.create({
    // container: {
    //     position: 'absolute',
    //     bottom: 20,
    //     right: 20,
    //     width: 60,
    //     height: 60,
    //     borderRadius: 30,
    //     backgroundColor: '#4CAF83',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 3.84,
    //     elevation: 5
    // }
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,

        backgroundColor: '#4CAF83',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    }
})