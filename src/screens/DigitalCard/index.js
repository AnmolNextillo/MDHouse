import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { useSelector } from "react-redux";
import BackIcon from "../../assets/svgs/BackIcon";
import { appColors } from "../../utils/color";

const { width } = Dimensions.get("window");

const DigitalCard = ({ navigation }) => {
  const responseProfileData = useSelector(
    (state) => state.getProfileReducer.data
  );

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (responseProfileData?.status === 1) {
      setProfileData(responseProfileData.data);
    }
  }, [responseProfileData]);

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== Header ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={30} width={30} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital ID Card</Text>
      </View>

      {/* ===== Centered Content ===== */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <LinearGradient
          colors={[appColors.primaryColorLight, appColors.primaryColor]}
          style={styles.card}
        >
          {/* ===== Top Section ===== */}
          <View style={styles.topSection}>
            {profileData?.profileImage ? (
              <Image
                source={{ uri: profileData.profileImage }}
                style={styles.photo}
              />
            ) : (
              <View style={styles.placeholderPhoto} />
            )}

            <Text style={styles.name}>
              {profileData?.name || "Student Name"}
            </Text>

            <Text style={styles.idText}>
              Student ID: {profileData?.studentId || "USR-0001"}
            </Text>
          </View>

          {/* ===== Info Section ===== */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>
                {profileData?.mobileNumber || "-"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>
                {profileData?.email || "-"}
              </Text>
            </View>
          </View>

          {/* ===== QR Section ===== */}
          {profileData?._id && (
            <View style={styles.qrWrapper}>
              <QRCode
                value={profileData._id}
                size={130}
                backgroundColor="transparent"
                color="#000"
              />
            </View>
          )}

          <Text style={styles.scanText}>
            Scan this QR to verify identity
          </Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DigitalCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4FF",
  },

  /* ===== Header ===== */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: appColors.primaryColor,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
  },

  /* ===== Scroll Center ===== */
  scrollContent: {
    flex: 1,
    alignItems: "center",
  },

  /* ===== Card ===== */
  card: {
    width:"90%",
    borderRadius: 20,
    paddingVertical: 20,
    marginTop:16,
    elevation: 8,
  },

  /* ===== Top Section ===== */
  topSection: {
    alignItems: "center",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.4)",
  },

  photo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 10,
  },

  placeholderPhoto: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: 10,
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },

  idText: {
    fontSize: 14,
    marginTop: 4,
    color: "#f0f0f0",
  },

  /* ===== Info ===== */
  infoContainer: {
    marginTop: 18,
    paddingHorizontal: 16,
  },

  infoItem: {
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    color: "#d6e5ff",
  },

  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },

  /* ===== QR ===== */
  qrWrapper: {
    alignSelf: "center",
    marginVertical: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    elevation: 4,
  },

  scanText: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 13,
    color: "#f2f2f2",
  },
});