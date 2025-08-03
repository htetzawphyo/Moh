import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const AddButton = ({ setModalVisible }) => {
    const bounceAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: 1.2,
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
            onPress={() => setModalVisible(true)}
            style={[styles.container, { transform: [{ scale: bounceAnim }] }]}
        >
            <MaterialIcons name="add" size={24} color="#000" />
        </AnimatedTouchable>
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