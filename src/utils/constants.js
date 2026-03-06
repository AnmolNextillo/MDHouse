
import { PermissionsAndroid, Platform } from "react-native";
export const ApiBaseUrl = "https://api-mdhouse.erptech.info/v1/student/"

export const signUp = "signUp";
export const login  = "login";
export const forgot  = "forgotPassword";
export const updateProfile  = "updateProfile";
export const profile  = "profile";
export const deleteAccount  = "delete";
export const versions  = "versions";
export const notifications  = "notifications";
export const getChat  = "getChat";
export const sendMessage  = "sendMessage";
export const dashboard  = "dashboard";
export const getUniversityList  = "getUniversityList";
export const googleLogin  = "googleLogin";
export const getTelexRecord  = "getTelexRecord";
export const getAgentList  = "getAgentList";
export const applyForTelex  = "applyForTelex";
export const getResult  = "getResult";
export const issueReports  = "issueReports";
export const settings  = "settings";
export const getGallery  = "gallery";
export const studentAchievements  = "studentAchievements";
export const getAttendance  = "getAttendance";
export const home  = "home";


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