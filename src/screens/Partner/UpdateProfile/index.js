import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { appColors } from "../../../utils/color";
import BackIcon from "../../../assets/svgs/BackIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import ImagePicker from "react-native-image-crop-picker";
import * as DocumentPicker from "react-native-document-picker";
import { useDispatch, useSelector } from "react-redux";

import {
  clearUpdateProfile,
  hitUpdateProfile,
} from "../../../redux/AgentUpdateProfileSlice";

import { clearUploadFileData, uploadFile } from "../../../redux/uploadFile";
import { clearGetProfile, hitGetProfile } from "../../../redux/GetProfileSlice";

const { width, height } = Dimensions.get("window");

const UpdateProfile = ({ navigation }) => {
  const dispatch = useDispatch();

  /* ================= STATES ================= */

  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [showSheet, setShowSheet] = useState(false);
  const [currentKey, setCurrentKey] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // ✅ FIX

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [mobile, setMobile] = useState("");

  const [images, setImages] = useState({
    panImage: null,
    aadhaarFront: null,
    aadhaarBack: null,
    ratios: {},
    types: {},
  });

  /* ================= REDUX ================= */

  const responseUpdateProfile = useSelector(
    (state) => state.agentUpdateProfileReducer.data
  );

  const responseUploadImage = useSelector(
    (state) => state.uploadFileReducer.data
  );

  const responseGetProfile = useSelector(
    (state) => state.getProfileReducer.data
  );

  /* ================= GET PROFILE ================= */

  useEffect(() => {
    dispatch(hitGetProfile());
  }, []);

  useEffect(() => {
    if (responseGetProfile) {
      if (responseGetProfile.status === 1) {
        const data = responseGetProfile.data;

        setName(data.name || "");
        setCompanyName(data.companyName || "");
        setMobile(data.mobileNumber || "");

        setImages({
          panImage: data.panCardImage || null,
          aadhaarFront: data.aadhaarImageFront || null,
          aadhaarBack: data.aadhaarImageBack || null,
          ratios: {},
          types: {},
        });
      }

      setLoading(false);
      dispatch(clearGetProfile());
    }
  }, [responseGetProfile]);

  /* ================= PICK OPTIONS ================= */

  const showPickerOptions = (key) => {
    setCurrentKey(key);
    setShowSheet(true);
  };

  const handlePick = async (type, key) => {
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
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.pdf],
        });

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
          fileName: file.filename || `file_${Date.now()}`,
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
        types: {
          ...prev.types,
          [currentKey]: responseUploadImage.ContentType || "",
        },
      }));

      setUploadingKey(null);
      dispatch(clearUploadFileData());
    }
  }, [responseUploadImage]);

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    if (
      !name ||
      !mobile ||
      !images.panImage ||
      !images.aadhaarFront ||
      !images.aadhaarBack
    ) {
      alert("Please fill required fields");
      return;
    }

    setSubmitting(true);
    setIsUpdating(true); // ✅ IMPORTANT

    dispatch(
      hitUpdateProfile({
        name,
        companyName,
        mobileNumber: mobile,
        panCardImage: images.panImage,
        aadhaarImageFront: images.aadhaarFront,
        aadhaarImageBack: images.aadhaarBack,
      })
    );
  };

  /* ================= RESPONSE ================= */

  useEffect(() => {
    if (responseUpdateProfile && isUpdating) {
      setSubmitting(false);
      setIsUpdating(false);

      if (responseUpdateProfile.status === 1) {
        alert("Profile Updated Successfully");
        navigation.goBack(); // ✅ only when user updates
      } else {
        alert(responseUpdateProfile.message || "Something went wrong");
      }

      dispatch(clearUpdateProfile());
    }
  }, [responseUpdateProfile]);

  /* ================= RENDER ================= */

  const renderImage = (label, keyName) => {
    const ratio = images.ratios[keyName] || 1;
    const isUploading = uploadingKey === keyName;
    const type = images.types?.[keyName] || "";

    return (
      <>
        <Text style={styles.label}>{label}</Text>

        <TouchableOpacity
          style={styles.imageBox}
          onPress={() => showPickerOptions(keyName)}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="large" color={appColors.primaryColor} />
          ) : images[keyName] ? (
            type.includes("pdf") ? (
              <Text style={{ fontSize: 16 }}>📄 PDF Uploaded</Text>
            ) : (
              <Image
                source={{ uri: images[keyName] }}
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

  /* ================= UI ================= */

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={appColors.primaryColor} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon width={32} height={32} fill="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Update Profile</Text>
      </View>

      <ScrollView>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
        <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} placeholder="Company Name" />
        <TextInput style={styles.input} value={mobile} onChangeText={setMobile} placeholder="Mobile" />

        {renderImage("PAN Card", "panImage")}
        {renderImage("Aadhaar Front", "aadhaarFront")}
        {renderImage("Aadhaar Back", "aadhaarBack")}

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {showSheet && (
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.overlayBg} onPress={() => setShowSheet(false)} />

          <View style={styles.bottomSheet}>
            <View style={styles.dragHandle} />
            <Text style={styles.sheetTitle}>Choose Upload Option</Text>

            <View style={styles.optionContainer}>
              <TouchableOpacity style={styles.optionCard} onPress={() => handlePick(1, currentKey)}>
                <Text style={styles.icon}>📷</Text>
                <Text style={styles.optionText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionCard} onPress={() => handlePick(2, currentKey)}>
                <Text style={styles.icon}>🖼️</Text>
                <Text style={styles.optionText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionCard} onPress={() => handlePick(3, currentKey)}>
                <Text style={styles.icon}>📄</Text>
                <Text style={styles.optionText}>PDF</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowSheet(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default UpdateProfile;
/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },

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
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },

  label: {
    marginLeft: 10,
    marginTop: 10,
    fontWeight: "500",
  },

  imageBox: {
    borderWidth: 1,
    margin: 10,
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
  },

  image: { width: "100%" },

  button: {
    backgroundColor: appColors.primaryColor,
    margin: 20,
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },

  buttonText: { color: "#fff", fontWeight: "600" },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  sheetOverlay: {
    position: "absolute",
    width,
    height,
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
    paddingBottom: 40,
    paddingHorizontal: 20,
  },

  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginVertical: 10,
  },

  sheetTitle: {
    textAlign: "center",
    fontSize: 16,
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
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
  },

  icon: { fontSize: 26, marginBottom: 6 },

  optionText: { fontSize: 13, fontWeight: "500" },

  cancelBtn: {
    marginTop: 20,
    backgroundColor: "#f1f1f1",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  cancelText: {
    color: "red",
    fontWeight: "600",
    fontSize: 15,
  },
});