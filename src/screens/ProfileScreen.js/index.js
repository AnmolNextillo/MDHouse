import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { appColors } from "../../utils/color";
import EditProfileIcon from "../../assets/svgs/EditProfileIcon";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { hitGetProfile } from "../../redux/GetProfileSlice";
import EditOptionModal from "../../components/EditOptionModal";
import LogoutIcon from "../../assets/svgs/LogoutIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  clearDeleteAccount,
  hitDeleteAccount,
} from "../../redux/DeleteAccountSlice";
import { hitVersionApi } from "../../redux/GetVersionSlice";
import DeviceInfo from "react-native-device-info";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";

const ProfileScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const responseProfileData = useSelector(
    (state) => state.getProfileReducer.data
  );
  const responseDeleteAccount = useSelector(
    (state) => state.deleteAccountReducer.data
  );
  const responseVersion = useSelector((state) => state.getVersionReducer.data);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      dispatch(hitGetProfile({usertype:1}));
    }
  }, [isFocused]);

  useEffect(() => {
    if (responseProfileData && responseProfileData.status === 1) {
      setProfileData(responseProfileData.data);
    }
  }, [responseProfileData]);

  useEffect(() => {
    if (responseDeleteAccount && responseDeleteAccount.status === 1) {
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
    await AsyncStorage.removeItem("token");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const onDeleteAccountClick = () => {
    dispatch(hitDeleteAccount());
  };

  useEffect(() => {
    dispatch(hitVersionApi());
  }, []);

  useEffect(() => {
    if (responseVersion && responseVersion.status === 1) {
      checkForUpdates();
    }
  }, [responseVersion]);

  const checkForUpdates = async () => {
    try {
      const currentVersion = DeviceInfo.getVersion();
      const latestVersion =
        Platform.OS === "android"
          ? responseVersion.data.android
          : responseVersion.data.ios;
      const updateUrl =
        Platform.OS === "android"
          ? "https://play.google.com/store/apps/details?id=com.mdhouseapp"
          : "https://apps.apple.com/in/app/mdhouse/id6749562016";

      if (currentVersion < latestVersion) {
        Alert.alert(
          "Update Available",
          `A new version (${latestVersion}) is available. Please update to continue.`,
          [{ text: "Update Now", onPress: () => Linking.openURL(updateUrl) }]
        );
      }
    } catch (error) {
      console.log("Error checking for updates:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[appColors.primaryColor, "#004AAD"]}
        style={styles.header}
      >
        <Text style={styles.headerText}>Profile</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <EditProfileIcon height={28} width={28} fill={appColors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogoutClick} style={{ marginLeft: 16 }}>
            <LogoutIcon height={26} width={26} fill={appColors.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      {profileData ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Banner */}
          <View style={styles.bannerContainer}>
            <View style={styles.imageWrapper}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ViewImage", {
                    uri: profileData.profileImage,
                  })
                }
              >
                <Image
                  source={{ uri: profileData.profileImage }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{profileData.name}</Text>
            <Text style={styles.email}>{profileData.email}</Text>
            <Text style={styles.phone}>
              +{profileData.countryCode + profileData.mobileNumber}
            </Text>
          </View>

          {/* Details */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Personal Info</Text>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Address:</Text> {profileData.address},{" "}
              {profileData.city}, {profileData.state}, {profileData.country}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Living:</Text>{" "}
              {profileData.studyAddress}, {profileData.studyCity},{" "}
              {profileData.studyState}, {profileData.studyCountry}
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Passport</Text>
            <Text style={styles.infoText}>
              Valid till: {profileData.passportValidityDate}
            </Text>
            <View style={styles.imageRow}>
              <ImageCard
                label="Front"
                uri={profileData.passportImageFront}
                navigation={navigation}
              />
              <ImageCard
                label="Back"
                uri={profileData.passportImageBack}
                navigation={navigation}
              />
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Visa</Text>
            <Text style={styles.infoText}>
              Valid till: {profileData.visaValidityDate}
            </Text>
            <ImageCard
              label="Visa Image"
              uri={profileData.visaImageFront}
              navigation={navigation}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Police Verification</Text>
            <Text style={styles.infoText}>
              Valid till: {profileData.studyPoliceVerificationDate}
            </Text>
            <ImageCard
              label="Verification"
              uri={profileData.studyPoliceVerificationImageBack}
              navigation={navigation}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Father’s Info</Text>
            <Text style={styles.infoText}>Name: {profileData.fatherName}</Text>
            <Text style={styles.infoText}>
              Email: {profileData.fatherEmail}
            </Text>
            <Text style={styles.infoText}>
              Mobile: +{profileData.fatherMobileCountryCode}{" "}
              {profileData.fatherMobileNumber}
            </Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Mother’s Info</Text>
            <Text style={styles.infoText}>Name: {profileData.motherName}</Text>
            <Text style={styles.infoText}>
              Email: {profileData.motherEmail}
            </Text>
            <Text style={styles.infoText}>
              Mobile: +{profileData.motherMobileCountryCode}{" "}
              {profileData.motherMobileNumber}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={onDeleteAccountClick}
          >
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={appColors.primaryColor} />
        </View>
      )}

      <EditOptionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onItemSelect={onItemClick}
      />
    </SafeAreaView>
  );
};

const ImageCard = ({ uri, label, navigation }) => (
  <TouchableOpacity
    style={styles.imageCard}
    onPress={() => navigation.navigate("ViewImage", { uri })}
  >
    <Image source={{ uri }} style={styles.imageStyle} />
    <Text style={styles.imageLabel}>{label}</Text>
  </TouchableOpacity>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fb" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    elevation: 4,
  },
  headerText: {
    fontSize: 20,
    color: appColors.white,
    fontWeight: "700",
  },
  headerIcons: { flexDirection: "row" },
  bannerContainer: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderBottomWidth: 0.4,
    borderColor: "#ddd",
  },
  imageWrapper: {
    borderRadius: 60,
    borderWidth: 2,
    borderColor: appColors.primaryColor,
    padding: 4,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: appColors.black,
    marginTop: 8,
  },
  email: { fontSize: 14, color: "#555" },
  phone: { fontSize: 14, color: "#777", marginTop: 4 },
  sectionContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: appColors.primaryColor,
    marginBottom: 8,
  },
  infoText: { fontSize: 14, color: "#333", marginBottom: 4 },
  bold: { fontWeight: "600", color: appColors.black },
  imageRow: { flexDirection: "row", justifyContent: "space-between" },
  imageCard: { flex: 1, alignItems: "center", marginHorizontal: 4 },
  imageStyle: { width: 130, height: 130, borderRadius: 12 },
  imageLabel: { marginTop: 4, fontSize: 12, color: "#555" },
  deleteBtn: {
    backgroundColor: "#d9534f",
    margin: 24,
    borderRadius: 12,
    paddingVertical: 14,
  },
  deleteText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});