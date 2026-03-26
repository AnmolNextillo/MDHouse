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
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { appColors } from "../../../utils/color";
import BackIcon from "../../../assets/svgs/BackIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import ImagePicker from "react-native-image-crop-picker";
import * as DocumentPicker from "react-native-document-picker";
import { useDispatch, useSelector } from "react-redux";
import Pdf from "react-native-pdf";
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

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [mobile, setMobile] = useState("");

  const [images, setImages] = useState({
    panImage: null,
    aadhaarFront: null,
    aadhaarBack: null,
  });

  const [ratios, setRatios] = useState({});
  const [types, setTypes] = useState({});
  const [loadingFiles, setLoadingFiles] = useState({});

  /* ================= HELPERS ================= */

  const isPdf = (uri) => uri?.toLowerCase().includes(".pdf");

  const handleImageLoad = (uri, key) => {
    Image.getSize(uri, (w, h) => {
      setRatios((prev) => ({ ...prev, [key]: w / h }));
    });
  };

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
        });
      }

      setLoading(false);
      dispatch(clearGetProfile());
    }
  }, [responseGetProfile]);

  /* ================= PICK ================= */

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

      dispatch(
        uploadFile({
          uri: file.path,
          fileName: file.filename || `file_${Date.now()}`,
          type: file.mime,
        })
      );
    } catch (e) {
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

      setTypes((prev) => ({
        ...prev,
        [currentKey]: responseUploadImage.ContentType || "",
      }));

      setUploadingKey(null);
      dispatch(clearUploadFileData());
    }
  }, [responseUploadImage]);

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    if (!name || !mobile || !images.panImage) {
      alert("Please fill required fields");
      return;
    }

    setSubmitting(true);

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

  useEffect(() => {
    if (responseUpdateProfile) {
      setSubmitting(false);

      if (responseUpdateProfile.status === 1) {
        alert("Profile Updated Successfully");
        dispatch(clearUpdateProfile());
        navigation.goBack();
      }
    }
  }, [responseUpdateProfile]);

  /* ================= RENDER FILE ================= */

  const renderFile = (label, uri, key) => {
    if (!uri) {
      return (
        <>
          <Text style={styles.label}>{label}</Text>
          <TouchableOpacity
            style={styles.imageBox}
            onPress={() => showPickerOptions(key)}
          >
            <Text>Select Image / PDF</Text>
          </TouchableOpacity>
        </>
      );
    }

    const ratio = ratios[key] || 1;

    return (
      <View style={styles.imageContainer}>
        <Text style={styles.label}>{label}</Text>

        <TouchableOpacity onPress={() => showPickerOptions(key)}>
          {isPdf(uri) ? (
            <View style={styles.pdfContainer}>
              {loadingFiles[key] && <ActivityIndicator />}

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
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity
                  style={styles.openBtn}
                  onPress={() => Linking.openURL(uri)}
                >
                  <Text style={styles.openText}>Open PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.changeBtn}
                  onPress={() => showPickerOptions(key)}
                >
                  <Text style={styles.openText}>Change</Text>
                </TouchableOpacity>
              </View>


            </View>
          ) : (
            <View style={styles.imageBox}>
              <Image
                source={{ uri }}
                style={[styles.image, { aspectRatio: ratio }]}
                resizeMode="contain"
                onLoad={() => handleImageLoad(uri, key)}
              />
              <TouchableOpacity
                style={styles.changeBtn}
                onPress={() => showPickerOptions(key)}
              >
                <Text style={styles.openText}>Change</Text>
              </TouchableOpacity>
            </View>

          )}
        </TouchableOpacity>
      </View>
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

        {renderFile("PAN Card", images.panImage, "panImage")}
        {renderFile("Aadhaar Front", images.aadhaarFront, "aadhaarFront")}
        {renderFile("Aadhaar Back", images.aadhaarBack, "aadhaarBack")}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Profile</Text>}
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
  },

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
    padding: 15,
    borderRadius: 8,
  },

  imageContainer: { marginBottom: 10 },

  image: { width: "100%" },

  pdfContainer: {
    height: 300,
    margin: 10,
  },

  pdf: {
    flex: 1,
    width: "100%",
  },

  openBtn: {
    flex: 1,
    marginTop: 10,
    backgroundColor: appColors.primaryColor,
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 10,
    alignItems: "center",
  },
  changeBtn: {
    flex: 1,
    marginTop: 10,
    backgroundColor: appColors.black,
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 10,
    alignItems: "center",
  },

  openText: { color: "#fff" },

  button: {
    backgroundColor: appColors.primaryColor,
    margin: 20,
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },

  buttonText: { color: "#fff" },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
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
    paddingVertical: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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