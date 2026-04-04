import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackIcon from "../../../assets/svgs/BackIcon";
import { appColors } from "../../../utils/color";
import {
  hitGetStudentDetails,
  clearGetStudentDetails,
} from "../../../redux/admin_apis/AdminStudentDetailSlice";
import {
  hitPrintStudentRecord,
  clearPrintStudentRecord,
} from "../../../redux/PrintStudentRecordSlice";
import {
  hitUpdateStudent,
  clearUpdateStudent,
} from "../../../redux/UpdateStudentSlice";

const { width, height } = Dimensions.get("window");

const AdminNewStudentDetails = ({ navigation, route }) => {
  const studentParam = route.params?.student;
  const [studentData, setStudentData] = useState(studentParam || null);
  const [ratios, setRatios] = useState({});
  const [loadingFiles, setLoadingFiles] = useState({});

  const dispatch = useDispatch();
  const { isLoading: isDetailsLoading, data: detailsData, error } = useSelector(
    (state) => state.adminGetStudentDetailsReducer
  );
  const { isLoading: isPrinting, data: printData } = useSelector(
    (state) => state.printStudentRecordReducer
  );
  const { isLoading: isUpdating, data: updateData } = useSelector(
    (state) => state.updateStudentReducer
  );

  useEffect(() => {
    // Use the student param data directly, same as list logic
    if (studentParam) {
      setStudentData(studentParam);
    }
    return () => {
      dispatch(clearGetStudentDetails());
      dispatch(clearPrintStudentRecord());
      dispatch(clearUpdateStudent());
    };
  }, [dispatch, studentParam]);

  useEffect(() => {
    if (detailsData?.data) {
      setStudentData(detailsData.data);
    } else if (studentParam && !isDetailsLoading) {
      // Fallback to param data if API fails
      setStudentData(studentParam);
    }
  }, [detailsData, studentParam, isDetailsLoading]);

  useEffect(() => {
    if (printData && printData.status == 1) {
      Linking.openURL(printData.data);
      dispatch(clearPrintStudentRecord());
    }
  }, [printData, dispatch]);

  useEffect(() => {
    if (updateData && updateData.status == 1) {
      Alert.alert("Success", "Student sent to university agent successfully");
      dispatch(clearUpdateStudent());
      // Optionally navigate back or refresh
    }
  }, [updateData, dispatch]);

  const handlePrint = () => {
    const studentId = studentData?._id || studentData?.studentId;
    if (studentId) {
      dispatch(hitPrintStudentRecord({ studentId }));
    }
  };

  const handleSendToUniversityAgent = () => {
    const studentId = studentData?._id || studentData?.studentId;
    if (studentId) {
      dispatch(hitUpdateStudent({
        studentId,
        isSentToUniversityForAdmissionLetter: 1
      }));
    }
  };

  /* ================= HELPERS ================= */

  const isPdf = (uri) => uri?.toLowerCase().includes(".pdf");

  const handleImageLoad = (uri, key) => {
    Image.getSize(
      uri,
      (width, height) => {
        const ratio = width / height;
        setRatios((prev) => ({ ...prev, [key]: ratio }));
      },
      () => { }
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

  const loading = isDetailsLoading;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={28} width={28} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>New Student Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {loading ? (
          <ActivityIndicator color={appColors.primaryColor} size="large" style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading student details: {error}</Text>
          </View>
        ) : studentData ? (
          <>
            {/* PROFILE */}
            <View style={styles.profileContainer}>
              {studentData?.profileImage ? (
                <Image
                  source={{ uri: studentData.profileImage }}
                  style={styles.profile}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Text style={styles.profilePlaceholderText}>
                    {studentData?.name ? studentData.name.charAt(0).toUpperCase() : "S"}
                  </Text>
                </View>
              )}
              <Text style={styles.name}>{studentData?.name}</Text>
              <Text style={styles.info}>
                +91 {studentData?.mobileNumber}
              </Text>
              <Text style={styles.info}>{studentData?.email}</Text>
            </View>

            {/* BASIC INFO */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Student ID:</Text>
                <Text style={styles.infoValue}>{studentData?._id || studentData?.studentId || "N/A"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{studentData?.name || "N/A"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{studentData?.email || "N/A"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mobile:</Text>
                <Text style={styles.infoValue}>{studentData?.mobileNumber || "N/A"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Agent ID:</Text>
                <Text style={styles.infoValue}>{studentData?.agentId || "N/A"}</Text>
              </View>
              {studentData?.university && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>University:</Text>
                  <Text style={styles.infoValue}>{studentData.university}</Text>
                </View>
              )}
            </View>

            {/* DOCUMENTS - Only show if available */}
            {(studentData?.plusTwoImage || studentData?.passportImageFront || studentData?.aadhaarImageFront || studentData?.neetImage) && (
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
                  studentData?.passportImageBack,
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
                {renderFile(
                  "Police Verification",
                  studentData?.studyPoliceVerificationImageBack,
                  "policeVerification"
                )}
                {renderFile(
                  "Admission Letter",
                  studentData?.admissionLetterImage,
                  "admissionLetter"
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.printButton}
              onPress={handlePrint}
              disabled={isPrinting}
            >
              <Text style={styles.printButtonText}>
                {isPrinting ? "Printing..." : "Print Student Record"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendToUniversityAgent}
              disabled={isUpdating}
            >
              <Text style={styles.sendButtonText}>
                {isUpdating ? "Sending..." : "Send To University Agent"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No student data available</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminNewStudentDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.white },
  header: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: appColors.primaryColor },
  headerText: { flex: 1, textAlign: "center", color: appColors.white, fontSize: 18, fontWeight: "700", marginRight: 30 },
  content: { padding: 16, paddingBottom: 40 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: appColors.red, fontSize: 16, textAlign: "center" },
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
  profilePlaceholder: {
    width: 120,
    height: 140,
    borderRadius: 10,
    backgroundColor: appColors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: appColors.grey,
  },
  profilePlaceholderText: {
    fontSize: 48,
    fontWeight: "bold",
    color: appColors.white,
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
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: "600",
    color: appColors.black,
    width: 100,
  },
  infoValue: {
    flex: 1,
    color: appColors.black,
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
  printButton: {
    backgroundColor: appColors.primaryColor,
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    alignItems: "center",
  },
  printButtonText: {
    color: appColors.white,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    alignItems: "center",
  },
  sendButtonText: {
    color: appColors.white,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});