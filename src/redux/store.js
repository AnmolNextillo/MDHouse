import {configureStore} from '@reduxjs/toolkit';
import signupReducer from './SignUpSlice';
import loginReducer from './LoginSlice';
import updateProfileReducer from './UpdateProfileSlice';
import uploadFileReducer from './uploadFile';
import getProfileReducer from './GetProfileSlice'; 
import deleteAccountReducer from './DeleteAccountSlice'; 
import getVersionReducer from './GetVersionSlice'; 
import getNotificationsReducer from './GetNotificationsSlice'; 
import getChatReducer from './GetChatSlice';  
import setMessageReducer from './SendMessageSlice';  
import dashboardReducer from './DashboardSlice';  
import getUniReducer from './GetUniSlice';  
import googleLoginReducer from './GoogleLoginSlice';  
import applyTelexReducer from './ApplyForTelexSlice';  
import telexRecordReducer from './GetTelexRecordSlice';  
import agentsReducer from './AgentListSlice';  
import resultReducer from './ResultSlice';  
import attendanceReducer from './AttendanceSlice';  
import homeReducer from './HomeSlice';  
import postIssueReducer from './PostIssueSlice';  
import getIssueReducer from './GetIssuesSlice';  
import galleryReducer from './GallerySlice';  
import achivementsReducer from './AchievementsSlice';  
import settingReducer from './SettingSlice';  
import forgotReducer from './ForgotPasswordSlice';  
import agentUpdateProfileReducer from './AgentUpdateProfileSlice';  
import agentStudentListReducer from './AgentStudentListSlice';  
import agentAddStudentReducer from './AgentAddStudentSlice';
import checkUserReducer from './CheckUserSlice';
import updateStudentReducer from './UpdateStudentSlice';
import studentDetailsReducer from './GetStudentDetailsSlice';
import otpApiReducer from './OtpApiSlice';
import resendOtpApiReducer from './AgentResendOtpSlice';
import printStudentRecordReducer from './PrintStudentRecordSlice';
import getAgentDetailsReducer from './admin_apis/AdminAgentDetailSlice';
import adminAddAgentReducer from './admin_apis/AdminAddAgentSlice';
import adminUpdateAgentReducer from './admin_apis/AdminUpdateAgentSlice';
import adminDeleteAgentReducer from './admin_apis/AdminDeleteAgentSlice';
import adminGetStudentsReducer from './admin_apis/AdminGetStudentsSlice';
import adminGetStudentDetailsReducer from './admin_apis/AdminStudentDetailSlice';
import adminGetStudentResultReducer from './admin_apis/AdminGetStudentResultSlice';
import adminAddStudentResultReducer from './admin_apis/AdminAddStudentResultSlice';
import adminAddStudentAttendanceReducer from './admin_apis/AdminAddStudentAttendanceSlice';
import getUniversitiesReducer from './admin_apis/GetUniversitiesSlice';
import adminAddUniversityReducer from './admin_apis/AdminAddUniversitySlice';
import adminUpdateUniversityReducer from './admin_apis/AdminUpdateUniversitySlice';
import adminDeleteUniversityReducer from './admin_apis/AdminDeleteUniversitySlice';
import getCoursesReducer from './admin_apis/GetCoursesSlice';
import adminAddCourseReducer from './admin_apis/AdminAddCourseSlice';
import adminUpdateCourseReducer from './admin_apis/AdminUpdateCourseSlice';
import adminDeleteCourseReducer from './admin_apis/AdminDeleteCourseSlice';
import getAnnouncementsReducer from './admin_apis/GetAnnouncementsSlice';
import adminAddAnnouncementReducer from './admin_apis/AdminAddAnnouncementSlice';
import adminUpdateAnnouncementReducer from './admin_apis/AdminUpdateAnnouncementSlice';
import adminDeleteAnnouncementReducer from './admin_apis/AdminDeleteAnnouncementSlice';
import getBannersReducer from './admin_apis/GetBannersSlice';
import adminAddBannerReducer from './admin_apis/AdminAddBannerSlice';
import adminUpdateBannerReducer from './admin_apis/AdminUpdateBannerSlice';
import getSettingsReducer from './admin_apis/GetSettingsSlice';
import updateSettingsReducer from './admin_apis/UpdateSettingsSlice';

const store = configureStore({ 
  reducer: {
   signupReducer:signupReducer,
   loginReducer:loginReducer,
   updateProfileReducer:updateProfileReducer,
   uploadFileReducer:uploadFileReducer,
   getProfileReducer:getProfileReducer,
   deleteAccountReducer:deleteAccountReducer,
   getVersionReducer:getVersionReducer,
   getNotificationsReducer:getNotificationsReducer,
   getChatReducer:getChatReducer,
   setMessageReducer:setMessageReducer,
   dashboardReducer:dashboardReducer,
   getUniReducer:getUniReducer,
   googleLoginReducer:googleLoginReducer,
   telexRecordReducer:telexRecordReducer,
   applyTelexReducer:applyTelexReducer,
   agentsReducer:agentsReducer,
   resultReducer:resultReducer,
   attendanceReducer:attendanceReducer,
   homeReducer:homeReducer,
   postIssueReducer:postIssueReducer,
   getIssueReducer:getIssueReducer,
   galleryReducer:galleryReducer,
   achivementsReducer:achivementsReducer,
   settingReducer:settingReducer,
   forgotReducer:forgotReducer,
   agentUpdateProfileReducer:agentUpdateProfileReducer,
   agentStudentListReducer:agentStudentListReducer,
   agentAddStudentReducer:agentAddStudentReducer,
   checkUserReducer:checkUserReducer,
   updateStudentReducer:updateStudentReducer,
   studentDetailsReducer:studentDetailsReducer,
   otpApiReducer:otpApiReducer,
   resendOtpApiReducer:resendOtpApiReducer,
   printStudentRecordReducer:printStudentRecordReducer,
   getAgentDetailsReducer:getAgentDetailsReducer,
   adminAddAgentReducer:adminAddAgentReducer,
   adminUpdateAgentReducer:adminUpdateAgentReducer,
   adminDeleteAgentReducer:adminDeleteAgentReducer,
   adminGetStudentsReducer:adminGetStudentsReducer,
   adminGetStudentDetailsReducer:adminGetStudentDetailsReducer,
   adminGetStudentResultReducer:adminGetStudentResultReducer,
   adminAddStudentResultReducer:adminAddStudentResultReducer,
   adminAddStudentAttendanceReducer:adminAddStudentAttendanceReducer,
   getUniversitiesReducer:getUniversitiesReducer,
   adminAddUniversityReducer:adminAddUniversityReducer,
   adminUpdateUniversityReducer:adminUpdateUniversityReducer,
   adminDeleteUniversityReducer:adminDeleteUniversityReducer,
   getCoursesReducer:getCoursesReducer,
   adminAddCourseReducer:adminAddCourseReducer,
   adminUpdateCourseReducer:adminUpdateCourseReducer,
   adminDeleteCourseReducer:adminDeleteCourseReducer,
   getAnnouncementsReducer:getAnnouncementsReducer,
   adminAddAnnouncementReducer:adminAddAnnouncementReducer,
   adminUpdateAnnouncementReducer:adminUpdateAnnouncementReducer,
   adminDeleteAnnouncementReducer:adminDeleteAnnouncementReducer,
   getBannersReducer:getBannersReducer,
   adminAddBannerReducer:adminAddBannerReducer,
   adminUpdateBannerReducer:adminUpdateBannerReducer,
   getSettingsReducer:getSettingsReducer,
   updateSettingsReducer:updateSettingsReducer,
  },
});

export default store;