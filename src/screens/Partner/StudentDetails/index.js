import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackIcon from "../../../assets/svgs/BackIcon";
import { appColors } from "../../../utils/color";
import { useDispatch, useSelector } from "react-redux";
import { hitStudentDetials } from "../../../redux/GetStudentDetailsSlice";
import { useIsFocused } from "@react-navigation/native";
import Pdf from "react-native-pdf";

const StudentDetails = ({ navigation, route }) => {
  const { student } = route.params || {};

  const [ratios, setRatios] = useState({});
  const [studentData, setStudentData] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState({});

  const dispatch = useDispatch();
  const studentResponse = useSelector(
    (state) => state.studentDetailsReducer.data
  );

  const isFocused = useIsFocused();

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (student && isFocused) {
      dispatch(hitStudentDetials({ studentId: student._id }));
    }
  }, [student, isFocused]);

  useEffect(() => {
    if (studentResponse && studentResponse.status === 1) {
      setStudentData(studentResponse.data);
    }
  }, [studentResponse]);

  /* ================= HELPERS ================= */

  const isPdf = (uri) => uri?.toLowerCase().includes(".pdf");

  const handleImageLoad = (uri, key) => {
    Image.getSize(
      uri,
      (width, height) => {
        const ratio = width / height;
        setRatios((prev) => ({ ...prev, [key]: ratio }));
      },
      () => {}
    );
  };

  /* ================= FILE RENDER ================= */

  const renderFile = (label, uri, key) => {
    if (!uri) return null;

    const ratio = ratios[key] || 1;

    return (
      <View style={styles.imageContainer}>
        <Text style={styles.label}>{label}</Text>

        {isPdf(uri) ? (
          <View style={styles.pdfContainer}>
            {loadingFiles[key] && (
              <ActivityIndicator
                size="small"
                color={appColors.primaryColor}
              />
            )}

            <Pdf
              source={{ uri }}
              style={styles.pdf}
              onLoadStart={() =>
                setLoadingFiles((p) => ({ ...p, [key]: true }))
              }
              onLoadComplete={() =>
                setLoadingFiles((p) => ({ ...p, [key]: false }))
              }
              onError={() =>
                setLoadingFiles((p) => ({ ...p, [key]: false }))
              }
            />

            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => Linking.openURL(uri)}
            >
              <Text style={styles.openText}>Open PDF</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Image
            source={{ uri }}
            style={[styles.image, { aspectRatio: ratio }]}
            resizeMode="contain"
            onLoad={() => handleImageLoad(uri, key)}
          />
        )}
      </View>
    );
  };

  /* ================= NAVIGATION ================= */

  const handleUpdate = () => {
    navigation.navigate("AddStudent", {
      student: studentData,
    });
  };

  /* ================= UI ================= */

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
            source={{ uri: studentData?.profileImage }}
            style={styles.profile}
          />
          <Text style={styles.name}>{studentData?.name}</Text>
          <Text style={styles.info}>
            +91 {studentData?.mobileNumber}
          </Text>
          <Text style={styles.info}>{studentData?.email}</Text>
        </View>

        {/* DOCUMENTS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Documents</Text>

          {renderFile(
            "10+2 Marksheet",
            studentData?.plusTwoImage,
            "plusTwo"
          )}
          {renderFile(
            "Passport Front",
            studentData?.passportImageFront,
            "passFront"
          )}
          {renderFile(
            "Passport Back",
            studentData?.passportBack,
            "passBack"
          )}
          {renderFile(
            "Aadhar Front",
            studentData?.aadhaarImageFront,
            "aadhaarFront"
          )}
          {renderFile(
            "Aadhar Back",
            studentData?.aadhaarImageBack,
            "aadhaarBack"
          )}
          {renderFile(
            "NEET Result",
            studentData?.neetImage,
            "neet"
          )}
        </View>
      </ScrollView>

      {/* EDIT BUTTON */}
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
    color: "#fff",
    fontSize: 16,
    marginRight: 32,
  },

  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  profile: {
    width: 120,
    height: 140,
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

  image: {
    width: "100%",
    borderRadius: 8,
  },

  pdfContainer: {
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },

  pdf: {
    flex: 1,
    width: "100%",
  },

  openBtn: {
    marginTop: 8,
    backgroundColor: appColors.primaryColor,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },

  openText: {
    color: "#fff",
    fontWeight: "600",
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
  },

  fabText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});