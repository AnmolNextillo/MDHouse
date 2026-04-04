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
import { hitAdminAddCourse, clearAdminAddCourse } from "../../../redux/admin_apis/AdminAddCourseSlice";

const AdminAddCourse = ({ navigation }) => {
  const [name, setName] = useState("");

  const dispatch = useDispatch();
  const { isLoading, data, error } = useSelector((state) => state.adminAddCourseReducer);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Validation error", "Please enter course name.");
      return;
    }

    try {
      const payload = {
        name: name.trim(),
      };

      const resultAction = await dispatch(hitAdminAddCourse(payload));
      if (hitAdminAddCourse.fulfilled.match(resultAction)) {
        Alert.alert("Success", "Course created successfully.", [
          {
            text: "OK",
            onPress: () => {
              dispatch(clearAdminAddCourse());
              navigation.goBack();
            },
          },
        ]);
      } else {
        const apiError = resultAction.payload || resultAction.error?.message || "Something went wrong";
        Alert.alert("Error", apiError);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to add course");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={28} width={28} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Course</Text>
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
            <Text style={styles.label}>Course Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Enter course name"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && { opacity: 0.7 },
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitText}>Create Course</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdminAddCourse;

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