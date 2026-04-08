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
import ShowEyeIcon from "../../../assets/svgs/ShowEyeIcon";
import HideEyeIcon from "../../../assets/svgs/HideEyeIcon";
import { useDispatch, useSelector } from "react-redux";
import BackIcon from "../../../assets/svgs/BackIcon";
import { appColors } from "../../../utils/color";
import {
  hitGetAgentDetails,
  clearGetAgentDetails,
} from "../../../redux/admin_apis/AdminAgentDetailSlice";
import { hitAdminUpdateAgent, clearAdminUpdateAgent } from "../../../redux/admin_apis/AdminUpdateAgentSlice";
import { hitAdminDeleteAgent, clearAdminDeleteAgent } from "../../../redux/admin_apis/AdminDeleteAgentSlice";
import { hitSendNotificationSingle } from "../../../redux/GetNotificationsSlice";

const AdminAgentDetails = ({ navigation, route }) => {
  const agentParam = route.params?.agent;
  const [id, setId] = useState(agentParam?._id || agentParam?.agentId || "");
  const [name, setName] = useState(agentParam?.name || "");
  const [email, setEmail] = useState(agentParam?.email || "");
  const [password, setPassword] = useState(agentParam?.password || "");
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationDescription, setNotificationDescription] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(agentParam?.mobileNumber || "");

  const dispatch = useDispatch();
  const { isLoading: isDetailsLoading, data: detailsData } = useSelector(
    (state) => state.getAgentDetailsReducer
  );
  const { isLoading: isUpdating } = useSelector((state) => state.adminUpdateAgentReducer);
  const { isLoading: isDeleting } = useSelector((state) => state.adminDeleteAgentReducer);
  const { isSendingSingle } = useSelector((state) => state.getNotificationsReducer);

  useEffect(() => {
    if (!agentParam) {
      const payload = { agentId: id };
      dispatch(hitGetAgentDetails(payload));
    }

    return () => {
      dispatch(clearGetAgentDetails());
      dispatch(clearAdminUpdateAgent());
      dispatch(clearAdminDeleteAgent());
    };
  }, [agentParam, dispatch, id]);

  useEffect(() => {
    if (detailsData?.data) {
      const agent = detailsData.data;
      setName(agent.name || "");
      setEmail(agent.email || "");
      setPassword(agent.password || agent.defaultPassword || "");
      setMobileNumber(agent.mobileNumber || agent.mobile || "");
      setId(agent._id || agent.agentId || id);
    }
  }, [detailsData, id]);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleUpdate = async () => {
    if (!name || !email || !password || !mobileNumber) {
      Alert.alert("Validation error", "Please fill all required fields.");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Validation error", "Please enter a valid email address.");
      return;
    }

    const payload = {
      agentId: id,
      name,
      email,
      password,
      mobileNumber,
    };

    const resultAction = await dispatch(hitAdminUpdateAgent(payload));
    if (hitAdminUpdateAgent.fulfilled.match(resultAction)) {
      Alert.alert("Success", "Agent updated successfully.", [
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
      "Are you sure you want to delete this agent?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const payload = { agentId: id,isDeleted:1};
            const resultAction = await dispatch(hitAdminDeleteAgent(payload));
            if (hitAdminDeleteAgent.fulfilled.match(resultAction)) {
              Alert.alert("Deleted", "Agent deleted successfully.", [
                { text: "OK", onPress: () => navigation.navigate("AdminAgents") },
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

  const handleSendNotification = async () => {
    if (!id) {
      Alert.alert("Notification", "Agent ID is not available to send notification.");
      return;
    }
    if (!notificationTitle.trim() || !notificationDescription.trim()) {
      Alert.alert("Validation", "Please enter both title and description.");
      return;
    }

    const payload = {
      agentId: id,
      title: notificationTitle.trim(),
      description: notificationDescription.trim(),
    };

    const resultAction = await dispatch(hitSendNotificationSingle(payload));
    if (hitSendNotificationSingle.fulfilled.match(resultAction)) {
      Alert.alert("Success", "Notification sent successfully.");
      setNotificationTitle("");
      setNotificationDescription("");
      setShowNotificationForm(false);
    } else {
      const errorMessage = resultAction.payload?.message || resultAction.error?.message || "Unable to send notification.";
      Alert.alert("Error", errorMessage);
    }
  };

  const loading = isDetailsLoading || isUpdating || isDeleting;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={28} width={28} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Agent Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {loading ? (
          <ActivityIndicator color={appColors.primaryColor} size="large" style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Name" />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                value={mobileNumber}
                onChangeText={setMobileNumber}
                style={styles.input}
                placeholder="Mobile Number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? (
                    <HideEyeIcon width={20} height={20} fill={appColors.primaryColor} />
                  ) : (
                    <ShowEyeIcon width={20} height={20} fill={appColors.primaryColor} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={isUpdating}>
              <Text style={styles.updateText}>{isUpdating ? "Updating..." : "Update Agent"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={isDeleting}>
              <Text style={styles.deleteText}>{isDeleting ? "Deleting..." : "Delete Agent"}</Text>
            </TouchableOpacity>
            <View style={styles.notificationCard}>
              <Text style={styles.sectionTitle}>Send Notification</Text>
              <TextInput
                style={styles.notificationInput}
                value={notificationTitle}
                onChangeText={setNotificationTitle}
                placeholder="Title"
                placeholderTextColor="#999"
              />
              <TextInput
                style={[styles.notificationInput, { height: 100, textAlignVertical: 'top' }]}
                value={notificationDescription}
                onChangeText={setNotificationDescription}
                placeholder="Description"
                placeholderTextColor="#999"
                multiline
              />
              <TouchableOpacity
                style={[styles.sendButton, { marginTop: 8 }]}
                onPress={handleSendNotification}
                disabled={isSendingSingle}
              >
                <Text style={styles.sendButtonText}>
                  {isSendingSingle ? "Sending..." : "Send Notification"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminAgentDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.white },
  header: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: appColors.primaryColor },
  headerText: { flex: 1, textAlign: "center", color: appColors.white, fontSize: 18, fontWeight: "700", marginRight: 30 },
  content: { padding: 16, paddingBottom: 40 },
  field: { marginBottom: 16 },
  label: { marginBottom: 8, fontWeight: "600", color: appColors.black },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, backgroundColor: "#F2F2F2" },
  dropdown: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, backgroundColor: "#F2F2F2" },
  dropdownList: { marginTop: 8, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, backgroundColor: "#fff" },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  dropdownItemText: { color: appColors.black },
  passwordContainer: { flexDirection: "row", alignItems: "center" },
  eyeButton: { marginLeft: 10, padding: 8 },
  eyeText: { color: appColors.primaryColor, fontWeight: "700" },
  updateButton: { backgroundColor: appColors.primaryColor, padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  updateText: { color: "#fff", fontWeight: "700" },
  deleteButton: { backgroundColor: appColors.red, padding: 14, borderRadius: 8, alignItems: "center" },
  deleteText: { color: "#fff", fontWeight: "700" },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  notificationInput: {
    backgroundColor: "#F7F9FC",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    color: appColors.black,
  },
  sendButton: {
    backgroundColor: appColors.primaryColor,
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    alignItems: "center",
  },
  sendButtonText: {
    color: appColors.white,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
