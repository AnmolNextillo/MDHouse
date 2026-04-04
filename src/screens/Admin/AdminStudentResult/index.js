import React, { useEffect, useMemo, useState } from "react";
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
import { hitGetStudentResult, clearGetStudentResult } from "../../../redux/admin_apis/AdminGetStudentResultSlice";
import { hitAddStudentResult, clearAddStudentResult } from "../../../redux/admin_apis/AdminAddStudentResultSlice";
import BackIcon from "../../../assets/svgs/BackIcon";
import { appColors } from "../../../utils/color";

const AdminStudentResult = ({ navigation, route }) => {
  const studentId = route.params?.student?._id || route.params?.student?.studentId;
  const dispatch = useDispatch();
  const { isLoading, data, error } = useSelector(
    (state) => state.adminGetStudentResultReducer
  );
  const { isLoading: isSaving, data: saveData, error: saveError } = useSelector(
    (state) => state.adminAddStudentResultReducer
  );
  const [resultSections, setResultSections] = useState([]);

  useEffect(() => {
    if (studentId) {
      dispatch(hitGetStudentResult({ studentId }));
    }

    return () => {
      dispatch(clearGetStudentResult());
      dispatch(clearAddStudentResult());
    };
  }, [dispatch, studentId]);

  useEffect(() => {
    if (saveData && saveData.status == 1) {
      Alert.alert("Success", "Student result saved successfully");
      dispatch(clearAddStudentResult());
      navigation.goBack();
    } else if (saveError) {
      Alert.alert("Error", saveError?.message || "Unable to save student result");
      dispatch(clearAddStudentResult());
    }
  }, [saveData, saveError, dispatch, navigation]);

  const groupedResult = useMemo(() => {
    if (!Array.isArray(data?.data)) return [];

    const yearMap = {};

    data.data.forEach((item) => {
      const year = item.year || 0;
      const semester = item.semester || 0;
      const subject = {
        name: item.subjectName || "",
        marks: item.marks != null ? String(item.marks) : "",
        grade: item.grade || "",
        passFail: item.isPass ? "Pass" : "Fail",
        remarks: item.remarks || "",
      };

      if (!yearMap[year]) {
        yearMap[year] = { year, semesters: {} };
      }
      if (!yearMap[year].semesters[semester]) {
        yearMap[year].semesters[semester] = {
          semester,
          subjects: [],
        };
      }
      yearMap[year].semesters[semester].subjects.push(subject);
    });

    return Object.values(yearMap)
      .sort((a, b) => a.year - b.year)
      .map((yearEntry) => ({
        year: yearEntry.year,
        semesters: Object.values(yearEntry.semesters).sort((a, b) => a.semester - b.semester),
      }));
  }, [data]);

  useEffect(() => {
    if (groupedResult.length > 0 && resultSections.length === 0) {
      setResultSections(groupedResult);
    }
  }, [groupedResult, resultSections.length]);

  const updateSubjectField = (yearIndex, semesterIndex, subjectIndex, field, value) => {
    setResultSections((prev) => {
      const next = [...prev];
      next[yearIndex] = {
        ...next[yearIndex],
        semesters: next[yearIndex].semesters.map((semester, sIndex) => {
          if (sIndex !== semesterIndex) return semester;
          return {
            ...semester,
            subjects: semester.subjects.map((subject, subIndex) => {
              if (subIndex !== subjectIndex) return subject;
              return { ...subject, [field]: value };
            }),
          };
        }),
      };
      return next;
    });
  };

  const onSave = () => {
    if (!studentId) return;

    Alert.alert(
      "Confirm Save",
      "Are you sure you want to save these result changes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: () => {
            const resultArray = resultSections.map((yearEntry) => ({
              year: yearEntry.year,
              semesters: yearEntry.semesters.map((semesterEntry) => ({
                semester: semesterEntry.semester,
                subjects: semesterEntry.subjects.map((subject) => ({
                  name: subject.name,
                  marks: subject.marks === "" ? null : Number(subject.marks),
                  grade: subject.grade || "",
                  passFail: subject.passFail || "Fail",
                  remarks: subject.remarks || "",
                })),
              })),
            }));

            dispatch(hitAddStudentResult({ studentId, resultArray }));
          },
        },
      ]
    );
  };

  const renderSubject = (subject, subjectIndex, yearIndex, semesterIndex) => (
    <View key={`${subject.name}-${subjectIndex}`} style={styles.subjectCard}>
      <Text style={styles.subjectTitle}>{subject.name}</Text>
      <View style={styles.inputRow}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Marks</Text>
          <TextInput
            style={styles.input}
            value={subject.marks}
            placeholder="Marks"
            keyboardType="numeric"
            onChangeText={(value) => updateSubjectField(yearIndex, semesterIndex, subjectIndex, "marks", value)}
          />
        </View>
        <View style={styles.fieldGroup}> 
          <Text style={styles.fieldLabel}>Pass / Fail</Text>
          <View style={styles.passFailRow}>
            <TouchableOpacity
              style={[styles.passFailButton, subject.passFail === "Pass" && styles.passFailButtonActive]}
              onPress={() => updateSubjectField(yearIndex, semesterIndex, subjectIndex, "passFail", "Pass")}
            >
              <Text style={[styles.passFailText, subject.passFail === "Pass" && styles.passFailTextActive]}>Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.passFailButton, subject.passFail === "Fail" && styles.passFailButtonActive]}
              onPress={() => updateSubjectField(yearIndex, semesterIndex, subjectIndex, "passFail", "Fail")}
            >
              <Text style={[styles.passFailText, subject.passFail === "Fail" && styles.passFailTextActive]}>Fail</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.fieldGroupFull}>
        <Text style={styles.fieldLabel}>Remarks</Text>
        <TextInput
          style={styles.input}
          value={subject.remarks}
          placeholder="Remarks"
          onChangeText={(value) => updateSubjectField(yearIndex, semesterIndex, subjectIndex, "remarks", value)}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Student Result</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {isLoading ? (
          <ActivityIndicator size="large" color={appColors.primaryColor} style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : resultSections.length > 0 ? (
          resultSections.map((yearEntry, yearIndex) => (
            <View key={`year-${yearEntry.year}`} style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Year {yearEntry.year}</Text>
              {yearEntry.semesters.map((semesterEntry, semesterIndex) => (
                <View key={`semester-${semesterEntry.semester}`} style={styles.semesterCard}>
                  <Text style={styles.semesterTitle}>Semester {semesterEntry.semester}</Text>
                  {semesterEntry.subjects.map((subject, subjectIndex) =>
                    renderSubject(subject, subjectIndex, yearIndex, semesterIndex)
                  )}
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No result data available for this student.</Text>
        )}

        {resultSections.length > 0 && (
          <TouchableOpacity onPress={onSave} disabled={isSaving} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>{isSaving ? "Saving..." : "Save Result"}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminStudentResult;

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
  sectionCard: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: appColors.primaryColor,
    marginBottom: 12,
  },
  semesterCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },
  semesterTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  subjectCard: {
    backgroundColor: "#f8f9ff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  subjectTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fieldGroup: {
    flex: 1,
    marginBottom: 12,
    marginRight: 10,
  },
  fieldGroupFull: {
    width: "100%",
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#111",
  },
  passFailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  passFailButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  passFailButtonActive: {
    borderColor: appColors.primaryColor,
    backgroundColor: appColors.primaryColor,
  },
  passFailText: {
    textAlign: "center",
    color: "#333",
    fontWeight: "600",
  },
  passFailTextActive: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: appColors.primaryColor,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: appColors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    color: appColors.red,
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  noDataText: {
    color: appColors.grey,
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});
