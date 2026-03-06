import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import * as Animatable from "react-native-animatable";
import { appColors } from "../../utils/color";
import Logo from "../../assets/svgs/Logo";
import { useDispatch, useSelector } from "react-redux";
import {
  clearForgotPassword,
  hitForgotPassword,
} from "../../redux/ForgotPasswordSlice";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const response = useSelector((state) => state.forgotReducer.data);

  const onSendLink = () => {
    if (!email) {
      Alert.alert("MD House", "Please enter your email address.");
      return;
    }

    const payload = { email: email };

    dispatch(hitForgotPassword(payload));

    // 🔗 API call will go here
    // Alert.alert(
    //   "MD House",
    //   "Password reset link has been sent to your email.",
    //   [{ text: "OK", onPress: () => navigation.goBack() }]
    // );
  };

  useEffect(() => {
    if (response != null && response.status == 1) {
      Alert.alert("MD House", response.message, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
      dispatch(clearForgotPassword());
    } else {
      if (response != null) {
        Alert.alert("MD House", response.message, [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
      dispatch(clearForgotPassword());
    }
  }, [response]);

  return (
    <LinearGradient
      colors={[appColors.primaryColor, "#4A90E2"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          {/* Logo */}
          <Animatable.View
            animation="zoomIn"
            duration={1500}
            style={styles.logoContainer}
          >
            <Logo width={140} height={140} />
          </Animatable.View>

          {/* Card */}
          <Animatable.View animation="fadeInUp" delay={300} style={styles.card}>
            <Text style={styles.title}>Forgot Password 🔒</Text>
            <Text style={styles.subtitle}>
              Enter your registered email to reset your password
            </Text>

            {/* Email */}
            <Animatable.View
              animation="fadeInLeft"
              delay={600}
              style={styles.inputContainer}
            >
              <TextInput
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
                autoCapitalize="none"
                placeholderTextColor="#A9A9A9"
                returnKeyType="done"
              />
            </Animatable.View>

            {/* Send Button */}
            <Animatable.View animation="bounceIn" delay={900}>
              <TouchableOpacity style={styles.loginButton} onPress={onSendLink}>
                <Text style={styles.loginText}>Send Reset Link</Text>
              </TouchableOpacity>
            </Animatable.View>

            {/* Back to Login */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>
          </Animatable.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: { flex: 1 },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  card: {
    backgroundColor: appColors.white,
    marginTop: 24,
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
    fontSize: 24,
    fontWeight: "700",
    color: appColors.primaryColor,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: appColors.grey,
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
    color: appColors.black,
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: appColors.primaryColor,
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 20,
  },
  loginText: {
    color: appColors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  backText: {
    color: appColors.primaryColor,
    textAlign: "center",
    marginTop: 18,
    fontSize: 14,
    fontWeight: "500",
  },
});
