import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import ImagePicker from "react-native-image-crop-picker";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackIcon from "../../assets/svgs/BackIcon";
import { appColors } from "../../utils/color";
import DocumentPickerModal from "../../components/DocumentPickerModal";
import { requestAllPermissions } from "../../utils/constants";
import { clearUploadFileData, uploadFile } from "../../redux/uploadFile";
import { clearUpdateProfile, hitUpdateProfile } from "../../redux/UpdateProfileSlice";

const DocumentUpload = ({ navigation, route }) => {
  const dispatch = useDispatch();

  /** ================= STATES ================= */
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const [passportFrontUrl, setPassportFrontUrl] = useState(null);
  const [passportBackUrl, setPassportBackUrl] = useState(null);
  const [degreeUrl, setDegreeUrl] = useState(null);

  const responseUploadImage = useSelector(
    (state) => state.uploadFileReducer.data
  );

  const responseProfileData = useSelector(
      (state) => state.getProfileReducer.data
    );

  const responseUpdateProfile = useSelector(
    (state) => state.updateProfileReducer.data
  );

  /** ================= PERMISSIONS ================= */
  const openModal = async () => {
    const granted = await requestAllPermissions();
    if (granted) {
      setModalVisible(true);
    } else {
      Alert.alert(
        "Permission Required",
        "Please enable camera and storage permissions from settings",
        [{ text: "Open Settings", onPress: () => Linking.openSettings() }]
      );
    }
  };

  /** ================= CAMERA / GALLERY ================= */
  const openCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      freeStyleCropEnabled: true,
    })
      .then((image) => {
        dispatch(
          uploadFile({
            uri: image.path,
            fileName: image.filename || `camera_${Date.now()}.jpg`,
            type: image.mime,
          })
        );
      })
      .catch(() => setModalVisible(false));
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      cropping: true,
      freeStyleCropEnabled: true,
    })
      .then((image) => {
        dispatch(
          uploadFile({
            uri: image.path,
            fileName: image.filename || `gallery_${Date.now()}.jpg`,
            type: image.mime,
          })
        );
      })
      .catch(() => setModalVisible(false));
  };

  /** ================= UPLOAD RESPONSE ================= */
  useEffect(() => {
    if (responseUploadImage) {
        console.log("responseUploadImage ===> ",responseUploadImage)
      if (selectedImage === 1)
        setPassportFrontUrl(responseUploadImage.Location);
      if (selectedImage === 2)
        setPassportBackUrl(responseUploadImage.Location);
      if (selectedImage === 3) setDegreeUrl(responseUploadImage.Location);

      setModalVisible(false);
      dispatch(clearUploadFileData());
    }
  }, [responseUploadImage]);

  /** ================= SUBMIT ================= */
  const onUploadClick = async () => {
    if (!passportFrontUrl || !passportBackUrl || !degreeUrl) {
      Alert.alert("MD House", "Please upload all required documents");
      return;
    }
    const payload = {
      passportImageFront: passportFrontUrl,
      passportImageBack: passportBackUrl,
      degreeCertificateImage: degreeUrl,
    };

    dispatch(hitUpdateProfile(payload));
    navigation.goBack();
  };

  /** ================= RESPONSE ================= */
  useEffect(() => {
    console.log("responseUpdateProfile ===> ",responseUpdateProfile)
    if (responseUpdateProfile?.status === 1) {
        // navigation.goBack()
    } else if (responseUpdateProfile) {
      Alert.alert("MD House", responseUpdateProfile.message);
    }
    dispatch(clearUpdateProfile());
  }, [responseUpdateProfile]);


    useEffect(() => {
      console.log("responseProfileData ===> ", responseProfileData);
      if (responseProfileData != null && responseProfileData.status == 1) {
        if (responseProfileData.data.passportImageFront != "") {
          setPassportFrontUrl(responseProfileData.data.passportImageFront);
        }
        if (responseProfileData.data.passportImageBack != "") {
          setPassportBackUrl(
           responseProfileData.data.passportImageBack
          );
        }   
        if (responseProfileData.data.degreeCertificateImage != "") {
          setDegreeUrl(responseProfileData.data.degreeCertificateImage);
        }
      }
    }, [responseProfileData]);

  /** ================= UI ================= */
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Upload Documents</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        {/* Passport Front */}
        <Text style={styles.label}>Passport Front</Text>
        <TouchableOpacity
          style={styles.imageBox}
          onPress={() => {
            setSelectedImage(1);
            openModal();
          }}
        >
          {passportFrontUrl ? (
            <Image source={{ uri: passportFrontUrl }} style={styles.image} />
          ) : (
            <Text style={styles.placeholder}>Tap to upload</Text>
          )}
        </TouchableOpacity>

        {/* Passport Back */}
        <Text style={styles.label}>Passport Back</Text>
        <TouchableOpacity
          style={styles.imageBox}
          onPress={() => {
            setSelectedImage(2);
            openModal();
          }}
        >
          {passportBackUrl ? (
            <Image source={{ uri: passportBackUrl }} style={styles.image} />
          ) : (
            <Text style={styles.placeholder}>Tap to upload</Text>
          )}
        </TouchableOpacity>

        {/* Degree */}
        <Text style={styles.label}>Degree Certificate</Text>
        <TouchableOpacity
          style={styles.imageBox}
          onPress={() => {
            setSelectedImage(3);
            openModal();
          }}
        >
          {degreeUrl ? (
            <Image source={{ uri: degreeUrl }} style={styles.image} />
          ) : (
            <Text style={styles.placeholder}>Tap to upload</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={()=>onUploadClick()}>
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
      </ScrollView>

      <DocumentPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCamera={openCamera}
        onGallery={openGallery}
      />
    </SafeAreaView>
  );
};

export default DocumentUpload;

/** ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: appColors.primaryColor,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
    fontWeight: "600",
  },
  form: { padding: 16 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 20 },
  imageBox: {
    height: 150,
    width: 150,
    borderWidth: 1,
    borderColor: appColors.grey,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  image: { width: 150, height: 150, borderRadius: 8 },
  placeholder: { color: appColors.grey },
  button: {
    backgroundColor: appColors.primaryColor,
    padding: 16,
    borderRadius: 8,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
