import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { hitAddStudentAttendance, clearAddStudentAttendance } from "../../../redux/admin_apis/AdminAddStudentAttendanceSlice";
import BackIcon from "../../../assets/svgs/BackIcon";
import { appColors } from "../../../utils/color";

const initialAttendance = Array.from({ length: 6 }, (_, yearIndex) => ({
  year: yearIndex + 1,
  semesters: [
    { semester: 1, totalClasses: "", missedClasses: "", presentClasses: "" },
    { semester: 2, totalClasses: "", missedClasses: "", presentClasses: "" },
  ],
}));

const AdminStudentAttendance = ({ navigation, route }) => {
  const studentId = route.params?.student?._id || route.params?.student?.studentId;
  const dispatch = useDispatch();
  const { isLoading, data, error } = useSelector((state) => state.adminAddStudentAttendanceReducer);
  const [attendanceSections, setAttendanceSections] = useState(initialAttendance);

  useEffect(() => {
    return () => {
      dispatch(clearAddStudentAttendance());
    };
  }, [dispatch]);

  useEffect(() => {
    if (data && data.status == 1) {
      Alert.alert("Success", "Attendance saved successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
      dispatch(clearAddStudentAttendance());
    } else if (error) {
      Alert.alert("Error", error?.message || "Unable to save attendance");
      dispatch(clearAddStudentAttendance());
    }
  }, [data, error, dispatch, navigation]);

  const updateField = (yearIndex, semesterIndex, field, value) => {
    setAttendanceSections((prev) => {
      const next = [...prev];
      next[yearIndex] = {
        ...next[yearIndex],
        semesters: next[yearIndex].semesters.map((semester, index) => {
          if (index !== semesterIndex) return semester;
          return { ...semester, [field]: value };
        }),
      };
      return next;
    });
  };

  const handleSave = () => {
    if (!studentId) return;

    Alert.alert(
      "Confirm Save",
      "Are you sure you want to save attendance for this student?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: () => {
            const resultArray = attendanceSections.map((yearEntry) => ({
              year: yearEntry.year,
              semesters: yearEntry.semesters.map((semester) => ({
                semester: semester.semester,
                totalClasses: semester.totalClasses === "" ? null : Number(semester.totalClasses),
                missedClasses: semester.missedClasses === "" ? null : Number(semester.missedClasses),
                presentClasses: semester.presentClasses === "" ? null : Number(semester.presentClasses),
              })),
            }));
            dispatch(hitAddStudentAttendance({ studentId, resultArray }));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Update Attendance</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {attendanceSections.map((yearEntry, yearIndex) => (
          <View key={`year-${yearEntry.year}`} style={styles.yearCard}>
            <Text style={styles.yearTitle}>Year {yearEntry.year}</Text>
            {yearEntry.semesters.map((semesterEntry, semesterIndex) => (
              <View key={`sem-${semesterEntry.semester}`} style={styles.semesterCard}>
                <Text style={styles.semesterTitle}>Semester {semesterEntry.semester}</Text>
                <View style={styles.row}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Total Classes</Text>
                    <TextInput
                      style={styles.input}
                      value={semesterEntry.totalClasses}
                      placeholder="0"
                      keyboardType="numeric"
                      onChangeText={(value) => updateField(yearIndex, semesterIndex, "totalClasses", value)}
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Missed Classes</Text>
                    <TextInput
                      style={styles.input}
                      value={semesterEntry.missedClasses}
                      placeholder="0"
                      keyboardType="numeric"
                      onChangeText={(value) => updateField(yearIndex, semesterIndex, "missedClasses", value)}
                    />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.inputWrapperFull}>
                    <Text style={styles.inputLabel}>Present Classes</Text>
                    <TextInput
                      style={styles.input}
                      value={semesterEntry.presentClasses}
                      placeholder="0"
                      keyboardType="numeric"
                      onChangeText={(value) => updateField(yearIndex, semesterIndex, "presentClasses", value)}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}

        <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={isLoading}>
          <Text style={styles.saveButtonText}>{isLoading ? "Saving..." : "Save Attendance"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminStudentAttendance;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: appColors.primaryColor,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    color: appColors.white,
    fontSize: 18,
    fontWeight: "700",
    marginRight: 30,
  },
  content: { padding: 16, paddingBottom: 40 },
  yearCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  yearTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: appColors.primaryColor,
  },
  semesterCard: {
    backgroundColor: "#f9fbff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  semesterTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 10,
  },
  inputWrapperFull: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    color: "#111",
  },
  saveButton: {
    backgroundColor: appColors.primaryColor,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 6,
  },
  saveButtonText: {
    color: appColors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});