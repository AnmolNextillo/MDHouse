import React, { useRef, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ImageViewer = ({ route, navigation }) => {
  const { images, startIndex } = route.params;
  const listRef = useRef(null);

  useEffect(() => {
    if (startIndex >= 0) {
      listRef.current?.scrollToIndex({
        index: startIndex,
        animated: false,
      });
    }
  }, [startIndex]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <SafeAreaView edges={["top"]} style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Gallery</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      {/* Image Slider */}
      <FlatList
        ref={listRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }

        /** 🔥 THIS LINE FIXES THE ERROR */
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}

        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={{ uri: item?.link }} style={styles.image} />
          </View>
        )}
      />
    </View>
  );
};

export default ImageViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  safeHeader: {
    backgroundColor: "#000",
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  close: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  slide: {
    width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
