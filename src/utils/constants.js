
import { PermissionsAndroid, Platform } from "react-native";
export const ApiBaseUrl = "https://api-mdhouse.erptech.info/"

export const signUp = "v1/student/signUp";
export const login  = "v1/student/login";
export const loginV2  = "v2/student/login";
export const forgot  = "v1/student/forgotPassword";
export const updateProfile  = "v1/student/updateProfile";
export const profile  = "v1/student/profile";
export const deleteAccount  = "v1/student/delete";
export const versions  = "v1/student/versions";
export const notifications  = "v1/student/notifications";
export const getChat  = "v1/student/getChat";
export const sendMessage  = "v1/student/sendMessage";
export const dashboard  = "v1/student/dashboard";
export const getUniversityList  = "v1/student/getUniversityList";
export const googleLogin  = "v1/student/googleLogin";
export const getTelexRecord  = "v1/student/getTelexRecord";
export const getAgentList  = "v1/student/getAgentList";
export const applyForTelex  = "v1/student/applyForTelex";
export const getResult  = "v1/student/getResult";
export const issueReports  = "v1/student/issueReports";
export const settings  = "v1/student/settings";
export const getGallery  = "v1/student/getGallery";
export const studentAchievements  = "v1/student/studentAchievements";
export const getAttendance  = "v1/student/getAttendance";
export const home  = "v1/student/home";
export const checkUser  = "v1/checkUser";
export const studentOtp  = "v2/student/otpVerification";
export const studentResendOtp  = "v2/student/resendOtp";

// Partner APIs
export const partnerLogin  = "v2/agent/login";
export const partnerProfile  = "v1/agent/getProfile";
export const agentUpdateProfile  = "v1/agent/updateProfile";
export const agentStudentList  = "v1/agent/studentList";
export const agentAddStudent  = "v1/agent/addStudent";
export const agentUpdateStudent  = "v1/agent/updateStudent";
export const agentNotifications  = "v1/agent/notifications";
export const agentDashboard  = "v1/agent/dashboard";
export const getChatWithAdmin  = "v1/agent/getChatWithAdmin";
export const sendMessageToAdmin  = "v1/agent/sendMessageToAdmin";
export const getStudentDetails  = "v1/agent/getStudentDetails";
export const agentOtp  = "v2/agent/otpVerification";
export const agentResendOtp  = "v2/agent/resendOtp";
export const printStudentRecord  = "v1/agent/printStudentRecord";

// Admin APIs
export const adminLogin  = "v1/admin/login";
export const adminAgents  = "v1/admin/agents";
export const adminAgentDetails  = "v1/admin/agentDetails";
export const adminAddAgent = "v1/admin/addAgent";
export const adminUpdateAgent = "v1/admin/agents";
export const adminDeleteAgent = "v1/admin/agents";
export const getStudents = "v1/admin/studentList";
export const adminGetStudentResult = "v1/admin/getStudentResult";
export const adminAddStudentResult = "v1/admin/addStudentResult";
export const adminUpdateStudentResult = "v1/admin/updateStudentResult";
export const adminAddStudentAttendance = "v1/admin/addStudentAttendance";
// Universities APIs
export const adminUniversities = "v1/admin/universitiesList";
export const adminAddUniversity = "v1/admin/addUniversity";
export const adminUpdateUniversity = "v1/admin/updateUniversity";
export const adminDeleteUniversity = "v1/admin/universities";

// Courses APIs
export const adminCourses = "v1/admin/courseList";
export const adminAddCourse = "v1/admin/addCourse";
export const adminUpdateCourse = "v1/admin/updateCourse";
export const adminDeleteCourse = "v1/admin/courses";

// Announcements APIs
export const adminAnnouncements = "v1/admin/announcements";
export const adminAddAnnouncement = "v1/admin/addAnnouncement";
export const adminUpdateAnnouncement = "v1/admin/announcements";
export const adminDeleteAnnouncement = "v1/admin/announcements";

// Banners APIs
export const adminBanners = "v1/admin/bannersList";
export const adminAddBanner = "v1/admin/addBanner";
export const adminUpdateBanner = "v1/admin/updateBanner";

// Settings APIs
export const getSettings = "v1/admin/getSettings";
export const updateSettings = "v1/admin/updateSettings";


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