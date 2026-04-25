import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import { appColors } from "../../utils/color";
import BackIcon from "../../assets/svgs/BackIcon";
import { useDispatch, useSelector } from "react-redux";
import { hitChangePassword } from "../../redux/ChangePasswordSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangePasswordScreen = ({ navigation, route }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { from } = route.params || {};

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const responseChangePassword = useSelector(
    (state) => state.changePasswordReducer.data,
  );

  // ✅ Validation
  const validate = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("All fields are required");
      return false;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return false;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    return true;
  };

  // ✅ API CALL
  const handleChangePassword = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      // 🔁 Replace with your API
      const payload = {
        oldPassword,
        newPassword,
      };
      dispatch(hitChangePassword(payload, from));
    } catch (error) {
      console.log(error);
      Alert.alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (responseChangePassword && responseChangePassword.status === 1) {
      Alert.alert(
        "The MD House",
        "Password changed successfully. Please login again.",
        [
          {
            text: "OK",
            onPress: () => {
              clearData();
            },
          },
        ],
      );
    }
  }, [responseChangePassword]);

  const clearData = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userType");
    await AsyncStorage.clear(); // Clear AsyncStorage on app launch to prevent stale data issues
    navigation.reset({
      index: 0,
      routes: [{ name: "UserType" }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Change Password</Text>
      </View>

      {/* OLD PASSWORD */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Old Password"
          secureTextEntry={!showOld}
          value={oldPassword}
          onChangeText={setOldPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowOld(!showOld)}>
          <Text style={styles.toggle}>{showOld ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>

      {/* NEW PASSWORD */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="New Password"
          secureTextEntry={!showNew}
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowNew(!showNew)}>
          <Text style={styles.toggle}>{showNew ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>

      {/* CONFIRM PASSWORD */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={!showConfirm}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Text style={styles.toggle}>{showConfirm ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleChangePassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Password</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: appColors.primaryColor,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: appColors.lightGray,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 16,
    marginHorizontal: 16,
  },
  input: {
    flex: 1,
    height: 50,
  },
  toggle: {
    color: appColors.primaryColor,
    fontWeight: "600",
  },
  button: {
    backgroundColor: appColors.primaryColor,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16,
  },
  buttonText: {
    color: appColors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  headerStyle: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: appColors.primaryColor,
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
    color: appColors.white,
    textAlign: "center",
    flex: 1,
  },
});
