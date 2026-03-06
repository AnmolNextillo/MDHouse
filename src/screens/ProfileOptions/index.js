import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { appColors } from "../../utils/color";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { hitGetProfile } from "../../redux/GetProfileSlice";
import EditOptionModal from "../../components/EditOptionModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  clearDeleteAccount,
  hitDeleteAccount,
} from "../../redux/DeleteAccountSlice";
import { hitVersionApi } from "../../redux/GetVersionSlice";
import DeviceInfo from "react-native-device-info";
// import { SafeAreaView } from "react-native-safe-area-context";
import RightArrow from "../../assets/svgs/RightArrow";
import BackIcon from "../../assets/svgs/BackIcon";
import EditIcon from "../../assets/svgs/EditIcon";
import DocumentPickerModal from "../../components/DocumentPickerModal";
import { requestAllPermissions } from "../../utils/constants";
import ImagePicker from "react-native-image-crop-picker";
import { clearUploadFileData, uploadFile } from "../../redux/uploadFile";
import { hitUpdateProfile } from "../../redux/UpdateProfileSlice";

const ProfileOptios = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const responseProfileData = useSelector(
    (state) => state.getProfileReducer.data
  );
  const responseDeleteAccount = useSelector(
    (state) => state.deleteAccountReducer.data
  );

  const responseUploadImage = useSelector(
    (state) => state.uploadFileReducer.data
  );

  const responseVersion = useSelector((state) => state.getVersionReducer.data);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      dispatch(hitGetProfile());
    }
  }, [isFocused]);

  useEffect(() => {
    if (responseProfileData != null && responseProfileData.status == 1) {
      setProfileData(responseProfileData.data);
      setProfileImage(responseProfileData.data.profileImage)
    }
  }, [responseProfileData]);

  useEffect(() => {
    if (responseDeleteAccount != null && responseDeleteAccount.status == 1) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      dispatch(clearDeleteAccount());
    }
  }, [responseDeleteAccount]);

  const onItemClick = (value) => {
    setModalVisible(false);
    navigation.navigate(value, { from: 2 });
  };

  const onLogoutClick = async () => {
    console.log("Logout clicked");
    await AsyncStorage.removeItem("token");

    // Add small delay so navigation happens after mount
    // setTimeout(() => {
    //   navigation.reset({
    //     index: 0,
    //     routes: [{ name: "Login" }],
    //   });
    // }, 50);
    navigation.navigate("Login");
  };


  const onDeleteAccountClick = () => {
    dispatch(hitDeleteAccount());
  };

  useEffect(() => {
    dispatch(hitVersionApi());
  }, []);

  useEffect(() => {
    console.log("responseAppVersion response ===>", responseVersion);
    if (responseVersion != null && responseVersion.status === 1) {
      checkForUpdates();
    }
  }, [responseVersion]);

  const checkForUpdates = async () => {
    try {
      const currentVersion = DeviceInfo.getVersion();

      console.log("CurrentVersion ===> ", currentVersion);
      const latestVersion =
        Platform.OS === "android"
          ? responseVersion.data.android
          : responseVersion.data.ios;
      const updateUrl =
        Platform.OS === "android"
          ? "https://play.google.com/store/apps/details?id=com.mdhouseapp"
          : "https://apps.apple.com/in/app/mdhouse/id6749562016";

      console.log("latestVersion ===> ", latestVersion);
      if (currentVersion < latestVersion) {
        Alert.alert(
          "Update Available",
          `A new version (${latestVersion}) is available. Please update to continue.`,
          [
            { text: "Update Now", onPress: () => Linking.openURL(updateUrl) },
            //  { text: "Later", style: "cancel" },
          ].filter(Boolean)
        );
      }
    } catch (error) {
      console.log("Error checking for updates:", error);
    }
  };

  const openModal = async () => {
    const hasPermission = await requestAllPermissions();
    console.log("Has Permission ===> ", hasPermission);
    if (hasPermission) {
      setImageModalVisible(true); // open your bottom sheet modal
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

  const openCamera = () => {
    // setModalVisible(false);
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: "photo",
      freeStyleCropEnabled: true, // 🔥 allows moving crop edges
    })
      .then(image => {
        console.log("📸 Camera Image:", image);
        const payload = {
          uri: image.path,
          fileName: image.filename || `camera_${Date.now()}.jpg`,
          type: image.mime,
        };
        dispatch(uploadFile(payload));
      })
      .catch(err => {
        setModalVisible(false);
        if (err.code === "E_NO_CAMERA_PERMISSION") {
          showPermissionDeniedAlert();
        }
        console.log("❌ Camera error/cancel:", err.code);
      });
  };

  const openGallery = () => {
    // setModalVisible(false);
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: "photo",
      freeStyleCropEnabled: true, // 🔥 allows moving crop edges
    })
      .then(image => {
        console.log("🖼️ Gallery Image:", image);
        const payload = {
          uri: image.path,
          fileName: image.filename || `gallery_${Date.now()}.jpg`,
          type: image.mime,
        };
        dispatch(uploadFile(payload));
      })
      .catch(err => {
        setModalVisible(false);
        if (err.code === "E_NO_LIBRARY_PERMISSION") {
          showPermissionDeniedAlert();
        }
        console.log("❌ Gallery error/cancel:", err.code);
      });
  };

  useEffect(() => {

    if (profileData!= null && profileData.studentType == 2 && responseUploadImage != null) {
      setProfileImage(responseUploadImage.Location);
      setImageModalVisible(false);

      const payload = {
        profileImage: responseUploadImage.Location,

      };
      dispatch(hitUpdateProfile(payload));
    }

    dispatch(clearUploadFileData());
  }, [responseUploadImage]);

  return (
    <SafeAreaView style={styles.constainerStyle}>
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile Details</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("PdfRecreatedScreen")
            // Linking.openURL(
            //   "https://kcmschool.s3.ap-south-1.amazonaws.com/1763444672_Indian%20Students%E2%80%99%20Society%20%28%20MD%20House%20%29.pdf"
            // )
          }
        >
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>
      {profileData != null ? (
        <ScrollView
          style={styles.formStyle}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, paddingBottom: 76 }}>
            <View style={styles.userProfileStyle}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={styles.imagePicker}
                  onPress={() =>
                    navigation.navigate("ViewImage", {
                      uri: profileData.profileImage,
                    })
                  }
                >
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                  />
                </TouchableOpacity>
                {profileData.studentType == 2 && (
                  <TouchableOpacity onPress={() => openModal()} style={{ marginLeft: -20, marginTop: 40 }}>
                    <EditIcon height={24} width={24} fill={appColors.black} />
                  </TouchableOpacity>)}
                <View style={{ flex: 1, paddingHorizontal: 16 }}>
                  <Text style={styles.userNameStyle}>{profileData.name}</Text>
                  <Text style={styles.simpleTextStyle}>
                    {profileData.email}
                  </Text>
                  <Text style={styles.simpleTextStyle}>
                    Phone No. :-{" "}
                    {`+${profileData.countryCode + profileData.mobileNumber}`}
                  </Text>
                </View>
              </View>
            </View>
            {profileData.studentType == 1 && (
              <View>
                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => onItemClick("DigitalCard")}
                >
                  <Text style={styles.lableStyle}>View Digital Card</Text>
                  <RightArrow height={24} width={24} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => onItemClick("UniversityInfo")}
                >
                  <Text style={styles.lableStyle}>University Info</Text>
                  <RightArrow height={24} width={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => onItemClick("StudentDetials")}
                >
                  <Text style={styles.lableStyle}>Personal Detail</Text>
                  <RightArrow height={24} width={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => onItemClick("DocumentUpload")}
                >
                  <Text style={styles.lableStyle}>Documents</Text>
                  <RightArrow height={24} width={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => onItemClick("StudentAddress")}
                >
                  <Text style={styles.lableStyle}>Address</Text>
                  <RightArrow height={24} width={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => onItemClick("ParentDetials")}
                >
                  <Text style={styles.lableStyle}>Parent Details</Text>
                  <RightArrow height={24} width={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => onItemClick("ApplyTelex")}
                >
                  <Text style={styles.lableStyle}>Apply for Telex</Text>
                  <RightArrow height={24} width={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => onItemClick("ResultScreen")}
                >
                  <Text style={styles.lableStyle}>Check Result</Text>
                  <RightArrow height={24} width={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => onItemClick("Achivements")}
                >
                  <Text style={styles.lableStyle}>Achivements</Text>
                  <RightArrow height={24} width={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => onItemClick("Attendance")}
                >
                  <Text style={styles.lableStyle}>Attendence</Text>
                  <RightArrow height={24} width={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => onItemClick("IssueListScreen")}
                >
                  <Text style={styles.lableStyle}>Report Issue</Text>
                  <RightArrow height={24} width={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => Linking.openURL(Platform.OS == "android" ? "https://play.google.com/store/apps/details?id=com.nextillo&pcampaignid=web_share" : "https://apps.apple.com/in/app/nextillo/id1597259662")}
                >
                  <Text style={styles.lableStyle}>Prepare FMGE with Nextillo</Text>
                  <RightArrow height={24} width={24} />
                </TouchableOpacity>
              </View>
            )}
            {profileData.studentType == 2 && (
              <View>
                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => onItemClick("AlumniDetails")}
                >
                  <Text style={styles.lableStyle}>Profile Update</Text>
                  <RightArrow height={24} width={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => onItemClick("UploadAlumniDocuments")}
                >
                  <Text style={styles.lableStyle}>Upload Documents</Text>
                  <RightArrow height={24} width={24} />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              style={styles.logoutButtonStyle}
              onPress={() => onLogoutClick()}
            >
              <Text
                style={{
                  color: appColors.white,
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteAccountStyle}
              onPress={() => onDeleteAccountClick()}
            >
              <Text
                style={{
                  color: appColors.white,
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.userProfileStyle}>
          <ActivityIndicator />
        </View>
      )}

      <EditOptionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onItemSelect={onItemClick}
      />
      <DocumentPickerModal
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        onCamera={openCamera}
        onGallery={openGallery}

      />
    </SafeAreaView>
  );
};

export default ProfileOptios;

const styles = StyleSheet.create({
  constainerStyle: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerStyle: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: appColors.primaryColor,
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
    color: appColors.white,
    textAlign: "center",
    flex: 1,
  },
  helpText: {
    fontSize: 14,
    color: appColors.primaryColor,
    textAlign: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: appColors.white,
  },
  itemStyle: {
    flexDirection: "row",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: appColors.offWhite,
    borderRadius: 8,
  },
  lableStyle: {
    fontSize: 18,
    color: appColors.black,
    fontWeight: "600",
    flex: 1,
  },
  formStyle: {
    flex: 1,
  },
  imagePicker: {
    height: 80,
    width: 80,
    borderWidth: 1,
    borderColor: appColors.grey,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  uploadText: {
    color: appColors.grey,
    textAlign: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  imageViewStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  imageStyle: {
    height: 140,
    width: 140,
    borderRadius: 8,
  },
  userProfileStyle: {
    backgroundColor: appColors.primaryColor,
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  deleteAccountStyle: {
    backgroundColor: appColors.red,
    padding: 16,
    borderRadius: 16,
    marginVertical: 16,
    marginHorizontal: 16,
  },
  logoutButtonStyle: {
    backgroundColor: appColors.primaryColor,
    padding: 16,
    borderRadius: 16,
    marginTop: 32,
    marginHorizontal: 16,
  },
  userNameStyle: {
    color: appColors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  simpleTextStyle: {
    color: appColors.white,
    fontSize: 14,
  },
});
