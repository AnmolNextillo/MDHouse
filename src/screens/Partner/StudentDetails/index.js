import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackIcon from "../../../assets/svgs/BackIcon";
import { appColors } from "../../../utils/color";

const StudentDetails = ({ navigation, route }) => {
  const { student } = route.params || {};

  const renderImage = (label, uri) => {
    if (!uri) return null;
    return (
      <View style={styles.imageContainer}>
        <Text style={styles.label}>{label}</Text>
        <Image source={{ uri }} style={styles.image} />
      </View>
    );
  };

  console.log("Student Details:", student);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Student Details</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* PROFILE */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: student?.profileImage }}
            style={styles.profile}
          />
          <Text style={styles.name}>{student?.name}</Text>
          <Text style={styles.info}>+91 {student?.mobileNumber}</Text>
          <Text style={styles.info}>{student?.email}</Text>
        </View>

        {/* BASIC INFO */}
        {/* <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic Info</Text>
          <Text style={styles.text}>PAN: {student?.pan}</Text>
        </View> */}

        {/* DOCUMENTS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Documents</Text>

          {/* {renderImage("PAN Card", student?.panCard)} */}
          {renderImage("10+2 Marksheet", student?.plusTwoImage)}
          {renderImage("Passport Front", student?.passportImageFront)}
          {renderImage("Passport Back", student?.passportBack)}
          {renderImage("Aadhar Front", student?.aadhaarImageFront)}
          {renderImage("Aadhar Back", student?.aadhaarImageBack)}
          {renderImage("NEET Result", student?.neetImage)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.white },

  header: {
    flexDirection: "row",
    backgroundColor: appColors.primaryColor,
    padding: 12,
    alignItems: "center",
  },

  headerText: {
    flex: 1,
    textAlign: "center",
    color: appColors.white,
    fontSize: 16,
    marginRight: 32,
  },

  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: appColors.black,
  },

  info: {
    color: appColors.grey,
  },

  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  text: {
    color: appColors.black,
  },

  imageContainer: {
    marginBottom: 12,
  },

  label: {
    marginBottom: 5,
    fontWeight: "500",
  },

  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
});
