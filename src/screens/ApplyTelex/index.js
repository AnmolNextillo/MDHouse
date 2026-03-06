import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  SafeAreaView,
  Linking,
} from "react-native";
import ImageCropPicker from "react-native-image-crop-picker";
import { appColors } from "../../utils/color";
import { useDispatch, useSelector } from "react-redux";
import { clearTelexRecord, hitTelexRecord } from "../../redux/GetTelexRecordSlice";
import { clearUploadFileData, uploadFile } from "../../redux/uploadFile";
import { clearAgentList, hitAgentList } from "../../redux/AgentListSlice";
import { clearApplyTelex, hitApplyTelex } from "../../redux/ApplyForTelexSlice";
import BackIcon from "../../assets/svgs/BackIcon";
import { requestAllPermissions } from "../../utils/constants";

const ApplyTelex = ({ navigation }) => {
  const [receipt, setReceipt] = useState(null);
  const [clearedDue, setClearedDue] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [selectedConsultantId, setSelectedConsultantId] = useState(0);
  const [customConsultant, setCustomConsultant] = useState("");
  const [receiptUrl, setReceiptUrl] = useState(null);
  const [showConsultantModal, setShowConsultantModal] = useState(false);

  const [consultants, setConsultants] = useState([]);

  const dispatch = useDispatch();

  const responseUploadImage = useSelector((state) => state.uploadFileReducer.data);
  const responseAgent = useSelector((state) => state.agentsReducer.data);
  const responseTelexRecord = useSelector((state) => state.telexRecordReducer.data);
  const responseApplyTelex = useSelector((state) => state.applyTelexReducer.data);

  useEffect(() => {
    dispatch(hitTelexRecord());
    dispatch(hitAgentList());
  }, []);

  useEffect(() => {
    if (responseUploadImage != null) {
      setReceiptUrl(responseUploadImage.Location);
      dispatch(clearUploadFileData());
    }
  }, [responseUploadImage]);

  useEffect(() => {
    if (responseAgent != null && responseAgent.status == 1) {
      const simplifiedAgents = responseAgent.data.map((agent) => ({
        name: agent.name,
        agentId: agent._id,
      }));
      const otherAgent = { name: "Other", agentId: "" };
      setConsultants([...simplifiedAgents, otherAgent]);
      dispatch(clearAgentList());
    }
  }, [responseAgent]);

  useEffect(() => {
    if (responseApplyTelex != null && responseApplyTelex.status === 1) {
      Alert.alert(
        "Success!",
        `Telex application submitted under ${selectedConsultant === "Other" ? customConsultant : selectedConsultant
        }.`
      );
      navigation.goBack();
      dispatch(clearApplyTelex());
    }
  }, [responseApplyTelex]);

  useEffect(() => {
    if (responseTelexRecord != null && responseTelexRecord.data != null && responseTelexRecord.status == 1) {
      if (responseTelexRecord.data.status == 1 || responseTelexRecord.data.status == 2) {
        Alert.alert(
          "The MD House",
          "You have already applied for Telex.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(
          "The MD House",
          "Your telex rejected, please apply again.",
          [{ text: "OK" }]
        );
      }
    }
    dispatch(clearTelexRecord());
  }, [responseTelexRecord]);

  const pickReceipt = async () => {
    const hasPermission = await requestAllPermissions();
    console.log("Has Permission ===> ", hasPermission);
    if (hasPermission) {
      Alert.alert("Attach Receipt", "Choose a method", [
        {
          text: "Camera",
          onPress: () => {
            ImageCropPicker.openCamera({ width: 800, height: 800, cropping: true })
              .then((image) => {
                setReceipt({
                  uri: image.path,
                  mime: image.mime,
                  name: image.path.split("/").pop(),
                });
                dispatch(uploadFile({ uri: image.path, fileName: image.filename, type: image.mime }));
              })
              .catch((err) => {
                if (err.code === "E_NO_CAMERA_PERMISSION") {
                  showPermissionDeniedAlert();
                }
                console.log("❌ Camera error/cancel:", err.code);
              });
          },
        },
        {
          text: "Gallery",
          onPress: () => {
            ImageCropPicker.openPicker({ width: 800, height: 800, cropping: true })
              .then((image) => {
                setReceipt({
                  uri: image.path,
                  mime: image.mime,
                  name: image.path.split("/").pop(),
                });
                dispatch(uploadFile({ uri: image.path, fileName: image.filename, type: image.mime }));
              })
              .catch((err) => {
                if (err.code === "E_NO_LIBRARY_PERMISSION") {
                  showPermissionDeniedAlert();
                }
                console.log("❌ Gallery error/cancel:", err.code);
              });
          },
        },
        { text: "Cancel", style: "cancel" },
      ]); setModalVisible(true); // open your bottom sheet modal
    } else {
      showPermissionDeniedAlert();
      console.log("User denied permissions");
    }

  };

  function showPermissionDeniedAlert() {
    Alert.alert(
      "The MDHouse",
      "You denied permissions. Enable both camera and file permissions from settings.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            Linking.openSettings().catch(() => {
              Alert.alert("Error", "Unable to open settings");
            });
          },
        },
      ]
    );
  }


  const handleApply = () => {
    if (!receipt) return Alert.alert("Attach receipt first!");
    if (!clearedDue) return Alert.alert("Please confirm your dues cleared");
    if (!selectedConsultant && !customConsultant)
      return Alert.alert("Please select or enter consultant");

    const payload = {
      feeRecepit: receiptUrl,
      agentId: selectedConsultantId,
      agentName: selectedConsultant === "Other" ? customConsultant : selectedConsultant,
    };
    dispatch(hitApplyTelex(payload));
  };

  const onBackClick = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F0F4FF" }}>
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => onBackClick()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Apply For Telex</Text>
      </View>

      <ScrollView style={styles.container}>

        {/* Attach Receipt */}
        <View style={styles.card}>
          <Text style={styles.label}>Attach Tuition Fee Receipt</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={pickReceipt}>
            <Text style={styles.uploadText}>{receipt ? "Change Receipt" : "Upload Receipt"}</Text>
          </TouchableOpacity>
          {receipt && (
            <View style={styles.filePreview}>
              <Image source={{ uri: receipt.uri }} style={styles.thumb} />
              <Text style={styles.fileName} numberOfLines={1}>
                {receipt.name}
              </Text>
              <TouchableOpacity onPress={() => setReceipt(null)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Dues Confirmation */}
        <View style={styles.card}>
          <Text style={styles.label}>Have you cleared your dues?</Text>
          <View style={styles.choiceRow}>
            <TouchableOpacity
              onPress={() => setClearedDue(true)}
              style={[styles.choice, clearedDue ? styles.choiceActive : styles.choiceInactive]}
            >
              <Text style={[styles.choiceText, clearedDue && styles.choiceTextActive]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setClearedDue(false)}
              style={[styles.choice, !clearedDue ? styles.choiceActive : styles.choiceInactive]}
            >
              <Text style={[styles.choiceText, !clearedDue && styles.choiceTextActive]}>No</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Paid to Consultant */}
        <View style={styles.card}>
          <Text style={styles.label}>Paid to Consultant</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowConsultantModal(true)}
          >
            <Text style={{ color: selectedConsultant ? "#000" : "#999", fontSize: 16 }}>
              {selectedConsultant || "Select Consultant"}
            </Text>
          </TouchableOpacity>
          {selectedConsultant === "Other" && (
            <TextInput
              style={styles.input}
              placeholder="Enter Consultant Name"
              placeholderTextColor="#999"
              value={customConsultant}
              onChangeText={setCustomConsultant}
            />
          )}
        </View>

        {/* Modal */}
        <Modal visible={showConsultantModal} transparent animationType="slide">
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
            activeOpacity={1}
            onPressOut={() => setShowConsultantModal(false)}
          >
            <View
              style={{
                backgroundColor: "#fff",
                maxHeight: 400,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
                Select Consultant
              </Text>
              <FlatList
                data={consultants}
                keyExtractor={(item) => item.agentId || item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                    }}
                    onPress={() => {
                      setSelectedConsultant(item.name);
                      setSelectedConsultantId(item.agentId);
                      if (item.name !== "Other") setCustomConsultant("");
                      setShowConsultantModal(false);
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Apply Button */}
        <TouchableOpacity
          style={[
            styles.applyBtn,
            !(receipt && clearedDue && (selectedConsultant || customConsultant)) && { opacity: 0.6 },
          ]}
          disabled={!(receipt && clearedDue && (selectedConsultant || customConsultant)) || isApplying}
          onPress={handleApply}
        >
          {isApplying ? <ActivityIndicator color="#fff" /> : <Text style={styles.applyText}>Apply Now</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ApplyTelex;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4FF", padding: 16 },
  title: { fontSize: 24, fontWeight: "700", color: appColors.primaryColor, marginBottom: 16, textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  uploadBtn: { backgroundColor: appColors.primaryColor, paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  uploadText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  filePreview: { marginTop: 12, flexDirection: "row", alignItems: "center", backgroundColor: "#F5F7FF", padding: 10, borderRadius: 10 },
  thumb: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
  fileName: { flex: 1, fontWeight: "600", color: appColors.black },
  removeText: { color: appColors.red, fontWeight: "700" },
  choiceRow: { flexDirection: "row", marginTop: 8 },
  choice: { flex: 1, paddingVertical: 12, borderRadius: 10, marginRight: 8, alignItems: "center" },
  choiceActive: { backgroundColor: appColors.primaryColor },
  choiceInactive: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd" },
  choiceText: { fontWeight: "600", color: appColors.primaryColor },
  choiceTextActive: { color: "#fff" },
  dropdown: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 12, height: 50, justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginTop: 10, fontSize: 16 },
  applyBtn: { backgroundColor: appColors.primaryColor, paddingVertical: 16, borderRadius: 12, alignItems: "center", marginBottom: 40 },
  applyText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  headerStyle: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: appColors.primaryColor,
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    color: appColors.white,
    textAlign: "center",
    marginRight: 32,
    flex: 1,
  },
});
