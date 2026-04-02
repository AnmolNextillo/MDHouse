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
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackIcon from "../../../assets/svgs/BackIcon";
import { appColors } from "../../../utils/color";
import { useDispatch, useSelector } from "react-redux";
import { hitStudentDetials } from "../../../redux/GetStudentDetailsSlice";
import { useIsFocused } from "@react-navigation/native";
import Pdf from "react-native-pdf";
import ImagePicker from "react-native-image-crop-picker";
import DocumentPicker from "react-native-document-picker";
import { clearUploadFileData, uploadFile } from "../../../redux/uploadFile";
import { hitUpdateStudent } from "../../../redux/UpdateStudentSlice";
import { clearPrintStudentRecord, hitPrintStudentRecord } from "../../../redux/PrintStudentRecordSlice";

const { width, height } = Dimensions.get("window");

const StudentDetails = ({ navigation, route }) => {
  const {student, agentType } = route.params || {};

  const [ratios, setRatios] = useState({});
  const [studentData, setStudentData] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState({});
  const [showSheet, setShowSheet] = useState(false);

  const dispatch = useDispatch();
  const studentResponse = useSelector(
    (state) => state.studentDetailsReducer.data
  );

    const responseUpdateStudent = useSelector(
      (state) => state.updateStudentReducer.data
    );

    const responseUploadImage = useSelector(
      (state) => state.uploadFileReducer.data
    );
    const responsePrintStudentRecord = useSelector(
      (state) => state.printStudentRecordReducer.data
    );
  

  const isFocused = useIsFocused();

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (isFocused) {
      dispatch(hitStudentDetials({ studentId: student._id }));
    }
  }, [isFocused,responseUpdateStudent]);

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

    const handleOptionSelect = async (type, key) => {
    try {
      setShowSheet(false);

      let file;

      // CAMERA
      if (type === 1) {
        const res = await ImagePicker.openCamera({ cropping: false });
        file = {
          path: res.path,
          filename: res.filename || "image.jpg",
          mime: res.mime,
        };
      }

      // GALLERY
      if (type === 2) {
        const res = await ImagePicker.openPicker({ cropping: false });
        file = {
          path: res.path,
          filename: res.filename || "image.jpg",
          mime: res.mime,
        };
      }

      // DOCUMENT (FIXED)
      if (type === 3) {
        const res = await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.allFiles],
          copyTo: "cachesDirectory",
        });

        file = {
          path: res.fileCopyUri || res.uri,
          filename: res.name || "file",
          mime: res.type || "application/octet-stream",
        };
      }

      if (!file) return;

      // setUploadingKey(key);

      // FIX URI FOR IOS
      const fileUri =
        Platform.OS === "ios"
          ? file.path.replace("file://", "")
          : file.path;

      // IMAGE RATIO
      // if (file.mime?.includes("image")) {
      //   Image.getSize(file.path, (w, h) => {
      //     setImages((prev) => ({
      //       ...prev,
      //       ratios: { ...prev.ratios, [key]: w / h },
      //     }));
      //   });
      // }

      dispatch(
        uploadFile({
          uri: fileUri,
          fileName: file.filename,
          type: file.mime,
        })
      );
    } catch (e) {
      if (!DocumentPicker.isCancel(e)) {
        console.log("Picker Error:", e);
      }
      // setUploadingKey(null);
    }
  };

    /* ================= UPLOAD RESPONSE ================= */
  
    useEffect(() => {
      if (responseUploadImage ) {
        const payload = {
              studentId: studentData?._id,
              admissionLetterImage: responseUploadImage.Location,
              isAdmissionLetterUploaded:1,
              isAdmissionLetterReceived:1
            };

        dispatch(hitUpdateStudent(payload));
        dispatch(clearUploadFileData());
      }
    }, [responseUploadImage]);

    const onPrintClick = () => {
      // Implement print functionality here
      dispatch(hitPrintStudentRecord({ studentId: studentData?._id }));
    };


      /* ================= PRINT STUDENT RECORD RESPONSE ================= */

    useEffect(() => {
      if (responsePrintStudentRecord && responsePrintStudentRecord.status == 1) {
        // Handle the print data, e.g., navigate to a print preview screen or trigger native print dialog
        Linking.openURL(responsePrintStudentRecord.data);
        dispatch(clearPrintStudentRecord());
      }
    }, [responsePrintStudentRecord]);
  

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
        <TouchableOpacity
          style={styles.logoutButtonStyle}
          onPress={() => onPrintClick()}
        >
          <Text
            style={{
              color: appColors.white,
              textAlign: "center",
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            Print
          </Text>
        </TouchableOpacity>
        {agentType!=1 && 
          <TouchableOpacity
            style={styles.logoutButtonStyle}
            onPress={() => setShowSheet(true)}
          >
            <Text
              style={{
              color: appColors.white,
              textAlign: "center",
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            Upload Admission Letter
          </Text>
        </TouchableOpacity>}
      </ScrollView>

      {/* EDIT BUTTON */}
      {agentType == 1 && (
        <TouchableOpacity style={styles.fab} onPress={handleUpdate}>
          <Text style={styles.fabText}>✏️ Edit</Text>
        </TouchableOpacity>
      )}

   {showSheet && (
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.overlayBg}
            onPress={() => setShowSheet(false)}
          />

          <View style={styles.bottomSheet}>
            <Text style={styles.sheetTitle}>Upload From</Text>

            <View style={styles.optionContainer}>
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handleOptionSelect(1)}
              >
                <Text>📷 Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handleOptionSelect(2)}
              >
                <Text>🖼️ Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handleOptionSelect(3)}
              >
                <Text>📄 Document</Text>
              </TouchableOpacity>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowSheet(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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

  logoutButtonStyle: {
    backgroundColor: appColors.primaryColor,
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    marginHorizontal: 16,
  },

  fabText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  sheetOverlay: {
    position: "absolute",
    width: width,
    height: height,
    justifyContent: "flex-end",
  },

  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  sheetTitle: {
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "600",
  },

    optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  optionCard: {
    flex: 1,
    margin: 5,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
  marginTop: 15,
  paddingVertical: 12,
  borderTopWidth: 1,
  borderColor: "#eee",
  alignItems: "center",
},

cancelText: {
  fontSize: 16,
  fontWeight: "600",
  color: "red",
},

});