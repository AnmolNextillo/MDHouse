import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { appColors } from "../../utils/color";
import BackIcon from "../../assets/svgs/BackIcon";
import { useDispatch, useSelector } from "react-redux";
import { hitAttendance } from "../../redux/AttendanceSlice";

const Attendance = () => {
  const navigation = useNavigation();

  const [selectedSemester, setSelectedSemester] = useState("1");

  const responseAtt = useSelector((state)=>state.attendanceReducer.data)
  const [att,setAtt] = useState(null);


  const dispatch = useDispatch()

    useEffect(() => {
      dispatch(hitAttendance(selectedSemester));
    }, [selectedSemester]);

  // Dummy attendance data (you can replace with API data later)
  const dummyAttendance = [
    { semester: 1, total: 40, present: 36, absent: 4 },
    { semester: 2, total: 42, present: 38, absent: 4 },
    { semester: 3, total: 38, present: 32, absent: 6 },
    { semester: 4, total: 40, present: 40, absent: 0 },
  ];

  useEffect(()=>{
    if(responseAtt!=null && responseAtt.status == 1){
        setAtt(responseAtt.data);
    }
  },[responseAtt])

  const semesters = Array.from({ length: 12 }, (_, i) => `${i + 1}`);

  const selectedData =
    dummyAttendance.find((d) => d.semester === parseInt(selectedSemester)) ||
    {};

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance</Text>
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

        {/* Attendance Card */}
        <View style={styles.card}>
          <Text style={styles.semesterTitle}>
            Semester {selectedSemester} Attendance
          </Text>

          {att!=null && att.length>0 ? (
            <View style={styles.attendanceBox}>
              <View style={styles.row}>
                <Text style={styles.label}>Total Classes:</Text>
                <Text style={styles.value}>{att[0].totalClasses}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Present:</Text>
                <Text style={[styles.value, { color: "green" }]}>
                  {att[0].presentClasses}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Absent:</Text>
                <Text style={[styles.value, { color: "red" }]}>
                  {att[0].missedClasses}
                </Text>
              </View>

              <View style={[styles.row, { marginTop: 8 }]}>
                <Text style={styles.label}>Attendance Percentage:</Text>
                <Text style={[styles.value, { color: appColors.primaryColor }]}>
                  {(
                    (att[0].presentClasses / att[0].totalClasses) *
                    100
                  ).toFixed(1)}
                  %
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>
              No attendance data for this semester
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4FF" },
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: appColors.primaryColor,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  semesterScroll: { paddingHorizontal:8, marginBottom: 20 },
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
    marginBottom: 12,
  },
  attendanceBox: {
    borderRadius: 10,
    backgroundColor: "#F9FAFF",
    padding: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: { fontSize: 16, color: "#333", fontWeight: "600" },
  value: { fontSize: 16, fontWeight: "700", color: "#222" },
  noDataText: {
    textAlign: "center",
    color: "#777",
    marginVertical: 20,
    fontSize: 16,
  },
});
