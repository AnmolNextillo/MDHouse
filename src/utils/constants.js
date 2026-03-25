
import { PermissionsAndroid, Platform } from "react-native";
export const ApiBaseUrl = "https://api-mdhouse.erptech.info/v1/"

export const signUp = "student/signUp";
export const login  = "student/login";
export const forgot  = "student/forgotPassword";
export const updateProfile  = "student/updateProfile";
export const profile  = "student/profile";
export const deleteAccount  = "student/delete";
export const versions  = "student/versions";
export const notifications  = "student/notifications";
export const getChat  = "student/getChat";
export const sendMessage  = "student/sendMessage";
export const dashboard  = "student/dashboard";
export const getUniversityList  = "student/getUniversityList";
export const googleLogin  = "student/googleLogin";
export const getTelexRecord  = "student/getTelexRecord";
export const getAgentList  = "student/getAgentList";
export const applyForTelex  = "student/applyForTelex";
export const getResult  = "student/getResult";
export const issueReports  = "student/issueReports";
export const settings  = "student/settings";
export const getGallery  = "student/getGallery";
export const studentAchievements  = "student/studentAchievements";
export const getAttendance  = "student/getAttendance";
export const home  = "student/home";
export const checkUser  = "checkUser";

// Partner APIs
export const partnerLogin  = "agent/login";
export const partnerProfile  = "agent/getProfile";
export const agentUpdateProfile  = "agent/updateProfile";
export const agentStudentList  = "agent/studentList";
export const agentAddStudent  = "agent/addStudent";
export const agentUpdateStudent  = "agent/updateStudent";
export const agentNotifications  = "agent/notifications";
export const agentDashboard  = "agent/dashboard";
export const getChatWithAdmin  = "agent/getChatWithAdmin";
export const sendMessageToAdmin  = "agent/sendMessageToAdmin";


export async function requestAllPermissions() {
  try {
    if (Platform.OS === "android") {
      const sdk = Platform.constants?.Release; // Android API level

      let permissions = [];

      if (Platform.Version >= 33) {
        // Android 13+
        permissions = [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VISUAL_USER_SELECTED, // optional, new in 14
        ];
      } else {
        // Older Android
        permissions = [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ];
      }

      const granted = await PermissionsAndroid.requestMultiple(permissions);
        console.log("Granted ===> ",granted)

      const allGranted = Object.values(granted).every(
        (status) => status === PermissionsAndroid.RESULTS.GRANTED
      );

      console.log("All Granted ===> ",allGranted)

      return allGranted;
    }
    return true; // iOS handled by Info.plist
  } catch (err) {
    console.warn("Permission error:", err);
    return false;
  }
}