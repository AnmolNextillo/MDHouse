import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import LinearGradient from "react-native-linear-gradient";
import * as Animatable from "react-native-animatable";
import { useDispatch, useSelector } from "react-redux";
import { clearSignupData, hitSignup } from "../../redux/SignUpSlice";
import { clearGoogleLogin, hitGoogleLogin } from "../../redux/GoogleLoginSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { appColors } from "../../utils/color";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import GoogleIcon from "../../assets/svgs/GoogleIcon";
import Logo from "../../assets/svgs/Logo";
import { getImage } from "../../utils/getImages";
import {
  appleAuth,
  AppleButton,
} from "@invertase/react-native-apple-authentication";

const SignUp = ({ navigation }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [fcmToken, setFcmToken] = useState("");
  const [userType, setUserType] = useState(""); // student | alumni

  const responseSignup = useSelector((state) => state.signupReducer.data);
  const responseGoogleLogin = useSelector(
    (state) => state.googleLoginReducer.data
  );

  /* ---------------- Google Config ---------------- */
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "291287014472-t01omlest1opnm8qfoto5ag57gpp82sk.apps.googleusercontent.com",
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  /* ---------------- Save FCM ---------------- */
  useEffect(() => {
    const saveFcm = async () => {
      const token = await AsyncStorage.getItem("fcmToken");
      setFcmToken(token);
    };
    saveFcm();
  }, []);

  /* ---------------- Navigation Logic ---------------- */
  const saveToken = async (loginData) => {
    await AsyncStorage.setItem("token", loginData.token);
    await AsyncStorage.setItem(
      "step",
      JSON.stringify(loginData.data.step)
    );
     await AsyncStorage.setItem("user", JSON.stringify(loginData.data.studentType));

    const routesMap = {
      1: "UniversityInfo",
      2: "StudentDetials",
      3: "ParentDetials",
      4: "StudentAddress",
      5: "DocumentUpload",
    };

    const screen = loginData.data.studentType == 1 ? routesMap[loginData.data.step] || "BottomBar" :loginData.data.isProfileCompleted==1?"BottomBar": "AlumniDetails";

    navigation.reset({
      index: 0,
      routes: [{ name: screen, params: { from: 1 } }],
    });
  };

  /* ---------------- Signup Response ---------------- */
  useEffect(() => {
    if (responseSignup) {
      responseSignup.status === 1
        ? saveToken(responseSignup)
        : Alert.alert("MD House", responseSignup.message);
      dispatch(clearSignupData());
    }
  }, [responseSignup]);

  /* ---------------- Google Response ---------------- */
  useEffect(() => {
    if (responseGoogleLogin) {
      responseGoogleLogin.status === 1
        ? saveToken(responseGoogleLogin)
        : Alert.alert("MD House", responseGoogleLogin.message);
      dispatch(clearGoogleLogin());
    }
  }, [responseGoogleLogin]);

  /* ---------------- Normal Signup ---------------- */
  const onSignupClick = () => {
    if (!userType) {
      Alert.alert("MD House", "Please select Student or Alumni");
      return
    }
    if (!name) Alert.alert("MD House", "Please Enter Name");
    else if (!email) Alert.alert("MD House", "Please Enter Email");
    else if (!password) Alert.alert("MD House", "Please Enter Password");
    else
      dispatch(
        hitSignup({
          name,
          email,
          password,
          studentType: userType == "student" ? 1 : 2,
          fcmToken,
        })
      );
  };

  /* ---------------- Google Signup ---------------- */
  const onGoogleButtonPress = async () => {
    try {
      if (!userType) {
        Alert.alert("MD House", "Please select Student or Alumni");
        return;
      }

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const payload = {
        googleId: userInfo.data.user.id,
        email: userInfo.data.user.email,
        studentType: userType == "student" ? 1 : 2,
        fcmToken,
      };

      dispatch(hitGoogleLogin(payload));
    } catch (error) {
      Alert.alert("MD House", "Google Sign-In failed");
    }
  };

  /* ---------------- Apple Signup ---------------- */
  const onAppleButtonPress = async () => {
    try {
      if (!userType) {
        Alert.alert("MD House", "Please select Student or Alumni");
        return;
      }

      const res = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      dispatch(
        hitGoogleLogin({
          googleId: res.user,
          email: res.email,
          studentType: userType == "student" ? 1 : 2,
          type: "apple",
          fcmToken,
        })
      );
    } catch (e) {
      console.log("Apple error", e);
    }
  };

  /* ================= UI ================= */
  return (
    <LinearGradient
      colors={[appColors.primaryColor, "#4A90E2"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Animatable.View animation="zoomIn" style={styles.logoContainer}>
              <Logo width={160} height={160} />
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.card}>
              <Text style={styles.title}>Sign Up</Text>
              <Text style={styles.subtitle}>Create your account</Text>

              <View style={styles.userTypeContainer}>
                {["student", "alumni"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.userTypeButton,
                      userType === type && styles.userTypeActive,
                    ]}
                    onPress={() => setUserType(type)}
                  >
                    <Text
                      style={[
                        styles.userTypeText,
                        userType === type &&
                        styles.userTypeTextActive,
                      ]}
                    >
                      {type === "student"
                        ? "Current Student"
                        : "Alumni"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Name */}
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Enter Name"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Enter Email"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  keyboardType="email-address"
                />
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Enter Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  style={styles.input}
                />
                <TouchableOpacity
                  onPress={() =>
                    setIsPasswordVisible(!isPasswordVisible)
                  }
                >
                  <Image
                    source={getImage(
                      isPasswordVisible ? "show" : "hide"
                    )}
                    style={styles.eye}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.signupButton}
                onPress={onSignupClick}
              >
                <Text style={styles.signupTextButton}>Sign Up</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.googleButton}
                onPress={onGoogleButtonPress}
              >
                <GoogleIcon />
                <Text style={styles.googleText}>
                  Sign up with Google
                </Text>
              </TouchableOpacity>

              {/* iOS Apple Button */}
              {Platform.OS === "ios" && (
                <AppleButton
                  buttonStyle={AppleButton.Style.BLACK}
                  buttonType={AppleButton.Type.SIGN_UP}
                  style={styles.appleButton}
                  onPress={onAppleButtonPress}
                />
              )}

              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>
                  Already have an account? Login
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignUp;

/* ================= Styles ================= */
const styles = StyleSheet.create({
  container: { flex: 1 },
  logoContainer: { alignItems: "center", marginTop: 40 },
  card: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: appColors.primaryColor,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    alignItems: "center",
    marginVertical: 10,
  },
  input: { flex: 1 },
  eye: { width: 24, height: 24 },

  userTypeLabel: {
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 8,
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

  signupButton: {
    backgroundColor: appColors.primaryColor,
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 20,
  },
  signupTextButton: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  googleButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  googleText: { marginLeft: 8 },
  appleButton: { width: "100%", height: 50, marginTop: 16 },
  loginLink: {
    marginTop: 20,
    textAlign: "center",
    color: appColors.primaryColor,
  },
});
