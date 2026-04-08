import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  hitGetAllNotifications,
  hitSendNotification,
} from "../../../redux/GetNotificationsSlice";
import { appColors } from "../../../utils/color";
import BackIcon from "../../../assets/svgs/BackIcon";
import PlusIcon from "../../../assets/svgs/PlusIcon";
import CrossIcon from "../../../assets/svgs/CrossIcon";
import { hitDashboardApi } from "../../../redux/DashboardSlice";

const AdminNotifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState(null);
  const [isProgress, setIsProgress] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSending, setIsSending] = useState(false);

  const responseNotifications = useSelector(
    (state) => state.getNotificationsReducer.data
  );
  const responseSendNotification = useSelector(
    (state) => state.getNotificationsReducer.sendData
  );
  const responseSendError = useSelector(
    (state) => state.getNotificationsReducer.sendError
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hitDashboardApi());
    setIsProgress(true);
    dispatch(hitGetAllNotifications());
  }, []);

  useEffect(() => {
    if (responseSendNotification && responseSendNotification.status === 1) {
      Alert.alert("Success", "Notification sent successfully.");
      setTitle("");
      setDescription("");
      setSelectedType(1);
      dispatch(hitGetAllNotifications());
    }

    if (responseSendError) {
      Alert.alert("Error", responseSendError);
    }
  }, [responseSendNotification, responseSendError]);

  useEffect(() => {
    if (responseNotifications && responseNotifications.status === 1) {
      setIsProgress(false);
      setNotifications(responseNotifications.data.list);
    }
  }, [responseNotifications]);

  const notificationTargets = [
    { id: 1, label: "All Students" },
    { id: 2, label: "All Alumni" },
    { id: 3, label: "All Agents" },
  ];

  const renderNotification = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => onItemClick(item.type)}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.date}>{moment(item.createdAt).format("DD MMM, YYYY")}</Text>
      </View>
    </TouchableOpacity>
  );

  const sendNotification = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Please enter a notification title.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Validation", "Please enter a notification description.");
      return;
    }

    setIsSending(true);
    try {
      await dispatch(
        hitSendNotification({
          type: selectedType,
          title: title.trim(),
          description: description.trim(),
        })
      ).unwrap();
    } catch (error) {
      Alert.alert("Error", error?.message || "Failed to send notification.");
    } finally {
      setIsSending(false);
    }
  };

  const onItemClick = (type) => {
    // Handle notification click, e.g., navigate to details or mark as read
    switch (type) {
      case 1:
        navigation.navigate("Home");
        break;
      case 3:
        navigation.navigate("Gallery");
        break;
      case 4:
        navigation.navigate("ResultScreen");
        break;
      case 5:
        navigation.navigate("Attendance");
        break;
      case 6:
        navigation.navigate("Chat");
        break;
      case 7:
         navigation.navigate("DocumentUpload", { from: 3 });
        break;
      default:
        // Handle other types or do nothing
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <BackIcon height={28} width={28} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notifications</Text>
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => setShowForm((prev) => !prev)}
        >
          {showForm ? (
            <CrossIcon fill={appColors.white} width={16} height={16} />
          ) : (
            <PlusIcon fill={appColors.white} width={16} height={16} />
          )}
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Send Notification</Text>
        <View style={styles.radioContainer}>
          {notificationTargets.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.radioItem}
              onPress={() => setSelectedType(item.id)}
            >
              <View
                style={[
                  styles.radioOuter,
                  selectedType === item.id && styles.radioOuterSelected,
                ]}
              >
                {selectedType === item.id && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Notification Title"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Notification Description"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textArea]}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (isSending || isProgress) && styles.disabledButton,
          ]}
          onPress={sendNotification}
          disabled={isSending || isProgress}
        >
          <Text style={styles.sendButtonText}>
            {isSending ? "Sending..." : "Send"}
          </Text>
        </TouchableOpacity>
      </View>
      )}

      {!showForm && (
        <>
          {/* Loader / Content */}
          {isProgress ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={appColors.primaryColor} />
              <Text style={styles.loadingText}>Fetching notifications...</Text>
            </View>
          ) : notifications && notifications.length > 0 ? (
            <FlatList
              data={notifications}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderNotification}
              contentContainerStyle={styles.listContainer}
              ListHeaderComponent={<View style={{ height: 8 }} />}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No new notifications</Text>
              <Text style={styles.subText}>
                You’ll see your updates and alerts here when they arrive.
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default AdminNotifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: appColors.primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 10,
    elevation: 3,
  },
  backBtn: {
    paddingRight: 12,
  },
  headerText: {
    flex: 1,
    color: appColors.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginRight: 32,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: appColors.darkGray,
  },
  listContainer: {
    padding: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: appColors.lightGray,
    borderRadius: 25,
    padding: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: appColors.black,
    fontWeight: "700",
    fontSize: 16,
  },
  message: {
    color: appColors.darkGray,
    marginTop: 4,
    fontSize: 14,
  },
  date: {
    textAlign: "right",
    color: appColors.lightGray,
    fontSize: 12,
    marginTop: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: appColors.black,
    marginTop: 12,
  },
  subText: {
    color: appColors.darkGray,
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
  formContainer: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: appColors.black,
    marginBottom: 12,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: appColors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: appColors.primaryColor,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: appColors.primaryColor,
  },
  radioLabel: {
    flex: 1,
    fontSize: 14,
    color: appColors.black,
  },
  input: {
    backgroundColor: appColors.lightGray,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: appColors.black,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: appColors.primaryColor,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  sendButtonText: {
    color: appColors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.6,
  },
  headerAction: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: appColors.white,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  headerActionIcon: {
    transform: [{ rotate: "0deg" }],
  },
  headerActionIconCross: {
    transform: [{ rotate: "45deg" }],
  },
  headerActionText: {
    color: appColors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});