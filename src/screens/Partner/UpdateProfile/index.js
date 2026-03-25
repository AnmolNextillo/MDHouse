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
  clearUpdateProfile,
  hitUpdateProfile,
} from "../../../redux/AgentUpdateProfileSlice";

import { clearUploadFileData, uploadFile } from "../../../redux/uploadFile";

import { clearGetProfile, hitGetProfile } from "../../../redux/GetProfileSlice";

const UpdateProfile = ({ navigation }) => {
  const dispatch = useDispatch();

  /* ================= STATES ================= */

  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [showSheet, setShowSheet] = useState(false);
  const [currentKey, setCurrentKey] = useState(null);

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [mobile, setMobile] = useState("");
  const [officeContact, setOfficeContact] = useState("");
  const [address, setAddress] = useState("");
  const [gst, setGst] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [pan, setPan] = useState("");

  const [images, setImages] = useState({
    panImage: null,
    aadhaarFront: null,
    aadhaarBack: null,
    ratios: {},
  });

  /* ================= REDUX ================= */

  const responseUpdateProfile = useSelector(
    (state) => state.agentUpdateProfileReducer.data,
  );

  const responseUploadImage = useSelector(
    (state) => state.uploadFileReducer.data,
  );

  const responseGetProfile = useSelector(
    (state) => state.getProfileReducer.data,
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
        setOfficeContact(data.officeNumber || "");
        setAddress(data.headOfficeAddress || "");
        setGst(data.gst || "");
        setAadhaar(data.adhaarNumber || "");
        setPan(data.panCard || "");

        setImages({
          panImage: data.panCardImage || null,
          aadhaarFront: data.aadhaarImageFront || null,
          aadhaarBack: data.aadhaarImageBack || null,
          ratios: {},
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

    dispatch(
      hitUpdateProfile({
        name,
        companyName,
        mobileNumber: mobile,
        officeNumber: officeContact,
        headOfficeAddress: address,
        gst,
        adhaarNumber: aadhaar,
        panCard: pan,
        panCardImage: images.panImage,
        aadhaarImageFront: images.aadhaarFront,
        aadhaarImageBack: images.aadhaarBack,
      }),
    );
  };

  /* ================= RESPONSE ================= */

  useEffect(() => {
    if (responseUpdateProfile) {
      if (responseUpdateProfile.status === 1) {
        alert("Profile Updated Successfully");
        navigation.goBack();
      }
      dispatch(clearUpdateProfile());
    }
  }, [responseUpdateProfile]);

  /* ================= IMAGE ================= */

  const renderImage = (label, keyName) => {
    const ratio = images.ratios[keyName] || 1;
    const isUploading = uploadingKey === keyName;

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
            images[keyName].includes(".pdf") ? (
              <Text>📄 {images[keyName].split("/").pop()}</Text>
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
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon width={32} height={32} fill="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Update Profile</Text>
      </View>

      <ScrollView>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
        />
        <TextInput
          style={styles.input}
          value={companyName}
          onChangeText={setCompanyName}
          placeholder="Company Name"
        />
        <TextInput
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
          placeholder="Mobile"
        />
        <TextInput
          style={styles.input}
          value={officeContact}
          onChangeText={setOfficeContact}
          placeholder="Office Contact"
        />
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Address"
        />
        <TextInput
          style={styles.input}
          value={gst}
          onChangeText={setGst}
          placeholder="GST"
        />
        <TextInput
          style={styles.input}
          value={aadhaar}
          onChangeText={setAadhaar}
          placeholder="Aadhaar"
        />
        <TextInput
          style={styles.input}
          value={pan}
          onChangeText={setPan}
          placeholder="PAN"
        />

        {renderImage("PAN Card", "panImage")}
        {renderImage("Aadhaar Front", "aadhaarFront")}
        {renderImage("Aadhaar Back", "aadhaarBack")}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ================= BOTTOM SHEET ================= */}
      {showSheet && (
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.overlayBg}
            activeOpacity={1}
            onPress={() => setShowSheet(false)}
          />

          <View style={styles.bottomSheet}>
            {/* Drag Indicator */}
            <View style={styles.dragHandle} />

            <Text style={styles.sheetTitle}>Choose Upload Option</Text>

            <View style={styles.optionContainer}>
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handlePick(1, currentKey)}
              >
                <Text style={styles.icon}>📷</Text>
                <Text style={styles.optionText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handlePick(2, currentKey)}
              >
                <Text style={styles.icon}>🖼️</Text>
                <Text style={styles.optionText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => handlePick(3, currentKey)}
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

export default UpdateProfile;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    backgroundColor: appColors.primaryColor,
    padding: 12,
  },
  headerText: { flex: 1, textAlign: "center", color: "#fff" },

  input: {
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },

  label: { marginLeft: 10, marginTop: 10 },

  imageBox: {
    borderWidth: 1,
    margin: 10,
    padding: 10,
    alignItems: "center",
  },

  image: { width: "100%" },

  button: {
    backgroundColor: appColors.primaryColor,
    margin: 20,
    padding: 15,
    alignItems: "center",
  },

  buttonText: { color: "#fff" },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
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
    paddingBottom: 25,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
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
    color: "#333",
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

  icon: {
    fontSize: 26,
    marginBottom: 6,
  },

  optionText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },

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
