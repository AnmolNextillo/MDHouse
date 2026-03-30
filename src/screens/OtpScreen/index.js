import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import * as Animatable from "react-native-animatable";
import BackIcon from "../../assets/svgs/BackIcon";
import { appColors } from "../../utils/color";
import { useDispatch, useSelector } from "react-redux";
import { hitOtpApi } from "../../redux/OtpApiSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hitResendOtpApi } from "../../redux/AgentResendOtpSlice";

const OTP_LENGTH = 4;
const RESEND_TIME = 30;

const OtpScreen = ({ navigation, route }) => {
    const { id, userType } = route.params || {};

    const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
    const [timer, setTimer] = useState(RESEND_TIME);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    const responseOtp = useSelector((state) => state.otpApiReducer.data);
    const responseResendOtp = useSelector((state) => state.resendOtpApiReducer.data);

    const dispatch = useDispatch();

    const inputs = useRef([]);

    // ⏱ Timer
    useEffect(() => {
        let interval;
        if (isResendDisabled) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setIsResendDisabled(false);
                        return RESEND_TIME;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isResendDisabled]);

    // OTP change
    const handleChange = (text, index) => {
        if (!/^[0-9]?$/.test(text)) return;

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < OTP_LENGTH - 1) {
            inputs.current[index + 1].focus();
        }
    };

    // Backspace
    const handleBackspace = (key, index) => {
        if (key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    // Submit OTP
    const handleSubmit = async () => {
        const finalOtp = otp.join("");

        if (finalOtp.length < OTP_LENGTH) {
            Alert.alert("MD House", "Please enter complete OTP");
            return;
        }

        const userType = await AsyncStorage.getItem("userType");

        console.log("Verify OTP:", finalOtp, id, userType);
        const paramName = userType == 3 ? "agentId" : "studentId";

        const payload = {
            [paramName]: id,
            otp: finalOtp,
            type: userType
        };

        dispatch(hitOtpApi(payload));

        // 👉 Call your verify OTP API here

        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: "BottomBar" }],
        // });
    };

    // ✅ Save token and navigate
    const saveToken = async (loginData) => {
        await AsyncStorage.setItem("token", loginData.token);
        if (userType == 3) {
            navigation.reset({ index: 0, routes: [{ name: "BottomBar" }] });
        }
        else {
            await AsyncStorage.setItem("step", JSON.stringify(loginData.data.step));
            await AsyncStorage.setItem("user", JSON.stringify(loginData.data.studentType));

            const step = loginData.data.step;
            const routes = [
                "UniversityInfo",
                "StudentDetials",
                "ParentDetials",
                "StudentAddress",
                "DocumentUpload",
            ];
            // const screen = loginData.data.studentType == 1 ? routesMap[loginData.data.step] || "BottomBar" : loginData.data.isProfileCompleted == 1 ? "BottomBar" : "AlumniDetails";
            if (loginData.data.studentType == 1) {
                if (step >= 1 && step <= 5) {
                    console.log("Navigating to step:", step);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: routes[step - 1], params: { from: 1 } }],
                    });
                } else {
                    navigation.reset({ index: 0, routes: [{ name: "BottomBar" }] });
                }
            } else {
                if (loginData.data.isProfileCompleted == 1) {
                    navigation.reset({ index: 0, routes: [{ name: "BottomBar" }] });
                } else {
                    navigation.reset({ index: 0, routes: [{ name: "AlumniDetails", params: { from: 1 } }] });
                }
            };
        }

        // const screen = loginData.data.studentType == 1 ? routesMap[loginData.data.step] || "BottomBar" : loginData.data.isProfileCompleted == 1 ? "BottomBar" : "AlumniDetails";

    }

    useEffect(() => {
        if (responseOtp != null) {
            if (responseOtp.status === 1) saveToken(responseOtp);
        }
    }, [responseOtp]);

    // Resend OTP
    const handleResend = async () => {
        setIsResendDisabled(true);
        setTimer(RESEND_TIME);

        console.log("Resend OTP for:", id);

        const userType = await AsyncStorage.getItem("userType");

        console.log("Verify OTP:", id, userType);
        const paramName = userType == 3 ? "agentId" : "studentId";

        dispatch(hitResendOtpApi({
            [paramName]: id,
            type: userType
        }));

        // 👉 Call resend API here
    };

    useEffect(() => {
        if (responseResendOtp != null) {
            if (responseResendOtp.status === 1) {
                Alert.alert("MD House", responseResendOtp.message || "OTP resent successfully");
            } else {
                Alert.alert("MD House", responseResendOtp.message || "Failed to resend OTP. Please try again.");
            }
        }
    }, [responseResendOtp]);

    return (
        <LinearGradient
            colors={[appColors.primaryColor, "#4A90E2"]}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <BackIcon height={32} width={32} fill={appColors.white} />
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Card */}
                        <Animatable.View animation="fadeInUp" style={styles.card}>

                            <Text style={styles.title}>Verify OTP 🔐</Text>
                            <Text style={styles.subtitle}>
                                Enter the 6-digit OTP sent to your registered account
                            </Text>

                            {/* OTP Inputs */}
                            <View style={styles.otpContainer}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => (inputs.current[index] = ref)}
                                        style={styles.otpInput}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        value={digit}
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={({ nativeEvent }) =>
                                            handleBackspace(nativeEvent.key, index)
                                        }
                                    />
                                ))}
                            </View>

                            {/* Resend */}
                            <TouchableOpacity
                                disabled={isResendDisabled}
                                onPress={handleResend}
                            >
                                <Text style={styles.resendText}>
                                    {isResendDisabled
                                        ? `Resend OTP in ${timer}s`
                                        : "Resend OTP"}
                                </Text>
                            </TouchableOpacity>

                            {/* Submit */}
                            <Animatable.View animation="bounceIn" delay={300}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handleSubmit}
                                >
                                    <Text style={styles.buttonText}>Verify OTP</Text>
                                </TouchableOpacity>
                            </Animatable.View>

                        </Animatable.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default OtpScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
    },

    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        paddingBottom: 40,
    },

    card: {
        backgroundColor: appColors.white,
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
        marginVertical: 12,
    },

    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 25,
    },

    otpInput: {
        width: 45,
        height: 55,
        borderWidth: 1,
        borderColor: appColors.grey,
        borderRadius: 10,
        textAlign: "center",
        fontSize: 18,
        color: appColors.black,
    },

    resendText: {
        textAlign: "center",
        color: appColors.primaryColor,
        marginBottom: 20,
        fontWeight: "500",
    },

    button: {
        backgroundColor: appColors.primaryColor,
        borderRadius: 10,
        paddingVertical: 14,
    },

    buttonText: {
        color: appColors.white,
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});