import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BackIcon from "../../../assets/svgs/BackIcon";
import { appColors } from "../../../utils/color";
import { hitAdminUpdateAnnouncement, clearAdminUpdateAnnouncement } from "../../../redux/admin_apis/AdminUpdateAnnouncementSlice";
import { hitAdminDeleteAnnouncement, clearAdminDeleteAnnouncement } from "../../../redux/admin_apis/AdminDeleteAnnouncementSlice";

const AdminAnnouncementDetails = ({ navigation, route }) => {
  const announcementParam = route.params?.announcement;
  const [id, setId] = useState(announcementParam?._id || "");
  const [title, setTitle] = useState(announcementParam?.title || "");
  const [description, setDescription] = useState(announcementParam?.description || "");

  const dispatch = useDispatch();
  const { isLoading: isUpdating } = useSelector((state) => state.adminUpdateAnnouncementReducer);
  const { isLoading: isDeleting } = useSelector((state) => state.adminDeleteAnnouncementReducer);

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert("Validation error", "Please enter announcement title.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Validation error", "Please enter announcement description.");
      return;
    }

    const payload = {
      announcementId: id,
      title: title.trim(),
      description: description.trim(),
    };

    const resultAction = await dispatch(hitAdminUpdateAnnouncement(payload));
    if (hitAdminUpdateAnnouncement.fulfilled.match(resultAction)) {
      Alert.alert("Success", "Announcement updated successfully.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      const err = resultAction.payload || resultAction.error?.message || "Update failed";
      Alert.alert("Error", err);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this announcement?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const payload = { id };
            const resultAction = await dispatch(hitAdminDeleteAnnouncement(payload));
            if (hitAdminDeleteAnnouncement.fulfilled.match(resultAction)) {
              Alert.alert("Deleted", "Announcement deleted successfully.", [
                { text: "OK", onPress: () => navigation.navigate("AdminAnnouncements") },
              ]);
            } else {
              const err = resultAction.payload || resultAction.error?.message || "Delete failed";
              Alert.alert("Error", err);
            }
          },
        },
      ]
    );
  };

  const loading = isUpdating || isDeleting;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={28} width={28} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Announcement Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {loading ? (
          <ActivityIndicator color={appColors.primaryColor} size="large" style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                placeholder="Announcement Title"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                style={[styles.input, styles.textArea]}
                placeholder="Announcement Description"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={isUpdating}>
              <Text style={styles.updateText}>{isUpdating ? "Updating..." : "Update Announcement"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={isDeleting}>
              <Text style={styles.deleteText}>{isDeleting ? "Deleting..." : "Delete Announcement"}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminAnnouncementDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
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
  updateButton: {
    marginTop: 10,
    backgroundColor: appColors.primaryColor,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  updateText: {
    color: appColors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#dc3545",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    color: appColors.white,
    fontWeight: "700",
    fontSize: 16,
  },
});