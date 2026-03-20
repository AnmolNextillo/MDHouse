import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  Platform,
  Linking,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import * as Animatable from "react-native-animatable";
import { appColors } from "../../../utils/color";
import { useDispatch, useSelector } from "react-redux";
import { clearLoginData, hitLogin } from "../../../redux/LoginSlice";
import { hitVersionApi } from "../../../redux/GetVersionSlice";
import DeviceInfo from "react-native-device-info";
import Logo from "../../../assets/svgs/Logo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  appleAuth,
  AppleButton,
} from "@invertase/react-native-apple-authentication";
import { getImage } from "../../../utils/getImages";
import BackIcon from "../../../assets/svgs/BackIcon";

const PartnerLogin = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [fcmToken, setFcmToken] = useState("");
  const [userType, setUserType] = useState(""); // student | alumni

  const responseLogin = useSelector((state) => state.loginReducer.data);
  const responseVersion = useSelector((state) => state.getVersionReducer.data);
  const responseGoogleLogin = useSelector(
    (state) => state.googleLoginReducer.data
  );
  const dispatch = useDispatch();

  // ✅ Initial API call
  useEffect(() => {
    dispatch(hitVersionApi());
  }, []);

  // ✅ Save FCM token
  useEffect(() => {
    const saveFcm = async () => {
      const token = await AsyncStorage.getItem("fcmToken");
      console.log("[Login] FCM Token:", token);
      setFcmToken(token);
    };
    saveFcm();
  }, []);

  // ✅ Login Click
  const onLoginClick = () => {

    if (!email) {
      Alert.alert("MD House", "Please enter Email.");
    } else if (!password) {
      Alert.alert("MD House", "Please enter Password.");
    } else {
      const payload = { email, password, fcmToken, studentType:"partner" };
      dispatch(hitLogin(payload));
    }
  };

  // ✅ Save token and navigate
  const saveToken = async (loginData) => {
    await AsyncStorage.setItem("token", loginData.token);

    // const screen = loginData.data.studentType == 1 ? routesMap[loginData.data.step] || "BottomBar" : loginData.data.isProfileCompleted == 1 ? "BottomBar" : "AlumniDetails";

        navigation.reset({ index: 0, routes: [{ name: "BottomBar" }] });
     
  }

  // ✅ Handle login response
  useEffect(() => {
      console.log("Login Response Partner:", responseLogin);
    if (responseLogin) {
      
      if (responseLogin.status === 1) saveToken(responseLogin);
      else Alert.alert("MD House", responseLogin.message);
      dispatch(clearLoginData());
    }
  }, [responseLogin]);

  // ✅ Handle Google login response
  useEffect(() => {
    if (responseGoogleLogin) {
      if (responseGoogleLogin.status === 1) saveToken(responseGoogleLogin);
      else Alert.alert("MD House", responseGoogleLogin.message);
      dispatch(clearGoogleLogin());
    }
  }, [responseGoogleLogin]);

  // ✅ Check version
  useEffect(() => {
    if (responseVersion && responseVersion.status === 1) checkForUpdates();
  }, [responseVersion]);

  const checkForUpdates = async () => {
    try {
      const currentVersion = DeviceInfo.getVersion();
      const latestVersion =
        Platform.OS === "android"
          ? responseVersion.data.android
          : responseVersion.data.ios;
      const updateUrl =
        Platform.OS === "android"
          ? "https://play.google.com/store/apps/details?id=com.mdhouseapp"
          : "https://apps.apple.com/in/app/mdhouse/id6749562016";

      if (currentVersion < latestVersion) {
        Alert.alert(
          "Update Available",
          `A new version (${latestVersion}) is available. Please update to continue.`,
          [{ text: "Update Now", onPress: () => Linking.openURL(updateUrl) }]
        );
      }
    } catch (err) {
      console.log("Error checking updates:", err);
    }
  };

  return (
    <LinearGradient
      colors={[appColors.primaryColor, "#4A90E2"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
      </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
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
              <Text style={styles.title}>Welcome Back 👋</Text>
              <Text style={styles.subtitle}>Login to continue</Text>

              {/* Email */}
              <Animatable.View
                animation="fadeInLeft"
                delay={500}
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
                  returnKeyType="next"
                />
              </Animatable.View>

              {/* Password */}
              <Animatable.View
                animation="fadeInLeft"
                delay={700}
                style={styles.inputContainer}
              >
                <TextInput
                  placeholder="Enter Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  style={styles.input}
                  autoCapitalize="none"
                  placeholderTextColor="#A9A9A9"
                  returnKeyType="done"
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Image
                    source={getImage(isPasswordVisible ? "show" : "hide")}
                    style={styles.imageBoxStyle}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </Animatable.View>

              {/* Login Button */}
              <Animatable.View animation="bounceIn" delay={900}>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={onLoginClick}
                >
                  <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
              </Animatable.View>

              <TouchableOpacity
                style={{ alignItems: "flex-end" }}
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.forgotText}>Forgot Password? </Text>
              </TouchableOpacity>

            </Animatable.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PartnerLogin;

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
    fontSize: 26,
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
  input: { flex: 1, color: appColors.black, fontSize: 15 },
  imageBoxStyle: {
    justifyContent: "center",
    alignSelf: "center",
    height: 28,
    width: 28,
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
  googleButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  googleText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 8,
  },
  appleButton: { width: "100%", height: 50, marginTop: 16 },
  signupText: {
    color: appColors.primaryColor,
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    fontWeight: "500",
  },
  forgotText: {
    color: appColors.primaryColor,
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },

  userTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  userTypeActive: {
    backgroundColor: appColors.primaryColor,
    borderColor: appColors.primaryColor,
  },
  userTypeText: { color: "#333" },
  userTypeTextActive: { color: "#fff", fontWeight: "600" },
});
