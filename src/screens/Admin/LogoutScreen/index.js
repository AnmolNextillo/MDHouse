import { View, Text } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogoutScreen = ({ navigation }) => {

  useEffect(() => {
    handleLogout();
  }, []);

  const handleLogout = async () => {
    try {
      
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userType");
      await AsyncStorage.clear();

      navigation.reset({
        index: 0,
        routes: [{ name: "UserType" }],
      });

    } catch (error) {
      console.log("Logout error", error);
    }
  };

  return (
    <View>
      <Text>Logging out...</Text>
    </View>
  );
};

export default LogoutScreen;