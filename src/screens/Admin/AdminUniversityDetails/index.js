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
import { hitAdminUpdateUniversity, clearAdminUpdateUniversity } from "../../../redux/admin_apis/AdminUpdateUniversitySlice";
import { hitAdminDeleteUniversity, clearAdminDeleteUniversity } from "../../../redux/admin_apis/AdminDeleteUniversitySlice";

const AdminUniversityDetails = ({ navigation, route }) => {
  const universityParam = route.params?.university;
  const [universityId, setUniversityId] = useState(universityParam?._id || "");
  const [name, setName] = useState(universityParam?.name || "");

  const dispatch = useDispatch();
  const { isLoading: isUpdating } = useSelector((state) => state.adminUpdateUniversityReducer);
  const { isLoading: isDeleting } = useSelector((state) => state.adminDeleteUniversityReducer);

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("Validation error", "Please enter university name.");
      return;
    }

    const payload = {
      universityId,
      name: name.trim(),
    };

    const resultAction = await dispatch(hitAdminUpdateUniversity(payload));
    if (hitAdminUpdateUniversity.fulfilled.match(resultAction)) {
      Alert.alert("Success", "University updated successfully.", [
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
      "Are you sure you want to delete this university?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const payload = { id: universityId };
            const resultAction = await dispatch(hitAdminDeleteUniversity(payload));
            if (hitAdminDeleteUniversity.fulfilled.match(resultAction)) {
              Alert.alert("Deleted", "University deleted successfully.", [
                { text: "OK", onPress: () => navigation.navigate("AdminUniversities") },
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
        <Text style={styles.headerText}>University Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {loading ? (
          <ActivityIndicator color={appColors.primaryColor} size="large" style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>University Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="University Name"
              />
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={isUpdating}>
              <Text style={styles.updateText}>{isUpdating ? "Updating..." : "Update University"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={isDeleting}>
              <Text style={styles.deleteText}>{isDeleting ? "Deleting..." : "Delete University"}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminUniversityDetails;

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