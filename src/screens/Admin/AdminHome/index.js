import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { appColors } from "../../../utils/color";

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
    padding:16,
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