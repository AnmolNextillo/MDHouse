import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";
import BackIcon from "../../../assets/svgs/BackIcon";
import { appColors } from "../../../utils/color";
import { hitAdminAddBanner, clearAdminAddBanner } from "../../../redux/admin_apis/AdminAddBannerSlice";
import { uploadFile, clearUploadFileData } from "../../../redux/uploadFile";
import { requestAllPermissions } from "../../../utils/constants";

const AdminAddBanner = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const dispatch = useDispatch();
  const { isLoading: isUploading } = useSelector((state) => state.uploadFileReducer);
  const { isLoading: isAdding } = useSelector((state) => state.adminAddBannerReducer);

  const showPermissionDeniedAlert = () => {
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
            // You can add Linking.openSettings() here if needed
          },
        },
      ]
    );
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 800,
      height: 400,
      cropping: true,
      mediaType: "photo",
      freeStyleCropEnabled: true,
    })
      .then(image => {
        console.log("📸 Camera Image:", image);
        const payload = {
          uri: image.path,
          fileName: image.filename || `camera_${Date.now()}.jpg`,
          type: image.mime,
        };
        dispatch(uploadFile(payload));
        setSelectedImage(image.path);
      })
      .catch(err => {
        if (err.code === "E_NO_CAMERA_PERMISSION") {
          showPermissionDeniedAlert();
        }
        console.log("❌ Camera error/cancel:", err.code);
      });
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      width: 800,
      height: 400,
      cropping: true,
      mediaType: "photo",
      freeStyleCropEnabled: true,
    })
      .then(image => {
        console.log("🖼️ Gallery Image:", image);
        const payload = {
          uri: image.path,
          fileName: image.filename || `gallery_${Date.now()}.jpg`,
          type: image.mime,
        };
        dispatch(uploadFile(payload));
        setSelectedImage(image.path);
      })
      .catch(err => {
        if (err.code === "E_NO_LIBRARY_PERMISSION") {
          showPermissionDeniedAlert();
        }
        console.log("❌ Gallery error/cancel:", err.code);
      });
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      Alert.alert("Validation error", "Please select an image for the banner.");
      return;
    }

    try {
      // First upload the image
      const uploadResult = await dispatch(uploadFile({
        uri: selectedImage,
        fileName: `banner_${Date.now()}.jpg`,
        type: 'image/jpeg',
      })).unwrap();

      if (uploadResult?.data?.url) {
        // Now add the banner with the uploaded image URL
        const payload = {
          image: uploadResult.data.url,
        };

        const resultAction = await dispatch(hitAdminAddBanner(payload));
        if (hitAdminAddBanner.fulfilled.match(resultAction)) {
          Alert.alert("Success", "Banner added successfully.", [
            {
              text: "OK",
              onPress: () => {
                dispatch(clearAdminAddBanner());
                dispatch(clearUploadFileData());
                navigation.goBack();
              },
            },
          ]);
        } else {
          const apiError = resultAction.payload || resultAction.error?.message || "Something went wrong";
          Alert.alert("Error", apiError);
        }
      } else {
        Alert.alert("Error", "Failed to upload image");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to add banner");
    }
  };

  const selectImageSource = () => {
    Alert.alert(
      "Select Image Source",
      "Choose how to select the banner image",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Camera", onPress: openCamera },
        { text: "Gallery", onPress: openGallery },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={28} width={28} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Banner</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.field}>
            <Text style={styles.label}>Banner Image</Text>
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={selectImageSource}
            >
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.selectedImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>Tap to select image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (isUploading || isAdding) && { opacity: 0.7 },
            ]}
            onPress={handleSubmit}
            disabled={isUploading || isAdding}
          >
            {isUploading || isAdding ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitText}>Add Banner</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdminAddBanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: appColors.primaryColor,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    color: appColors.white,
    fontWeight: "700",
    fontSize: 18,
    marginRight: 30,
  },
  content: {
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
    color: appColors.black,
  },
  imagePicker: {
    width: "100%",
    height: 200,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  placeholder: {
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: appColors.grey,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: appColors.primaryColor,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: appColors.white,
    fontWeight: "700",
    fontSize: 16,
  },
});