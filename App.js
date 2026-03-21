import { NewAppScreen } from "@react-native/new-app-screen";
import {
  Alert,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./src/screens/Login";
import SignUp from "./src/screens/SignUp";
import UniversityInfo from "./src/screens/CreateProfile/UniversityInfo";
import StudentDetials from "./src/screens/CreateProfile/StudentDetails";
import ParentDetials from "./src/screens/CreateProfile/ParentDetails";
import StudentAddress from "./src/screens/CreateProfile/StudentAddress";
import { appColors } from "./src/utils/color";
import DocumentUpload from "./src/screens/CreateProfile/DocumentUpload";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import ProfileScreen from "./src/screens/ProfileScreen.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import ViewImage from "./src/screens/ViewImage/Index.js";
import messaging from "@react-native-firebase/messaging";
import BottomBar from "./src/navigation/BottomBar.js";
import ProfileOptios from "./src/screens/ProfileOptions/index.js";
import StylishAlert from "./src/components/StylishAlert.js";
import ApplyTelex from "./src/screens/ApplyTelex/index.js";
import ResultScreen from "./src/screens/ResultScreen/index.js";
import Attendance from "./src/screens/Attendance/index.js";
import DigitalCard from "./src/screens/DigitalCard/index.js";
import IssueReportScreen from "./src/screens/IssueReportScreen/index.js";
import IssueListScreen from "./src/screens/IssueListScreen/index.js";
import PDFViewer from "./src/screens/PDFViewer/index.js";
import PdfRecreatedScreen from "./src/screens/PdfRecreatedScreen/index.js";
import Achivements from "./src/screens/Achivements/index.js";
import ForgotPassword from "./src/screens/ForgotPassword/index.js";
import ImageViewer from "./src/screens/ImageViewer/index.js";
import AlumniDetails from "./src/screens/AlumniDetails/index.js";
import UploadAlumniDocuments from "./src/screens/UploadAlumniDocuments.js/index.js";
import useScreenSecurity from "./src/utils/useScreenSecurity.js";
import UserTypeScreen from "./src/screens/UserTypeScreen/index.js";
import PartnerLogin from "./src/screens/Partner/Login/PartnerLogin.js";
import UpdateProfile from "./src/screens/Partner/UpdateProfile/index.js";
import StudentList from "./src/screens/Partner/StudentList/index.js";
import AddStudent from "./src/screens/Partner/AddStudent/index.js";
import StudentDetails from "./src/screens/Partner/StudentDetails/index.js";

const Stack = createNativeStackNavigator();

// Simple UI component to show messages
function NotificationCenter({ messages }) {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Received messages</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, i) => `${i}`}
        renderItem={({ item }) => (
          <View
            style={{
              marginBottom: 10,
              padding: 10,
              borderWidth: 1,
              borderRadius: 8,
            }}
          >
            <Text>From: {item.from || "FCM"}</Text>
            <Text>Title: {item.notification?.title || "—"}</Text>
            <Text>
              Body: {item.notification?.body || JSON.stringify(item.data)}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>No messages yet</Text>}
      />
    </View>
  );
}

const App = () => {
  // const isDarkMode = useColorScheme() === "dark";
  const [initialRoute, setInitialRoute] = useState(null);

  const [fcmToken, setFcmToken] = useState(null);
  const [messages, setMessages] = useState([]);
  const onMessageListenerRef = useRef(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: "", message: "" });

  // useEffect(() => {
  //   if (RNDetector && RNDetector.addListener) {
  //     const subscription = RNDetector.addListener('screenCaptureChanged', (captured) => {
  //       if (captured) {
  //         Alert.alert('Warning', 'Screen capture detected!');
  //       }
  //     });

  //     return () => subscription.remove();
  //   } else {
  //     console.warn('RNDetector is not available. iOS screenshot detection will not work.');
  //   }
  // }, []);

  // useEffect(() => {
    Platform.OS === "ios" &&
     useScreenSecurity();
  // }, []);

  useEffect(() => {
    if (!fcmToken) return;
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const step = await AsyncStorage.getItem("step");
        const studentType = await AsyncStorage.getItem("userType");
        console.log("Token found:", token, "Step ===> ", step, "Type ===> ", studentType);
        if (token) {
          if (studentType == 3) {
            const screen = "BottomBar";
            setInitialRoute(screen);
            return;
          }
          if (studentType == 2) {
            const screen = "BottomBar";
            setInitialRoute(screen);
            return;
          }
          else {
            if (step == 6) {
              setInitialRoute("BottomBar");
            } else {
              setInitialRoute("UserType");
            }
          }
        } else {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("step");
          setInitialRoute("UserType");
        }
      } catch (e) {
        console.error("Error reading token:", e);
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("step");
        setInitialRoute("UserType"); // fallback
      }
    };

    checkToken();
  }, [fcmToken]);

  useEffect(() => {
    console.log("Initial Route ===> ", initialRoute)
  }, [initialRoute])

  // Request permissions (iOS requires explicit request; Android API 33+ requires POST_NOTIFICATIONS)
  async function requestUserPermission() {
    try {
      console.log("REquest Permision");
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("[FCM] Authorization status:", authStatus);
      } else {
        console.log("[FCM] Permission denied:", authStatus);
      }
    } catch (err) {
      console.warn("[FCM] requestPermission error", err);
    }
  }

  // Get (and refresh) FCM token
  async function getAndSaveToken() {
    try {
      const token = await messaging().getToken();
      console.log("[FCM] Device token:", token);
      saveToken(token);

      console.log("Token call");
      // Save token to your server if needed
    } catch (err) {
      console.warn("[FCM] getToken error", err);
    }
  }

  const saveToken = async (token) => {
    console.log("[FCM] Token refreshed:", token);
    await AsyncStorage.setItem("fcmToken", token);
    setFcmToken(token);
  };

  useEffect(() => {
    // 1) Request permission (for iOS, and Android 13+)
    requestUserPermission();

    // 2) Get token
    getAndSaveToken();

    // 3) Listen for token refreshes
    const tokenUnsubscribe = messaging().onTokenRefresh((token) => {
      setFcmToken(token);
      // update your server...
    });

    // 4) Foreground message handler (onMessage)
    onMessageListenerRef.current = messaging().onMessage(
      async (remoteMessage) => {
        console.log("[FCM] Foreground message:", remoteMessage);
        // You can show an in-app alert / local notification here
        // Alert.alert(
        //   remoteMessage.data.title,
        //   remoteMessage.notification.body || remoteMessage.data
        // );

        setAlertData({
          title: remoteMessage.data?.title || remoteMessage.notification?.title || "Notification",
          message: remoteMessage.notification?.body || JSON.stringify(remoteMessage.data),
        });
        setAlertVisible(true);
        // store message to display in UI
        setMessages((prev) => [remoteMessage, ...prev]);
      }
    );

    // 5) When a notification opens the app from background state
    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log(
          "[FCM] Notification caused app to open from background state:",
          remoteMessage
        );
        if (remoteMessage) {
          setMessages((prev) => [remoteMessage, ...prev]);
        }
      }
    );

    // 6) Check whether an initial notification opened the app from a quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "[FCM] App opened from quit state by notification:",
            remoteMessage
          );
          setMessages((prev) => [remoteMessage, ...prev]);
        }
      });

    // Cleanup on unmount
    return () => {
      tokenUnsubscribe();
      if (onMessageListenerRef.current) onMessageListenerRef.current();
      unsubscribeNotificationOpened();
    };
  }, []);

  if (initialRoute === null) {
    // Optional: show splash/loading screen
    return null;
  }

  return (
    <>
      <StatusBar
        barStyle="dark-content" // or "dark-content"
        backgroundColor={appColors.primaryColorLight} // match your app header color
      />
      <Provider store={store}>
        <NavigationContainer>
          <View style={{ flex: 1 }}>
            {/* 🔔 Show Notification Center at top */}
            {/* <NotificationCenter messages={messages} /> */}
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName={initialRoute}
            >
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ title: "Login" }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{ title: "SignUp" }}
              />
              <Stack.Screen name="BottomBar" component={BottomBar} />
              <Stack.Screen
                name="UniversityInfo"
                component={UniversityInfo}
                options={{ title: "UniversityInfo" }}
                initialParams={{ from: 1 }}
              />
              <Stack.Screen
                name="StudentDetials"
                component={StudentDetials}
                options={{ title: "StudentDetials" }}
                initialParams={{ from: 1 }}
              />
              <Stack.Screen
                name="ParentDetials"
                component={ParentDetials}
                options={{ title: "ParentDetials" }}
                initialParams={{ from: 1 }}
              />
              <Stack.Screen
                name="StudentAddress"
                component={StudentAddress}
                options={{ title: "StudentAddress" }}
                initialParams={{ from: 1 }}
              />
              <Stack.Screen
                name="DocumentUpload"
                component={DocumentUpload}
                options={{ title: "DocumentUpload" }}
                initialParams={{ from: 1 }}
              />
              {/* <Stack.Screen
                  name="ProfileScreen"
                  component={ProfileScreen}
                  options={{ title: "ProfileScreen" }}
                /> */}
              <Stack.Screen
                name="ViewImage"
                component={ViewImage}
                options={{ title: "ViewImage" }}
              />
              <Stack.Screen
                name="ProfileOptios"
                component={ProfileOptios}
                options={{ title: "ProfileOptios" }}
              />
              <Stack.Screen
                name="ApplyTelex"
                component={ApplyTelex}
                options={{ title: "ApplyTelex" }}
              />
              <Stack.Screen
                name="ResultScreen"
                component={ResultScreen}
                options={{ title: "ResultScreen" }}
              />
              <Stack.Screen
                name="Attendance"
                component={Attendance}
                options={{ title: "Attendance" }}
              />
              <Stack.Screen
                name="DigitalCard"
                component={DigitalCard}
                options={{ title: "DigitalCard" }}
              />
              <Stack.Screen
                name="IssueReportScreen"
                component={IssueReportScreen}
                options={{ title: "IssueReportScreen" }}
              />
              <Stack.Screen
                name="IssueListScreen"
                component={IssueListScreen}
                options={{ title: "IssueListScreen" }}
              />
              <Stack.Screen
                name="PdfRecreatedScreen"
                component={PdfRecreatedScreen}
                options={{ title: "PdfRecreatedScreen" }}
              />
              <Stack.Screen
                name="Achivements"
                component={Achivements}
                options={{ title: "Achivements" }}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{ title: "ForgotPassword" }}
              />
              <Stack.Screen
                name="ImageViewer"
                component={ImageViewer}
                options={{ title: "ImageViewer" }}
              />
              <Stack.Screen
                name="AlumniDetails"
                component={AlumniDetails}
                options={{ title: "AlumniDetails" }}
              />
              <Stack.Screen
                name="UploadAlumniDocuments"
                component={UploadAlumniDocuments}
                options={{ title: "UploadAlumniDocuments" }}
              />
              <Stack.Screen name="UserType" component={UserTypeScreen} />
              <Stack.Screen name="PartnerLogin" component={PartnerLogin} />
              <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
              <Stack.Screen name="StudentList" component={StudentList} />
              <Stack.Screen name="AddStudent" component={AddStudent} />
              <Stack.Screen name="StudentDetails" component={StudentDetails} />
            </Stack.Navigator>
          </View>
        </NavigationContainer>
        <StylishAlert
          visible={alertVisible}
          title={alertData.title}
          message={alertData.message}
          onClose={() => setAlertVisible(false)}
        />
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

