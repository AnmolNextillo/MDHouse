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
import { hitAdminAddAgent, clearAdminAddAgent } from "../../../redux/admin_apis/AdminAddAgentSlice";

const AdminAddAgent = ({ navigation }) => {
  const [name, setName] = useState("");
  const [agentId, setAgentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [agentType, setAgentType] = useState("");
  const [agentTypeOpen, setAgentTypeOpen] = useState(false);

  const agentTypeOptions = [
    { value: "1", label: "Agent" },
    { value: "2", label: "University Agent" },
  ];

  const dispatch = useDispatch();
  const { isLoading, data, error } = useSelector((state) => state.adminAddAgentReducer);

  const handleSubmit = async () => {
    if (!name || !agentId || !email || !password || !mobileNumber || !agentType) {
      Alert.alert("Validation error", "Please fill all fields and select agent type.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation error", "Please enter a valid email address.");
      return;
    }

    try {
      const payload = {
        name,
        agentId,
        email,
        password,
        mobileNumber,
        agentType,
      };

      const resultAction = await dispatch(hitAdminAddAgent(payload));
      if (hitAdminAddAgent.fulfilled.match(resultAction)) {
        Alert.alert("Success", "Agent created successfully.", [
          {
            text: "OK",
            onPress: () => {
              dispatch(clearAdminAddAgent());
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
      Alert.alert("Error", "Failed to add agent");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={28} width={28} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Agent</Text>
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
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Agent ID</Text>
            <TextInput
              value={agentId}
              onChangeText={setAgentId}
              style={styles.input}
              placeholder="Enter agent ID"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              value={mobileNumber}
              onChangeText={setMobileNumber}
              style={styles.input}
              placeholder="Enter mobile number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Agent Type</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setAgentTypeOpen(!agentTypeOpen)}
            >
              <Text
                style={{
                  color: agentType ? appColors.black : "#999",
                  fontSize: 14,
                }}
              >
                {agentType
                  ? agentTypeOptions.find((item) => item.value === agentType)
                      ?.label
                  : "Select agent type"}
              </Text>
            </TouchableOpacity>

            {agentTypeOpen && (
              <View style={styles.dropdownList}>
                {agentTypeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setAgentType(option.value);
                      setAgentTypeOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
              <Text style={styles.submitText}>Create Agent</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdminAddAgent;

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
  dropdown: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
  },
  dropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: 14,
    color: appColors.black,
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
