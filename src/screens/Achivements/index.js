import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Text,
  ScrollView,
  Platform,
} from "react-native";
import Video from "react-native-video";
import BackIcon from "../../assets/svgs/BackIcon";
import { appColors } from "../../utils/color";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { hitGallery } from "../../redux/GallerySlice";
import { hitAchivements } from "../../redux/AchievementsSlice";
import { useIsFocused } from "@react-navigation/native";

const Achivements = ({ navigation }) => {
  const [selected, setSelected] = useState(null);

  const [sections,setSections] = useState(null)

  const responseAchivements = useSelector((state)=>state.achivementsReducer.data)

  const isFocused = useIsFocused()

  const dispatch = useDispatch();
  useEffect(() => {
    if (isFocused) {
      dispatch(hitAchivements());
    }
  }, [isFocused]);

  useEffect(()=>{
    if(responseAchivements!=null && responseAchivements.status ===1 ){
        setSections(responseAchivements.data.list)
    }
  },[responseAchivements])

  const renderMediaItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.item}
      onPress={() => setSelected(item)}
      activeOpacity={0.8}
    >
      {item.type == "image" ? (
        <Image source={{ uri: item.link }} style={styles.thumb} />
      ) : (
        <View style={styles.videoBox}>
          <Video
            source={{ uri: item.link }}
            style={styles.thumb}
            paused={true}
            resizeMode="cover"
          />
          <View style={styles.playButton}>
            <Text style={styles.playText}>▶</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achivements</Text>
      </View>

      {/* MAIN CONTENT */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true} // helpful on Android if nested scrolls happen
      >
        {sections!=null &&sections.map((section, index) => (
          <View key={index} style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <View style={styles.grid}>
              {section.images.map((item, idx) => renderMediaItem(item, idx))}
            </View>
          </View>
        ))}

        {/* add some bottom padding so last row isn't flush with bottom */}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* PREVIEW MODAL */}
      <Modal visible={selected !== null} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            {selected?.type === "image" ? (
              <Image
                source={{ uri: selected?.url }}
                style={styles.preview}
                resizeMode="contain"
              />
            ) : (
              <Video
                source={{ uri: selected?.url }}
                style={styles.preview}
                controls
                resizeMode="contain"
              />
            )}
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelected(null)}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Achivements;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: appColors.primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },

  scroll: {
    flex: 1, // <-- important so ScrollView fills remaining space and becomes scrollable
  },
  contentContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  sectionBox: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 8,
    color: "#222",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  item: {
    // using fixed margin values instead of percentage avoids rounding layout issues
    width: "32%",
    height: 110,
    marginRight: "1%",
    marginBottom: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },

  thumb: { width: "100%", height: "100%" },

  videoBox: { flex: 1 },

  playButton: {
    position: "absolute",
    top: "35%",
    left: "35%",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  playText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    height: "70%",
    backgroundColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
  },

  preview: { width: "100%", height: "100%" },

  closeButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 25,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  closeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
