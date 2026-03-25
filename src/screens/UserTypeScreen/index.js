import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import * as Animatable from "react-native-animatable";
import { appColors } from "../../utils/color";
import Logo from "../../assets/svgs/Logo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserTypeScreen = ({ navigation }) => {
    const handleSelect = async (type) => {
        await AsyncStorage.setItem("userType", type);
        type === "partner" ? navigation.navigate("PartnerLogin")
            : navigation.navigate("Login");
    };

    return (
        <LinearGradient
            colors={[appColors.primaryColor, "#4A90E2"]}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }}>

                {/* Logo Animation */}
                <Animatable.View
                    animation="zoomIn"
                    duration={1500}
                    style={styles.logoContainer}
                >
                    <Logo width={160} height={160} />
                </Animatable.View>

                {/* Card */}
                <Animatable.View
                    animation="fadeInUp"
                    delay={300}
                    style={styles.card}
                >
                    <Text style={styles.title}>Welcome 👋</Text>
                    <Text style={styles.subtitle}>Choose your role to continue</Text>

                    {/* Student Button */}
                    <Animatable.View animation="fadeInLeft" delay={500}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleSelect("student",{isAlumni:false})}
                        >
                            <Text style={styles.buttonText}>Student</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                    <Animatable.View animation="fadeInLeft" delay={500}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleSelect("student",{isAlumni:true})}
                        >
                            <Text style={styles.buttonText}>Alumni</Text>
                        </TouchableOpacity>
                    </Animatable.View>

                    {/* Partner Button */}
                    <Animatable.View animation="fadeInRight" delay={700}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleSelect("partner")}
                        >
                            <Text style={styles.buttonText}>Partner</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </Animatable.View>

            </SafeAreaView>
        </LinearGradient>
    );
};

export default UserTypeScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },

    logoContainer: {
        alignItems: "center",
        marginTop: 80,
    },

    card: {
        backgroundColor: appColors.white,
        marginTop: 40,
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        color: appColors.primaryColor,
        textAlign: "center",
    },

    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 30,
    },

    button: {
        backgroundColor: appColors.primaryColor,
        borderRadius: 12,
        paddingVertical: 16,
        marginVertical: 10,
        alignItems: "center",
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});