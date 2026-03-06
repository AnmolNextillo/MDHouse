import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { appColors } from "../../utils/color";
import ImagePicker from "react-native-image-crop-picker";
import { useDispatch, useSelector } from "react-redux";
import { hitGetIssue } from "../../redux/GetIssuesSlice";
import { clearPostIssue, hitPostIssue } from "../../redux/PostIssueSlice";
import { clearUploadFileData, uploadFile } from "../../redux/uploadFile";
import BackIcon from "../../assets/svgs/BackIcon";
import { SafeAreaView } from "react-native-safe-area-context";

const IssueReportScreen = ({ navigation }) => {
  const [issueType, setIssueType] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [image, setImage] = useState(null);

  const issueTypes = ["Academic", "Hostal", "Other"];

  const responseUploadImage = useSelector(
    (state) => state.uploadFileReducer.data
  );
  const responseReportIssue = useSelector(
    (state) => state.postIssueReducer.data
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hitGetIssue());
  }, []);

  const openCamera = () => {
    // setModalVisible(false);
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: "photo",
    })
      .then((image) => {
        console.log("📸 Camera Image:", image);
        const payload = {
          uri: image.path,
          fileName: image.filename || `camera_${Date.now()}.jpg`,
          type: image.mime,
        };
        dispatch(uploadFile(payload));
      })
      .catch((err) => {
        console.log("❌ Camera error/cancel:", err);
      });
  };

  const pickImage = () => {
    // setModalVisible(false);
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: "photo",
    })
      .then((image) => {
        console.log("🖼️ Gallery Image:", image);
        const payload = {
          uri: image.path,
          fileName: image.filename || `gallery_${Date.now()}.jpg`,
          type: image.mime,
        };
        dispatch(uploadFile(payload));
      })
      .catch((err) => {
        console.log("❌ Gallery error/cancel:", err);
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
  };

  const handleSubmit = () => {
    if (!issueType || !subject || !description) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      type: issueType,
      subject: subject,
      description: description,
      image: image ? image : null,
    };

    dispatch(hitPostIssue(payload));

    console.log("Reported Issue:", payload);
  };

  useEffect(() => {
    if (responseUploadImage != null) {
      setImage(responseUploadImage.Location);
    }

    dispatch(clearUploadFileData());
  }, [responseUploadImage]);

  useEffect(() => {
    if (responseReportIssue != null && responseReportIssue.status == 1) {
      dispatch(clearPostIssue());
      alert("Issue submitted successfully!");
      navigation.goBack();
    }
  }, [responseReportIssue]);

  return (
    <SafeAreaView style={{flex:1}}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report an Issue</Text>
      </View>
      <ScrollView style={styles.container}>

        {/* Issue Type */}
        <Text style={styles.label}>Issue Type</Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setOpenDropdown(!openDropdown)}
        >
          <Text style={styles.dropdownText}>
            {issueType || "Select issue type"}
          </Text>
        </TouchableOpacity>

        {openDropdown && (
          <View style={styles.dropdownList}>
            {issueTypes.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setIssueType(item);
                  setOpenDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Subject */}
        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter subject"
          value={subject}
          onChangeText={setSubject}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Describe your issue"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* Image Upload */}
        <Text style={styles.label}>Upload Image (optional)</Text>

        <View style={styles.imageBtnRow}>
          <TouchableOpacity style={styles.smallBtn} onPress={() => pickImage()}>
            <Text style={styles.smallBtnText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.smallBtn} onPress={openCamera}>
            <Text style={styles.smallBtnText}>Camera</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <Image
            source={{ uri: image }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        )}

        {/* Submit */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.btnText}>Submit Issue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IssueReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#F5F7FF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: appColors.primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: appColors.primaryColor,
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#555",
    marginTop: 12,
  },

  dropdown: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  dropdownText: {
    fontSize: 15,
    color: "#333",
  },

  dropdownList: {
    backgroundColor: "#fff",
    marginTop: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
  },

  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  dropdownItemText: {
    fontSize: 15,
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 15,
  },

  textarea: {
    height: 120,
    textAlignVertical: "top",
  },

  imageBtnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  smallBtn: {
    backgroundColor: appColors.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  smallBtnText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },

  previewImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    marginTop: 10,
  },

  button: {
    backgroundColor: appColors.primaryColor,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },

  btnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
