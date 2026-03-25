import React, { useState } from "react";
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

  // 🔥 store dynamic ratios
  const [ratios, setRatios] = useState({});

  /* ================= IMAGE RATIO HANDLER ================= */
  const handleImageLoad = (uri, key) => {
    Image.getSize(
      uri,
      (width, height) => {
        const ratio = width / height;
        setRatios((prev) => ({ ...prev, [key]: ratio }));
      },
      () => {},
    );
  };

  /* ================= IMAGE RENDER ================= */
  const renderImage = (label, uri, key) => {
    if (!uri) return null;

    const ratio = ratios[key] || 1;

    return (
      <View style={styles.imageContainer}>
        <Text style={styles.label}>{label}</Text>

        <Image
          source={{ uri }}
          style={[styles.image, { aspectRatio: ratio }]}
          resizeMode="contain"
          onLoad={() => handleImageLoad(uri, key)}
        />
      </View>
    );
  };

  console.log("Student Details:", student);

  const handleUpdate = () => {
    navigation.navigate("AddStudent", {
      student: student,
    });
  };

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
        {/* PROFILE (PASSPORT STYLE) */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: student?.profileImage }}
            style={styles.profile}
            resizeMode="cover"
          />
          <Text style={styles.name}>{student?.name}</Text>
          <Text style={styles.info}>+91 {student?.mobileNumber}</Text>
          <Text style={styles.info}>{student?.email}</Text>
        </View>

        {/* DOCUMENTS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Documents</Text>

          {renderImage("10+2 Marksheet", student?.plusTwoImage, "plusTwo")}
          {renderImage(
            "Passport Front",
            student?.passportImageFront,
            "passFront",
          )}
          {renderImage("Passport Back", student?.passportBack, "passBack")}
          {renderImage(
            "Aadhar Front",
            student?.aadhaarImageFront,
            "aadhaarFront",
          )}
          {renderImage("Aadhar Back", student?.aadhaarImageBack, "aadhaarBack")}
          {renderImage("NEET Result", student?.neetImage, "neet")}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={handleUpdate}>
        <Text style={styles.fabText}>✏️ Edit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default StudentDetails;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },

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

  /* ✅ PASSPORT STYLE PROFILE */
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  profile: {
    width: 120,
    height: 140, // 🔥 passport ratio (slightly taller)
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: appColors.grey,
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

  imageContainer: {
    marginBottom: 16,
  },

  label: {
    marginBottom: 6,
    fontWeight: "500",
    color: appColors.black,
  },

  /* 🔥 DYNAMIC IMAGE FIX */
  image: {
    width: "100%",
    borderRadius: 8,
  },

  fab: {
    position: "absolute",
    bottom: 25,
    right: 20,
    backgroundColor: appColors.primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  fabText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
