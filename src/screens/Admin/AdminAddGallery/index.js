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
  TextInput,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";
import BackIcon from "../../../assets/svgs/BackIcon";
import { appColors } from "../../../utils/color";
import { hitAdminAddGallery, clearAdminAddGallery } from "../../../redux/admin_apis/AdminAddGallerySlice";
import { uploadFile, clearUploadFileData } from "../../../redux/uploadFile";
import { requestAllPermissions } from "../../../utils/constants";

const AdminAddGallery = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const dispatch = useDispatch();
  const { isLoading: isUploading } = useSelector((state) => state.uploadFileReducer);
  const { isLoading: isAdding } = useSelector((state) => state.adminAddGalleryReducer);

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
      height: 600,
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
        setSelectedImages(prev => [...prev, image.path]);
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
      height: 600,
      cropping: true,
      mediaType: "photo",
      freeStyleCropEnabled: true,
      multiple: true,
      maxFiles: 10,
    })
      .then(images => {
        console.log("🖼️ Gallery Images:", images);
        images.forEach(image => {
          const payload = {
            uri: image.path,
            fileName: image.filename || `gallery_${Date.now()}.jpg`,
            type: image.mime,
          };
          dispatch(uploadFile(payload));
        });
        setSelectedImages(prev => [...prev, ...images.map(img => img.path)]);
      })
      .catch(err => {
        if (err.code === "E_NO_LIBRARY_PERMISSION") {
          showPermissionDeniedAlert();
        }
        console.log("❌ Gallery error/cancel:", err.code);
      });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Validation error", "Please enter a title for the gallery.");
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert("Validation error", "Please select at least one image.");
      return;
    }

    try {
      setIsUploadingImages(true);
      setUploadProgress(0);

      // Upload all images first
      const uploadedUrls = [];
      for (let i = 0; i < selectedImages.length; i++) {
        const uploadResult = await dispatch(uploadFile({
          uri: selectedImages[i],
          fileName: `gallery_${Date.now()}_${i}.jpg`,
          type: 'image/jpeg',
        })).unwrap();

        console.log("Upload Result:", uploadResult);

        // Handle different response structures
        let imageUrl = null;
        if (uploadResult?.Location) {
          imageUrl = uploadResult.Location;
        } else if (uploadResult?.url) {
          imageUrl = uploadResult.url;
        } else if (uploadResult?.data?.url) {
          imageUrl = uploadResult.data.url;
        } else if (uploadResult?.link) {
          imageUrl = uploadResult.link;
        } else if (typeof uploadResult === 'string') {
          imageUrl = uploadResult;
        }

        console.log("Extracted Image URL:", imageUrl);

        if (imageUrl) {
          uploadedUrls.push({
            type: "image",
            link: imageUrl
          });
        }

        // Update progress
        setUploadProgress(Math.round(((i + 1) / selectedImages.length) * 100));
      }

      if (uploadedUrls.length === 0) {
        Alert.alert("Error", "Failed to upload images");
        setIsUploadingImages(false);
        return;
      }

      // Now add the gallery with the uploaded image URLs
      const payload = {
        title: title.trim(),
        images: uploadedUrls,
      };

      const resultAction = await dispatch(hitAdminAddGallery(payload));
      if (hitAdminAddGallery.fulfilled.match(resultAction)) {
        Alert.alert("Success", "Gallery item added successfully.", [
          {
            text: "OK",
            onPress: () => {
              dispatch(clearAdminAddGallery());
              dispatch(clearUploadFileData());
              setIsUploadingImages(false);
              setUploadProgress(0);
              navigation.goBack();
            },
          },
        ]);
      } else {
        const apiError = resultAction.payload || resultAction.error?.message || "Something went wrong";
        Alert.alert("Error", apiError);
        setIsUploadingImages(false);
      }
    } catch (e) {
      console.error("Upload Error:", e);
      Alert.alert("Error", e?.message || "Failed to add gallery item");
      setIsUploadingImages(false);
    }
  };

  const selectImageSource = () => {
    Alert.alert(
      "Select Image Source",
      "Choose how to select gallery images",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Camera", onPress: openCamera },
        { text: "Gallery (Multiple)", onPress: openGallery },
      ]
    );
  };

  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageItem}>
      <Image source={{ uri: item }} style={styles.selectedImage} resizeMode="cover" />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeImage(index)}
      >
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={28} width={28} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Gallery Item</Text>
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
            <Text style={styles.label}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              placeholder="Enter gallery title"
              placeholderTextColor="#999"
              editable={!isUploadingImages}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Images ({selectedImages.length})</Text>
            <TouchableOpacity
              style={[styles.imagePicker, isUploadingImages && { opacity: 0.5 }]}
              onPress={selectImageSource}
              disabled={isUploadingImages}
            >
              <Text style={styles.pickerText}>Tap to add images</Text>
            </TouchableOpacity>

            {selectedImages.length > 0 && (
              <FlatList
                data={selectedImages}
                renderItem={renderImageItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imagesList}
              />
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (isUploading || isAdding || isUploadingImages) && { opacity: 0.7 },
            ]}
            onPress={handleSubmit}
            disabled={isUploading || isAdding || isUploadingImages}
          >
            {isUploading || isAdding || isUploadingImages ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitText}>Add Gallery Item</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {isUploadingImages && (
        <View style={styles.uploadOverlay}>
          <View style={styles.uploadContainer}>
            <ActivityIndicator size="large" color={appColors.primaryColor} />
            <Text style={styles.uploadTitle}>Uploading Images...</Text>
            <Text style={styles.uploadProgress}>
              {uploadProgress}% Complete
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${uploadProgress}%` },
                ]}
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AdminAddGallery;

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
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 14,
  },
  imagePicker: {
    width: "100%",
    height: 100,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
  },
  pickerText: {
    fontSize: 16,
    color: appColors.grey,
  },
  imagesList: {
    marginTop: 8,
  },
  imageItem: {
    marginRight: 12,
    position: "relative",
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#dc3545",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  removeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
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
  uploadOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  uploadContainer: {
    backgroundColor: appColors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    width: "80%",
    maxWidth: 300,
  },
  uploadTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "700",
    color: appColors.black,
  },
  uploadProgress: {
    marginTop: 8,
    fontSize: 14,
    color: appColors.primaryColor,
    fontWeight: "600",
  },
  progressBar: {
    marginTop: 16,
    width: "100%",
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: appColors.primaryColor,
    borderRadius: 4,
  },
});