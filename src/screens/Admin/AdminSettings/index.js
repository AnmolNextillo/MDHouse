import React, { useEffect, useState } from "react";
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
import { hitGetSettings, clearGetSettings } from "../../../redux/admin_apis/GetSettingsSlice";
import { hitUpdateSettings, clearUpdateSettings } from "../../../redux/admin_apis/UpdateSettingsSlice";

const AdminSettings = ({ navigation }) => {
  const [totalMedicalStudentGuided, setTotalMedicalStudentGuided] = useState("");
  const [totalPartnerUniversities, setTotalPartnerUniversities] = useState("");
  const [totalSuccessfulDoctors, setTotalSuccessfulDoctors] = useState("");

  const dispatch = useDispatch();
  const { isLoading: isGetSettingsLoading, data: getSettingsData } = useSelector(
    (state) => state.getSettingsReducer
  );
  const { isLoading: isUpdateSettingsLoading } = useSelector((state) => state.updateSettingsReducer);

  useEffect(() => {
    fetchSettings();

    return () => {
      dispatch(clearGetSettings());
      dispatch(clearUpdateSettings());
    };
  }, [dispatch]);

  useEffect(() => {
    if (getSettingsData?.data) {
      const settings = getSettingsData.data;
      setTotalMedicalStudentGuided(settings.totalMedicalStudentGuided?.toString() || "");
      setTotalPartnerUniversities(settings.totalPartnerUniversities?.toString() || "");
      setTotalSuccessfulDoctors(settings.totalSuccessfullDoctors?.toString() || "");
    }
  }, [getSettingsData]);

  const fetchSettings = async () => {
    try {
      await dispatch(hitGetSettings()).unwrap();
    } catch (e) {
      console.log("Get Settings API Error:", e);
      Alert.alert("Error", "Failed to load settings");
    }
  };

  const handleUpdate = async () => {
    // Validation
    if (!totalMedicalStudentGuided.trim() || !totalPartnerUniversities.trim() || !totalSuccessfulDoctors.trim()) {
      Alert.alert("Validation error", "Please fill all fields.");
      return;
    }

    const guidedNum = parseInt(totalMedicalStudentGuided);
    const universitiesNum = parseInt(totalPartnerUniversities);
    const doctorsNum = parseInt(totalSuccessfulDoctors);

    if (isNaN(guidedNum) || guidedNum < 0) {
      Alert.alert("Validation error", "Total Medical Student Guided must be a valid non-negative number.");
      return;
    }

    if (isNaN(universitiesNum) || universitiesNum < 0) {
      Alert.alert("Validation error", "Total Partner Universities must be a valid non-negative number.");
      return;
    }

    if (isNaN(doctorsNum) || doctorsNum < 0) {
      Alert.alert("Validation error", "Total Successful Doctors must be a valid non-negative number.");
      return;
    }

    const payload = {
      totalMedicalStudentGuided: guidedNum,
      totalPartnerUniversities: universitiesNum,
      totalSuccessfullDoctors: doctorsNum,
    };

    const resultAction = await dispatch(hitUpdateSettings(payload));
    if (hitUpdateSettings.fulfilled.match(resultAction)) {
      Alert.alert("Success", "Settings updated successfully.", [
        { text: "OK" },
      ]);
    } else {
      const err = resultAction.payload || resultAction.error?.message || "Update failed";
      Alert.alert("Error", err);
    }
  };

  const loading = isGetSettingsLoading || isUpdateSettingsLoading;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={28} width={28} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {loading ? (
          <ActivityIndicator color={appColors.primaryColor} size="large" style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Total Medical Student Guided</Text>
              <TextInput
                value={totalMedicalStudentGuided}
                onChangeText={setTotalMedicalStudentGuided}
                style={styles.input}
                placeholder="Enter number"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Total Partner Universities</Text>
              <TextInput
                value={totalPartnerUniversities}
                onChangeText={setTotalPartnerUniversities}
                style={styles.input}
                placeholder="Enter number"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Total Successful Doctors</Text>
              <TextInput
                value={totalSuccessfulDoctors}
                onChangeText={setTotalSuccessfulDoctors}
                style={styles.input}
                placeholder="Enter number"
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={isUpdateSettingsLoading}>
              <Text style={styles.updateText}>
                {isUpdateSettingsLoading ? "Updating..." : "Update Settings"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminSettings;

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
});