import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hitNotificationApi } from "../../redux/GetNotificationsSlice";
import { appColors } from "../../utils/color";
import BackIcon from "../../assets/svgs/BackIcon";
import moment from "moment";
import { Bell } from "lucide-react-native"; // modern icon
import { hitDashboardApi } from "../../redux/DashboardSlice";

const Notification = ({ navigation }) => {
  const [notifications, setNotifications] = useState(null);
  const [isProgress, setIsProgress] = useState(false);

  const responseNotifications = useSelector(
    (state) => state.getNotificationsReducer.data
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hitDashboardApi());
    setIsProgress(true);
    dispatch(hitNotificationApi());
  }, []);

  useEffect(() => {
    if (responseNotifications && responseNotifications.status === 1) {
      setIsProgress(false);
      setNotifications(responseNotifications.data.list);
    }
  }, [responseNotifications]);

  const renderNotification = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={()=>onItemClick(item.type)}>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.date}>{moment(item.createdAt).format("DD MMM, YYYY")}</Text>
      </View>
    </TouchableOpacity>
  );

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
      </View>

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
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No new notifications</Text>
          <Text style={styles.subText}>
            You’ll see your updates and alerts here when they arrive.
          </Text>
        </View>
      )}
    </View>
  );
};

export default Notification;

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
});