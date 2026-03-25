import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { appColors } from "../../../utils/color";
import BackIcon from "../../../assets/svgs/BackIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import ImagePicker from "react-native-image-crop-picker";
import DocumentPicker from "react-native-document-picker";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAgentAddStudent,
  hitAgentAddStudent,
} from "../../../redux/AgentAddStudentSlice";
import {
  clearUploadFileData,
  uploadFile,
} from "../../../redux/uploadFile";
import {
  clearUpdateStudent,
  hitUpdateStudent,
} from "../../../redux/UpdateStudentSlice";

const AddStudent = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const { student } = route.params || {};
  const isEdit = !!student;

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [currentKey, setCurrentKey] = useState(null);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [showSheet, setShowSheet] = useState(false);

  const [images, setImages] = useState({
    profile: "",
    pan: "",
    marksheet: "",
    passportFront: "",
    passportBack: "",
    aadhaarFront: "",
    aadhaarBack: "",
    neet: "",
    ratios: {},
  });

  /* ================= REDUX ================= */

  const responseAddStudent = useSelector(
    (state) => state.agentAddStudentReducer.data
  );

  const responseUploadImage = useSelector(
    (state) => state.uploadFileReducer.data
  );

  const responseUpdateStudent = useSelector(
    (state) => state.updateStudentReducer.data
  );

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (isEdit && student) {
      setForm({
        name: student.name || "",
        email: student.email || "",
        mobile: student.mobileNumber || "",
      });

      setImages({
        profile: student.profileImage || "",
        pan: student.panImage || "",
        marksheet: student.plusTwoImage || "",
        passportFront: student.passportImageFront || "",
        passportBack: student.passportImageBack || "",
        aadhaarFront: student.aadhaarImageFront || "",
        aadhaarBack: student.aadhaarImageBack || "",
        neet: student.neetImage || "",
        ratios: {},
      });
    }
  }, [student]);

  /* ================= INPUT ================= */

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  /* ================= PICK OPTIONS ================= */

  const showPickerOptions = (key) => {
    setCurrentKey(key);
    setShowSheet(true);
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

      setUploadingKey(key);

      // FIX URI FOR IOS
      const fileUri =
        Platform.OS === "ios"
          ? file.path.replace("file://", "")
          : file.path;

      // IMAGE RATIO
      if (file.mime?.includes("image")) {
        Image.getSize(file.path, (w, h) => {
          setImages((prev) => ({
            ...prev,
            ratios: { ...prev.ratios, [key]: w / h },
          }));
        });
      }

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
      setUploadingKey(null);
    }
  };

  /* ================= UPLOAD RESPONSE ================= */

  useEffect(() => {
    if (responseUploadImage && currentKey) {
      setImages((prev) => ({
        ...prev,
        [currentKey]: responseUploadImage.Location,
      }));

      setUploadingKey(null);
      dispatch(clearUploadFileData());
    }
  }, [responseUploadImage]);

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    if (!form.name || !form.mobile || !form.email || !images.profile) {
      alert("Name, Mobile, Email and Profile required");
      return;
    }

    const payload = {
      id: student?._id,
      name: form.name,
      email: form.email,
      mobileNumber: form.mobile,
      profileImage: images.profile,
      aadhaarImageBack: images.aadhaarBack,
      aadhaarImageFront: images.aadhaarFront,
      plusTwoImage: images.marksheet,
      passportImageBack: images.passportBack,
      passportImageFront: images.passportFront,
      neetImage: images.neet,
    };

    if (isEdit) {
      dispatch(hitUpdateStudent(payload));
    } else {
      dispatch(hitAgentAddStudent(payload));
    }
  };

  /* ================= RESPONSE ================= */

  useEffect(() => {
    if (responseAddStudent?.status === 1) {
      alert("Student added successfully");
      dispatch(clearAgentAddStudent());
      navigation.goBack();
    }
  }, [responseAddStudent]);

  useEffect(() => {
    if (responseUpdateStudent?.status === 1) {
      alert("Student updated successfully");
      dispatch(clearUpdateStudent());
      navigation.goBack();
    }
  }, [responseUpdateStudent]);

  /* ================= UI ================= */

  const renderInput = (label, key, keyboard = "default") => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        <TextInput
          value={form[key]}
          onChangeText={(t) => handleChange(key, t)}
          style={styles.input}
          keyboardType={keyboard}
          placeholder={`Enter ${label}`}
        />
      </View>
    </>
  );

  const renderImage = (label, key) => {
    const ratio = images.ratios[key] || 1;
    const isUploading = uploadingKey === key;

    return (
      <>
        <Text style={styles.label}>{label}</Text>

        <TouchableOpacity
          style={styles.imageBox}
          onPress={() => showPickerOptions(key)}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="large" color={appColors.primaryColor} />
          ) : images[key] ? (
            images[key]?.toLowerCase().includes(".pdf") ? (
              <Text style={{ color: appColors.primaryColor }}>
                📄 {images[key].split("/").pop()}
              </Text>
            ) : (
              <Image
                source={{ uri: images[key] }}
                style={[styles.image, { aspectRatio: ratio }]}
              />
            )
          ) : (
            <Text>Select Image / Document</Text>
          )}
        </TouchableOpacity>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon width={32} height={32} fill="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {isEdit ? "Update Student" : "Add Student"}
        </Text>
      </View>

      <ScrollView>
        {renderInput("Name", "name")}
        {renderInput("Email", "email", "email-address")}
        {renderInput("Mobile Number", "mobile", "phone-pad")}

        {renderImage("Profile Image", "profile")}
        {renderImage("PAN Card", "pan")}
        {renderImage("10 / +2 Marksheet", "marksheet")}
        {renderImage("Passport Front", "passportFront")}
        {renderImage("Passport Back", "passportBack")}
        {renderImage("Aadhaar Front", "aadhaarFront")}
        {renderImage("Aadhaar Back", "aadhaarBack")}
        {renderImage("NEET Result", "neet")}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.btnText}>
            {isEdit ? "Update" : "Save"} Student
          </Text>
        </TouchableOpacity>
      </ScrollView>

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
                onPress={() => handleOptionSelect(1, currentKey)}
              >
                <Text>📷 Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handleOptionSelect(2, currentKey)}
              >
                <Text>🖼️ Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handleOptionSelect(3, currentKey)}
              >
                <Text>📄 Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AddStudent;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

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
    marginRight: 32,
  },

  label: {
    marginHorizontal: 16,
    marginTop: 16,
    fontWeight: "600",
  },

  inputBox: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginTop: 8,
    paddingHorizontal: 10,
    height: 45,
    justifyContent: "center",
  },

  input: { color: "#000" },

  imageBox: {
    width: "90%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    marginTop: 8,
    padding: 12,
    alignItems: "center",
  },

  image: { width: "100%" },

  button: {
    backgroundColor: appColors.primaryColor,
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  btnText: { color: "#fff", fontWeight: "600" },

  sheetOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
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
});