import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Linking,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Swiper from "react-native-swiper";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { appColors } from "../../utils/color";
import { hitHome } from "../../redux/HomeSlice";
import FacebookIcon from "../../assets/svgs/FacebookIcon";
import InstagramIcon from "../../assets/svgs/InstagramIcon";
import LinkedInIcon from "../../assets/svgs/LinkedInIcon";
import YouTubeIcon from "../../assets/svgs/YouTubeIcon";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const responseHome = useSelector((state) => state.homeReducer.data);

  const [homeData, setHomeData] = useState(null);

  // 🔥 Dynamic heights
  const [announcementHeight, setAnnouncementHeight] = useState(0);
  const [universityHeight, setUniversityHeight] = useState(0);
  const [courseHeight, setCourseHeight] = useState(0);

  useEffect(() => {
    if (isFocused) dispatch(hitHome());
  }, [isFocused]);

  useEffect(() => {
    if (responseHome?.status === 1) {
      setHomeData(responseHome.data);

      // reset heights on fresh API
      setAnnouncementHeight(0);
      setUniversityHeight(0);
      setCourseHeight(0);
    }
  }, [responseHome]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={appColors.primaryColor}
      />

      {/* ===== Header ===== */}
      <LinearGradient
        colors={[appColors.primaryColor, "#3A0CA3"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>The MD House</Text>
        <Text style={styles.headerSubTitle}>
          Guiding Medical Dreams Beyond Borders 🌍
        </Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Banner ===== */}
        {homeData?.banners?.length > 0 && (
          <View style={styles.bannerWrapper}>
            <Swiper autoplay autoplayTimeout={3} loop>
              {homeData.banners.map((item, index) => (
                <View key={index} style={styles.slide}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.bannerImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </Swiper>
          </View>
        )}

        {/* ===== Announcements ===== */}
        {homeData?.announcements?.length > 0 && (
          <View style={styles.announcementBox}>
            <View style={styles.announcementHeader}>
              <Text style={styles.announcementIcon}>📢</Text>
              <Text style={styles.announcementHeading}>Announcements</Text>
            </View>

            <Swiper
              autoplay
              autoplayTimeout={3}
              horizontal={false}
              loop
              showsPagination={false}
              removeClippedSubviews={false}
              style={{ height: announcementHeight || undefined }}
            >
              {homeData.announcements.map((item, i) => (
                <View
                  key={i}
                  style={styles.slideContainer}
                  onLayout={(e) => {
                    const h = e.nativeEvent.layout.height;
                    if (h > announcementHeight) setAnnouncementHeight(h);
                  }}
                >
                  <Text style={styles.announcementTitle}>{item.title}</Text>
                  <Text style={styles.announcementText}>
                    {item.description}
                  </Text>
                </View>
              ))}
            </Swiper>
          </View>
        )}

        {/* ===== Universities ===== */}
        {homeData?.universities?.length > 0 && (
          <View style={styles.announcementBox}>
            <View style={styles.announcementHeader}>
              <Text style={styles.announcementHeading}>Universities</Text>
            </View>

            <Swiper
              autoplay
              autoplayTimeout={3}
              loop
              showsPagination={false}
              style={{ height: universityHeight || undefined }}
            >
              {homeData.universities.map((item, i) => (
                <View
                  key={i}
                  style={styles.slideContainer}
                  onLayout={(e) => {
                    const h = e.nativeEvent.layout.height;
                    if (h > universityHeight) setUniversityHeight(h);
                  }}
                >
                  <Text style={styles.announcementTitle}>{item.name}</Text>
                </View>
              ))}
            </Swiper>
          </View>
        )}

        {/* ===== Courses ===== */}
        {homeData?.courses?.length > 0 && (
          <View style={styles.announcementBox}>
            <View style={styles.announcementHeader}>
              <Text style={styles.announcementHeading}>Courses</Text>
            </View>

            <Swiper
              autoplay
              autoplayTimeout={3}
              loop
              showsPagination={false}
              style={{ height: courseHeight || undefined }}
            >
              {homeData.courses.map((item, i) => (
                <View
                  key={i}
                  style={styles.slideContainer}
                  onLayout={(e) => {
                    const h = e.nativeEvent.layout.height;
                    if (h > courseHeight) setCourseHeight(h);
                  }}
                >
                  <Text style={styles.announcementTitle}>{item.name}</Text>
                </View>
              ))}
            </Swiper>
          </View>
        )}

                {/* ===== Stats Section ===== */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{homeData?.settings?.totalMedicalStudentGuided || 0}+</Text>
            <Text style={styles.statLabel}>Medical Students Guided</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{homeData?.settings?.totalPartnerUniversities || 0}+</Text>
            <Text style={styles.statLabel}>Partner Universities</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{homeData?.settings?.totalSuccessfullDoctors || 0}+</Text>
            <Text style={styles.statLabel}>Successful Doctors in India</Text>
          </View>
        </View>

        {/* ===== About / Info Section ===== */}
        <View style={styles.infoCard}>
          <Text style={styles.infoHeading}>Why Choose The MD House?</Text>
          <Text style={styles.infoText}>
            🌟 <Text style={styles.highlight}>Trusted Expertise:</Text> Over two
            decades of helping Indian students achieve their medical dreams
            abroad.
          </Text>
          <Text style={styles.infoText}>
            🌍 <Text style={styles.highlight}>Global Reach:</Text> Partnerships
            with top MCI-approved universities across multiple countries.
          </Text>
          <Text style={styles.infoText}>
            💬 <Text style={styles.highlight}>Personal Guidance:</Text> From
            admission to graduation — we’re with you every step of the way.
          </Text>
          <Text style={styles.infoText}>
            🏥 <Text style={styles.highlight}>Strong Alumni Network:</Text>{" "}
            Thousands of practicing doctors globally vouch for our reliability.
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginTop: 16, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            style={{ marginHorizontal: 8 }}
            onPress={() => Linking.openURL("https://facebook.com")}
          >
            <FacebookIcon height={36} width={36} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginHorizontal: 8 }}
            onPress={() => Linking.openURL("https://instagram.com")}
          >
            <InstagramIcon height={36} width={36} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginHorizontal: 8 }}
            onPress={() => Linking.openURL("https://linkedin.com")}
          >
            <LinkedInIcon height={36} width={36} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginHorizontal: 8 }}
            onPress={() => Linking.openURL("https://www.youtube.com/@THEMDHOUSE")}
          >
            <YouTubeIcon height={36} width={36} />
          </TouchableOpacity>
        </View>

        {/* ===== Footer ===== */}
        <Text style={styles.footerText}>
          The MD House — Empowering Future Doctors 🌟
        </Text>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  scrollContainer: {
    paddingBottom: 60,
  },

  header: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },
  headerSubTitle: {
    color: "#EEE",
    fontSize: 14,
    marginTop: 5,
  },

  bannerWrapper: {
    height: 200,
    margin: 16,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 5,
  },
  slide: {
    flex: 1,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },

  announcementBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    elevation: 3,
  },
  announcementHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  announcementIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  announcementHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: appColors.primaryColor,
  },

  slideContainer: {
    paddingVertical: 6,
  },

  announcementTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  announcementText: {
    fontSize: 13,
    color: "#444",
    marginTop: 2,
  },
   // ===== Stats Section =====
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 4,
    alignItems: "center",
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: appColors.primaryColor,
  },
  statLabel: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
    textAlign: "center",
  },

  // ===== Info Section =====
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    elevation: 3,
  },
  infoHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: appColors.primaryColor,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
    marginBottom: 6,
  },
  highlight: {
    color: appColors.primaryColor,
    fontWeight: "600",
  },

  // ===== Footer =====
  footerText: {
    textAlign: "center",
    color: "#666",
    fontSize: 13,
    marginVertical: 16,
  },

});
