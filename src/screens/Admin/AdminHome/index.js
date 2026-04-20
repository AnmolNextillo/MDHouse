import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  Alert,
  Linking,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { appColors } from "../../../utils/color";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import DeviceInfo from "react-native-device-info";
import { hitVersionApi } from "../../../redux/GetVersionSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const menuItems = [
  { id: "1", title: "Agents", screen: "AdminAgents" },
  { id: "2", title: "Students", screen: "AdminStudents" },
  { id: "3", title: "Alumni Students", screen: "AdminAlumni" },
  { id: "4", title: "New Students", screen: "AdminNewStudents" },
  { id: "5", title: "Announcements", screen: "AdminAnnouncements" },
  { id: "6", title: "Gallery", screen: "AdminGallery" },
  { id: "7", title: "Banners", screen: "AdminBanners" },
  { id: "8", title: "Universities", screen: "AdminUniversities" },
  { id: "9", title: "Courses", screen: "AdminCourses" },
  { id: "10", title: "Settings", screen: "AdminSettings" },
];

const AdminHome = ({ navigation }) => {


  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const responseVersion = useSelector((state) => state.getVersionReducer.data);

  useEffect(() => {
    if (isFocused) {
      dispatch(hitVersionApi());
    }
  }, [isFocused]);

  useEffect(() => {
    console.log("responseAppVersion response ===>", responseVersion);
    if (responseVersion != null && responseVersion.status === 1) {
      checkForUpdates();
    }
  }, [responseVersion]);

  const checkForUpdates = async () => {
    try {
      const currentVersion = DeviceInfo.getVersion();

      console.log("CurrentVersion ===> ", currentVersion);
      const latestVersion =
        Platform.OS === "android"
          ? responseVersion.data.android
          : responseVersion.data.ios;
      const updateUrl =
        Platform.OS === "android"
          ? "https://play.google.com/store/apps/details?id=com.mdhouseapp"
          : "https://apps.apple.com/in/app/mdhouse/id6749562016";

      console.log("latestVersion ===> ", latestVersion);
      if (currentVersion < latestVersion) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userType");
      await AsyncStorage.clear();
       
        navigation.reset({
          index: 0,
          routes: [{ name: "UserType" }],
        });
        Alert.alert(
          "Update Available",
          `A new version (${latestVersion}) is available. Please update to continue.`,
          [
            { text: "Update Now", onPress: () => Linking.openURL(updateUrl) },
            //  { text: "Later", style: "cancel" },
          ].filter(Boolean)
        );
      }
    } catch (error) {
      console.log("Error checking for updates:", error);
    }
  };


  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          console.log(item.title);
          navigation.navigate(item.screen);
        }}
      >
        <LinearGradient
          colors={[appColors.primaryColor, "#6a85f1"]}
          style={styles.gradient}
        >
          <Text style={styles.cardText}>{item.title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>

      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 70 }}
      />
    </SafeAreaView>
  );
};

export default AdminHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FB",
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  header: {
    fontSize: 24,
    fontWeight: "700",
    padding: 16,
    color: appColors.white,
    backgroundColor: appColors.primaryColor,
    textAlign: "center",
  },

  card: {
    flex: 1,
    margin: 10,
    borderRadius: 14,
    overflow: "hidden",
    elevation: 5,
  },

  gradient: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },

  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});