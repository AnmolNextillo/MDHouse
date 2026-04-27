import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackIcon from "../../../assets/svgs/BackIcon";
import { appColors } from "../../../utils/color";
import {
  hitAdminAddAnnouncement,
  clearAdminAddAnnouncement,
} from "../../../redux/admin_apis/AdminAddAnnouncementSlice";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AdminAddAnnouncement = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();
  const { isLoading, data, error } = useSelector(
    (state) => state.adminAddAnnouncementReducer,
  );

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Validation error", "Please enter announcement title.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Validation error", "Please enter announcement description.");
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
      };

      const resultAction = await dispatch(hitAdminAddAnnouncement(payload));
      if (hitAdminAddAnnouncement.fulfilled.match(resultAction)) {
        Alert.alert("Success", "Announcement created successfully.", [
          {
            text: "OK",
            onPress: () => {
              dispatch(clearAdminAddAnnouncement());
              navigation.goBack();
            },
          },
        ]);
      } else {
        const apiError =
          resultAction.payload ||
          resultAction.error?.message ||
          "Something went wrong";
        Alert.alert("Error", apiError);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to add announcement");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={28} width={28} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Announcement</Text>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
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
              placeholder="Enter announcement title"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.textArea]}
              placeholder="Enter announcement description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitText}>Create Announcement</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default AdminAddAnnouncement;

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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 10,
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
