import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { appColors } from "../../../utils/color";
import BackIcon from "../../../assets/svgs/BackIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import ImagePicker from "react-native-image-crop-picker";
import { pick } from "@react-native-documents/picker";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAgentAddStudent,
  hitAgentAddStudent,
} from "../../../redux/AgentAddStudentSlice";
import { clearUploadFileData, uploadFile } from "../../../redux/uploadFile";
import { clearUpdateStudent, hitUpdateStudent } from "../../../redux/UpdateStudentSlice";

const AddStudent = ({ navigation, route }) => {
  const dispatch = useDispatch();

  /* ================= STATES ================= */

  const { student } = route.params || {};
  const isEdit = !!student;

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [currentKey, setCurrentKey] = useState(null);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [showSheet, setShowSheet] = useState(false); // ✅ bottom sheet

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
    (state) => state.agentAddStudentReducer.data,
  );

  const responseUploadImage = useSelector(
    (state) => state.uploadFileReducer.data,
  );

  const responseUpdateStudent = useSelector(
  (state) => state.updateStudentReducer.data
);


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
    setShowSheet(true); // open sheet
  };

  const handleOptionSelect = async (type, key) => {
    try {
      setShowSheet(false);

      let file;

      if (type === 1) {
        file = await ImagePicker.openCamera({ cropping: false });
      }

      if (type === 2) {
        file = await ImagePicker.openPicker({ cropping: false });
      }

      if (type === 3) {
        const res = await pick({ type: ["*/*"] });

        file = {
          path: res[0].uri,
          filename: res[0].name,
          mime: res[0].type,
        };
      }

      if (!file) return;

      setUploadingKey(key);

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
          uri: file.path,
          fileName: file.filename || "file",
          type: file.mime,
        }),
      );
    } catch (e) {
      console.log("Picker Error:", e);
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
    id: student?._id, // 🔥 important for update
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
    dispatch(hitUpdateStudent(payload)); // 🔥 update API
  } else {
    dispatch(hitAgentAddStudent(payload)); // 🔥 add API
  }
};

  /* ================= RESPONSE ================= */

  useEffect(() => {
    if (responseAddStudent?.status === 1) {
      alert("Student added successfully.");
      dispatch(clearAgentAddStudent());
      navigation.goBack();
    }
  }, [responseAddStudent]);

  useEffect(() => {
  if (responseUpdateStudent?.status === 1) {
    alert("Student updated successfully.");
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
            images[key].includes(".pdf") ? (
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
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon width={32} height={32} fill="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Student</Text>
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
          <Text style={styles.btnText}>{isEdit ? "Update" : "Save"} Student</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 🔥 PREMIUM BOTTOM SHEET */}
      {showSheet && (
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.overlayBg}
            activeOpacity={1}
            onPress={() => setShowSheet(false)}
          />

          <View style={styles.bottomSheet}>
            <View style={styles.dragHandle} />
            <Text style={styles.sheetTitle}>Upload From</Text>

            <View style={styles.optionContainer}>
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handleOptionSelect(1, currentKey)}
              >
                <Text style={styles.icon}>📷</Text>
                <Text style={styles.optionText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handleOptionSelect(2, currentKey)}
              >
                <Text style={styles.icon}>🖼️</Text>
                <Text style={styles.optionText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handleOptionSelect(3, currentKey)}
              >
                <Text style={styles.icon}>📄</Text>
                <Text style={styles.optionText}>Document</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelBtn}
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

  /* 🔥 Bottom Sheet Styles */

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
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },

  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },

  sheetTitle: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 15,
  },

  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  optionCard: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  icon: { fontSize: 24 },

  optionText: { marginTop: 5 },

  cancelBtn: {
    marginTop: 15,
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  cancelText: {
    color: "red",
    fontWeight: "600",
  },
});
