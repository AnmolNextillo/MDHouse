import {
  Alert,
  Image,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackIcon from "../../../assets/svgs/BackIcon";
import { appColors } from "../../../utils/color";
import ImagePicker from "react-native-image-crop-picker";
import DatePickerIcon from "../../../assets/svgs/DatePickerIcon";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { clearUploadFileData, uploadFile } from "../../../redux/uploadFile";
import {
  clearUpdateProfile,
  hitUpdateProfile,
} from "../../../redux/UpdateProfileSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DocumentPickerModal from "../../../components/DocumentPickerModal";
import { pick } from "@react-native-documents/picker";
import { requestAllPermissions } from "../../../utils/constants";

const DocumentUpload = ({ navigation, route }) => {
  const { from } = route.params;

  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [passportFrontImage, setPassportFrontImage] = useState(null);
  const [passportBackImage, setPassportBackImage] = useState(null);
  const [visaImage, setVisaImage] = useState(null);
  const [policeVerificationImage, setPoliceVerificationImage] = useState(null);

  const [visaValidityDate, setVisaValidityDate] = useState(new Date());
  const [passportValidityDate, setPassportValidityDate] = useState(new Date());
  const [policeVerificationDate, setPoliceVerificationDate] = useState(
    new Date()
  );

  const [urlProfileImage, setUrlProfileImage] = useState(null);
  const [urlPassportFrontImage, setUrlPassportFrontImage] = useState(null);
  const [urlPassportBackImage, setUrlPassportBackImage] = useState(null);
  const [urlVisaImage, setUrlVisaImage] = useState(null);
  const [urlPoliceVerificationImage, setUrlPoliceVerificationImage] =
    useState(null);

  const responseUploadImage = useSelector(
    (state) => state.uploadFileReducer.data
  );
  const responseUpdateProfile = useSelector(
    (state) => state.updateProfileReducer.data
  );

  const [passportDatePicker, setPassportShowDatePicker] = useState(false);
  const [visaDatePicker, setVisaShowDatePicker] = useState(false);
  const [policeDatePicker, setPoliceShowDatePicker] = useState(false);

  const responseProfileData = useSelector(
    (state) => state.getProfileReducer.data
  );

  const dispatch = useDispatch();

  const passportDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log("Selected Date ===> ", currentDate);
    setPassportShowDatePicker(Platform.OS === "ios"); // iOS keeps it open
    setPassportValidityDate(currentDate);
  };
  const visaDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log("Selected Date ===> ", currentDate);
    setVisaShowDatePicker(Platform.OS === "ios"); // iOS keeps it open
    setVisaValidityDate(currentDate);
  };
  const policeDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log("Selected Date ===> ", currentDate);
    setPoliceShowDatePicker(Platform.OS === "ios"); // iOS keeps it open
    setPoliceVerificationDate(currentDate);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "App needs access to your camera",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS === "android") {
      const permission =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const granted = await PermissionsAndroid.request(permission, {
        title: "Storage Permission",
        message: "This app needs access to your photo library",
        buttonPositive: "OK",
      });

      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          "Permission Required",
          "Please enable storage permission from settings",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS
  };

  const openModal = async () => {
    const hasPermission = await requestAllPermissions();
    console.log("Has Permission ===> ", hasPermission);
    if (hasPermission) {
      setModalVisible(true); // open your bottom sheet modal
    } else {
      showPermissionDeniedAlert();
      console.log("User denied permissions");
    }
  };

  function showPermissionDeniedAlert() {
    Alert.alert(
      "The MDHouse",
      "You denied permissions. Enable both camera and file permissions from settings.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            Linking.openSettings().catch(() => {
              Alert.alert("Error", "Unable to open settings");
            });
          },
        },
      ]
    );
  }

const openCamera = () => {
  // setModalVisible(false);
  ImagePicker.openCamera({
    width: 300,
    height: 400,
    cropping: true,
    mediaType: "photo",
    freeStyleCropEnabled: true, // 🔥 allows moving crop edges
  })
    .then(image => {
      console.log("📸 Camera Image:", image);
      const payload = {
        uri: image.path,
        fileName: image.filename || `camera_${Date.now()}.jpg`,
        type: image.mime,
      };
      dispatch(uploadFile(payload));
    })
    .catch(err => {
      setModalVisible(false);
      if (err.code === "E_NO_CAMERA_PERMISSION") {
        showPermissionDeniedAlert();
      }
      console.log("❌ Camera error/cancel:", err.code);
    });
};

const openGallery = () => {
  // setModalVisible(false);
  ImagePicker.openPicker({
    width: 300,
    height: 400,
    cropping: true,
    mediaType: "photo",
    freeStyleCropEnabled: true, // 🔥 allows moving crop edges
  })
    .then(image => {
      console.log("🖼️ Gallery Image:", image);
      const payload = {
        uri: image.path,
        fileName: image.filename || `gallery_${Date.now()}.jpg`,
        type: image.mime,
      };
      dispatch(uploadFile(payload));
    })
    .catch(err => {
      setModalVisible(false);
       if (err.code === "E_NO_LIBRARY_PERMISSION") {
        showPermissionDeniedAlert();
      }
      console.log("❌ Gallery error/cancel:", err.code);
    });
};

  const cleanImage = () => {
    ImagePicker.clean()
      .then(() => {
        console.log("removed all tmp images from tmp directory");
      })
      .catch((e) => {
        console.log("❌ Clean image error:", e);
      });
  }

  const openDocument = async () => {
    setModalVisible(false);
    try {
      const results = await pick({
        type: [types.allFiles],
      });

      const payload = {
        uri: results[0].uri,
        fileName: results[0].name,
        type: results[0].type,
      };
      dispatch(uploadFile(payload));
      // results is probably an array
      console.log(results);
    } catch (err) {
      // handle cancellation or errors
      console.warn(err);
    }
  };

  const onUploadClick = async () => {
    if (
      urlProfileImage == null ||
      urlVisaImage == null ||
      urlPoliceVerificationImage == null
    ) {
      Alert.alert("MD House", "All fields are required!");
      return;
    } else {
      await AsyncStorage.setItem("step", JSON.stringify(6));
      const payload = {
        profileImage: urlProfileImage,
        passportValidityDate: passportValidityDate.toISOString().slice(0, 10),
        passportImageFront: urlPassportFrontImage,
        passportImageBack: urlPassportBackImage,
        visaValidityDate: visaValidityDate.toISOString().slice(0, 10),
        visaImageFront: urlVisaImage,
        studyPoliceVerificationDate: policeVerificationDate
          .toISOString()
          .slice(0, 10),
        studyPoliceVerificationImageBack: urlPoliceVerificationImage,
        step: 6,
      };
      dispatch(hitUpdateProfile(payload));
    }
    // AsyncStorage.removeItem("tempToken")
  };

  useEffect(() => {
    console.log("responseProfileData ===> ", responseProfileData);
    if (responseProfileData != null && responseProfileData.status == 1) {
      if (responseProfileData.data.profileImage != "") {
        setUrlProfileImage(responseProfileData.data.profileImage);
      }
      if (responseProfileData.data.passportValidityDate != "") {
        setPassportValidityDate(
          new Date(responseProfileData.data.passportValidityDate)
        );
      }
      if (responseProfileData.data.passportImageFront != "") {
        setUrlPassportFrontImage(responseProfileData.data.passportImageFront);
      }
      if (responseProfileData.data.passportImageBack != "") {
        setUrlPassportBackImage(responseProfileData.data.passportImageBack);
      }
      if (responseProfileData.data.visaImageFront != "") {
        setUrlVisaImage(responseProfileData.data.visaImageFront);
      }
      if (responseProfileData.data.visaValidityDate != "") {
        setVisaValidityDate(
          new Date(responseProfileData.data.visaValidityDate)
        );
      }
      if (responseProfileData.data.studyPoliceVerificationDate != "") {
        setPoliceVerificationDate(
          new Date(responseProfileData.data.studyPoliceVerificationDate)
        );
      }
      if (responseProfileData.data.studyPoliceVerificationImageBack != "") {
        setUrlPoliceVerificationImage(
          responseProfileData.data.studyPoliceVerificationImageBack
        );
      }
    }
  }, [responseProfileData]);

  useEffect(() => {
    if (responseUploadImage != null) {
      selectedImage == 1
        ? setUrlProfileImage(responseUploadImage.Location)
        : selectedImage == 2
          ? setUrlPassportFrontImage(responseUploadImage.Location)
          : selectedImage == 3
            ? setUrlPassportBackImage(responseUploadImage.Location)
            : selectedImage == 4
              ? setUrlVisaImage(responseUploadImage.Location)
              : selectedImage == 5
                ? setUrlPoliceVerificationImage(responseUploadImage.Location)
                : "";

      setModalVisible(false);
    }

    dispatch(clearUploadFileData());
  }, [responseUploadImage]);

  useEffect(() => {
    if (responseUpdateProfile != null && responseUpdateProfile.status == 1) {
      if (from == 3 || from == 1) {
        navigation.reset({
          index: 0,
          routes: [{ name: "BottomBar" }],
        });
      } else {
        navigation.goBack();
      }
    } else {
      if (responseUpdateProfile != null) {
        Alert.alert("MD House", responseUpdateProfile.message);
      }
    }
    dispatch(clearUpdateProfile());
  }, [responseUpdateProfile]);

  return (
    <SafeAreaView style={styles.constainerStyle}>
      <View style={styles.headerStyle}>
        <TouchableOpacity
          onPress={() =>
            from == 1
              ? navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "Login",
                  },
                ],
              })
              : navigation.goBack()
          }
        >
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Upload Documents</Text>
      </View>
      <ScrollView style={styles.formStyle}>
        <Text style={styles.labelStyle}>Upload Profile Image</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => {
            setSelectedImage(1);
            // setModalVisible(true);
            openModal();
          }}
        >
          {profileImage || urlProfileImage ? (
            <Image
              source={{
                uri:
                  urlProfileImage == "" ? profileImage.path : urlProfileImage,
              }}
              style={styles.profileImage}
            />
          ) : (
            <Text style={styles.uploadText}>Tap to select image</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.labelStyle}>Passport Validity Date</Text>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setPassportShowDatePicker(true)}
        >
          <Text style={{ color: appColors.black, flex: 1 }}>
            {passportValidityDate.toISOString().slice(0, 10)}
          </Text>
          <DatePickerIcon height={32} width={32} />
        </TouchableOpacity>

        {passportDatePicker && (
          <DateTimePicker
            value={passportValidityDate}
            mode="date"
            display="default"
            onChange={passportDateChange}
          />
        )}

        <Text style={styles.labelStyle}>Upload Passport Images</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => {
              setSelectedImage(2);
              // setModalVisible(true);
              openModal();
            }}
          >
            {passportFrontImage || urlPassportFrontImage ? (
              <Image
                source={{
                  uri:
                    urlPassportFrontImage == null
                      ? passportFrontImage.path
                      : urlPassportFrontImage,
                }}
                style={styles.profileImage}
              />
            ) : (
              <Text style={styles.uploadText}>Front Image</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => {
              setSelectedImage(3);
              // setModalVisible(true);
              openModal();
            }}
          >
            {passportBackImage || urlPassportBackImage ? (
              <Image
                source={{
                  uri:
                    urlPassportBackImage == null
                      ? passportBackImage.path
                      : urlPassportBackImage,
                }}
                style={styles.profileImage}
              />
            ) : (
              <Text style={styles.uploadText}>Back Image</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* <Text style={styles.labelStyle}>Passport Validity Image</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => setModalVisible(true)}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage.path }} style={styles.profileImage} />
          ) : (
            <Text style={styles.uploadText}>Tap to select image</Text>
          )}
        </TouchableOpacity> */}

        <Text style={styles.labelStyle}>Visa Validity Date</Text>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setVisaShowDatePicker(true)}
        >
          <Text style={{ color: appColors.black, flex: 1 }}>
            {visaValidityDate.toISOString().slice(0, 10)}
          </Text>
          <DatePickerIcon height={32} width={32} />
        </TouchableOpacity>

        {visaDatePicker && (
          <DateTimePicker
            value={visaValidityDate}
            mode="date"
            display="default"
            onChange={visaDateChange}
          />
        )}

        <Text style={styles.labelStyle}>Visa Validity Image</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => {
            setSelectedImage(4);
            // setModalVisible(true);
            openModal();
          }}
        >
          {visaImage || urlVisaImage ? (
            <Image
              source={{
                uri: urlVisaImage == null ? visaImage.path : urlVisaImage,
              }}
              style={styles.profileImage}
            />
          ) : (
            <Text style={styles.uploadText}>Tap to select image</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.labelStyle}>Police Verification Date</Text>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setPoliceShowDatePicker(true)}
        >
          <Text style={{ color: appColors.black, flex: 1 }}>
            {policeVerificationDate.toISOString().slice(0, 10)}
          </Text>
          <DatePickerIcon height={32} width={32} />
        </TouchableOpacity>

        {policeDatePicker && (
          <DateTimePicker
            value={policeVerificationDate}
            mode="date"
            display="default"
            onChange={policeDateChange}
          />
        )}

        <Text style={styles.labelStyle}>Police Verification Image</Text>
        <TouchableOpacity
          style={styles.imagePicker}
          onPress={() => {
            setSelectedImage(5);
            // setModalVisible(true);
            openModal();
          }}
        >
          {policeVerificationImage || urlPoliceVerificationImage ? (
            <Image
              source={{
                uri:
                  urlPoliceVerificationImage == null
                    ? policeVerificationImage.path
                    : urlPoliceVerificationImage,
              }}
              style={styles.profileImage}
            />
          ) : (
            <Text style={styles.uploadText}>Tap to select image</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => onUploadClick()}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Option</Text>

            <TouchableOpacity style={styles.modalButton} onPress={openCamera}>
              <Text style={styles.modalButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={openGallery}>
              <Text style={styles.modalButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#eee' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: '#444' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal> */}

      <DocumentPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCamera={openCamera}
        onGallery={openGallery}
        onDocument={openDocument}
      />
    </SafeAreaView>
  );
};

export default DocumentUpload;

const styles = StyleSheet.create({
  constainerStyle: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerStyle: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: appColors.primaryColor,
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    color: appColors.white,
    textAlign: "center",
    marginRight: 32,
    flex: 1,
  },
  formStyle: {
    flex: 1,
    padding: 16,
  },
  labelStyle: {
    fontWeight: "600",
    fontSize: 16,
    color: appColors.black,
    marginBottom: 8,
    marginTop: 16,
  },
  imagePicker: {
    height: 150,
    width: 150,
    borderWidth: 1,
    borderColor: appColors.grey,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
    alignSelf: "flex-start",
  },
  uploadText: {
    color: appColors.grey,
    textAlign: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: appColors.primaryColor,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: appColors.grey,
    borderRadius: 8,
    height: 45,
    paddingHorizontal: 8,
  },
  textInputStyle: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: appColors.grey,
    width: "100%",
    paddingHorizontal: 8,
  },
  buttonStyle: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    backgroundColor: appColors.primaryColor,
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: appColors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
