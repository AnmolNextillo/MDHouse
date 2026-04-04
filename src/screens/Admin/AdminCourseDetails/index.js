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
import { hitAdminUpdateCourse, clearAdminUpdateCourse } from "../../../redux/admin_apis/AdminUpdateCourseSlice";
import { hitAdminDeleteCourse, clearAdminDeleteCourse } from "../../../redux/admin_apis/AdminDeleteCourseSlice";

const AdminCourseDetails = ({ navigation, route }) => {
  const courseParam = route.params?.course;
  const [id] = useState(courseParam?._id || "");
  const [name, setName] = useState(courseParam?.name || "");

  const dispatch = useDispatch();
  const { isLoading: isUpdating } = useSelector((state) => state.adminUpdateCourseReducer);
  const { isLoading: isDeleting } = useSelector((state) => state.adminDeleteCourseReducer);

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("Validation error", "Please enter course name.");
      return;
    }

    const payload = {
      courseId: id,
      name: name.trim(),
    };

    const resultAction = await dispatch(hitAdminUpdateCourse(payload));
    if (hitAdminUpdateCourse.fulfilled.match(resultAction)) {
      Alert.alert("Success", "Course updated successfully.", [
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
      "Are you sure you want to delete this course?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const payload = { id };
            const resultAction = await dispatch(hitAdminDeleteCourse(payload));
            if (hitAdminDeleteCourse.fulfilled.match(resultAction)) {
              Alert.alert("Deleted", "Course deleted successfully.", [
                { text: "OK", onPress: () => navigation.navigate("AdminCourses") },
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
        <Text style={styles.headerText}>Course Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {loading ? (
          <ActivityIndicator color={appColors.primaryColor} size="large" style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Course Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="Course Name"
              />
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={isUpdating}>
              <Text style={styles.updateText}>{isUpdating ? "Updating..." : "Update Course"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={isDeleting}>
              <Text style={styles.deleteText}>{isDeleting ? "Deleting..." : "Delete Course"}</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminCourseDetails;

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