import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { appColors } from "../../utils/color";
import BackIcon from "../../assets/svgs/BackIcon";
import { hitResult } from "../../redux/ResultSlice";

const ResultScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [selectedSemester, setSelectedSemester] = useState("1");

  // Redux data
  const responseResult = useSelector((state) => state.resultReducer.data);

  // Fetch API on semester change
  useEffect(() => {
    dispatch(hitResult(selectedSemester));
  }, [selectedSemester]);

  // 12 semesters
  const semesters = Array.from({ length: 12 }, (_, i) => `${i + 1}`);

  // Filter subjects for selected semester
  const subjects =
    responseResult?.status === 1
      ? (responseResult.data || []).filter(
          (sub) => sub.semester === parseInt(selectedSemester)
        )
      : [];

  // Summary calculation
  const totalMarks = subjects.reduce((sum, s) => sum + (s.marks ?? 0), 0);
  const percentage = subjects.length
    ? ((totalMarks / (subjects.length * 100)) * 100).toFixed(1)
    : 0;
  const resultStatus = percentage >= 40 ? "Pass" : "Fail";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Result</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Semester selection */}
        <Text style={styles.sectionTitle}>Select Semester</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.semesterScroll}
        >
          {semesters.map((sem) => (
            <TouchableOpacity
              key={sem}
              style={[
                styles.semesterButton,
                selectedSemester === sem && styles.semesterButtonActive,
              ]}
              onPress={() => setSelectedSemester(sem)}
            >
              <Text
                style={[
                  styles.semesterText,
                  selectedSemester === sem && styles.semesterTextActive,
                ]}
              >
                Semester {sem}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Subject list */}
        <View style={styles.card}>
          <Text style={styles.semesterTitle}>
            Semester {selectedSemester} Results
          </Text>

          {subjects.length === 0 ? (
            <Text style={styles.noDataText}>
              No result found for this semester
            </Text>
          ) : (
            <FlatList
              data={subjects}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.subjectRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subjectName}>
                      {item.subjectName ?? "-"}
                    </Text>
                    <Text style={styles.remarksText}>
                      Remarks: {item.remarks ?? "-"}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.marksText}>
                      {item.marks ?? "-"} / 100
                    </Text>
                    <Text style={styles.gradeText}>
                      Grade: {item.grade ?? "N/A"}
                    </Text>
                  </View>
                </View>
              )}
            />
          )}
        </View>

        {/* Summary */}
        {subjects.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Marks:</Text>
              <Text style={styles.summaryValue}>{totalMarks}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Percentage:</Text>
              <Text style={styles.summaryValue}>{percentage}%</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Result:</Text>
              <Text
                style={[
                  styles.summaryValue,
                  resultStatus === "Pass" ? styles.pass : styles.fail,
                ]}
              >
                {resultStatus}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4FF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: appColors.primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginLeft: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: appColors.primaryColor,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  semesterScroll: { paddingHorizontal: 10, marginBottom: 20 },
  semesterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 6,
  },
  semesterButtonActive: {
    backgroundColor: appColors.primaryColor,
    borderColor: appColors.primaryColor,
  },
  semesterText: { color: "#333", fontWeight: "600" },
  semesterTextActive: { color: "#fff" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  semesterTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: appColors.primaryColor,
    marginBottom: 10,
  },
  subjectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  subjectName: { fontSize: 16, color: "#333", fontWeight: "600" },
  remarksText: { fontSize: 14, color: "#555", marginTop: 4 },
  marksText: { fontSize: 16, color: "#333", fontWeight: "600" },
  gradeText: { fontSize: 14, color: "#888" },
  noDataText: { textAlign: "center", color: "#777", marginVertical: 20, fontSize: 16 },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 30,
    elevation: 3,
  },
  summaryTitle: { fontSize: 18, fontWeight: "700", color: appColors.primaryColor, marginBottom: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  summaryLabel: { fontSize: 16, color: "#333", fontWeight: "600" },
  summaryValue: { fontSize: 16, fontWeight: "700" },
  pass: { color: "green" },
  fail: { color: "red" },
});
