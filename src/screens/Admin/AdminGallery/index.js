import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import { hitGetGallery } from "../../../redux/admin_apis/GetGallerySlice";
import { hitAdminUpdateGallery, clearAdminUpdateGallery } from "../../../redux/admin_apis/AdminUpdateGallerySlice";
import { appColors } from "../../../utils/color";
import BackIcon from "../../../assets/svgs/BackIcon";

const PAGE_LENGTH = 10;

const AdminGallery = ({ navigation }) => {
  const dispatch = useDispatch();

  const debounceRef = useRef(null);
  const onEndReachedCalledDuringMomentum = useRef(true);

  const [gallery, setGallery] = useState([]);
  const [start, setStart] = useState(0);
  const [search, setSearch] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchGallery(0, true);
  }, []);

  const fetchGallery = async (
    startValue = 0,
    reset = false,
    searchText = search
  ) => {
    try {
      if (reset) {
        setLoading(true);
        setHasMore(true);
      }

      const result = await dispatch(
        hitGetGallery({
          start: startValue,
          length: PAGE_LENGTH,
          search: searchText,
        })
      ).unwrap();

      const list = result?.data || [];

      if (reset) {
        setGallery(list);
      } else {
        setGallery((prev) => [...prev, ...list]);
      }

      // stop pagination if returned items < page size
      if (list.length < PAGE_LENGTH) {
        setHasMore(false);
      }

      setStart(startValue);
    } catch (e) {
      console.log("Gallery API Error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchGallery(0, true, text);
    }, 400);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchGallery(0, true);
  };

  const loadMore = () => {
    if (
      loading ||
      loadingMore ||
      !hasMore ||
      onEndReachedCalledDuringMomentum.current
    ) {
      return;
    }

    setLoadingMore(true);
    fetchGallery(start + 1);
    onEndReachedCalledDuringMomentum.current = true;
  };

  const handleDelete = async (galleryItem) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this gallery item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const payload = { galleryId: galleryItem._id };
              const resultAction = await dispatch(hitAdminUpdateGallery(payload));
              if (hitAdminUpdateGallery.fulfilled.match(resultAction)) {
                Alert.alert("Deleted", "Gallery item deleted successfully.", [
                  { text: "OK", onPress: () => fetchGallery(0, true) },
                ]);
              } else {
                const err = resultAction.payload || resultAction.error?.message || "Delete failed";
                Alert.alert("Error", err);
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete gallery item");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      {item.description ? <Text style={styles.description}>{item.description}</Text> : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
        {item.images && item.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.link }}
            style={styles.galleryImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View style={styles.cardFooter}>
        <Text style={styles.status}>
          Status: {item.isActive ? "Active" : "Inactive"}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerStyle}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackIcon height={32} width={32} fill={appColors.white} />
          </TouchableOpacity>

          <Text style={styles.headerText}>Gallery</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search gallery..."
            value={search}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Loader */}
      {loading && gallery.length === 0 ? (
        <ActivityIndicator
          size="large"
          color={appColors.primaryColor}
          style={{ flex: 1, backgroundColor: appColors.white }}
        />
      ) : (
        <FlatList
          data={gallery}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No records found</Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                size="small"
                color={appColors.primaryColor}
                style={{ marginBottom: 30 }}
              />
            ) : null
          }
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 120,
            marginTop: 20,
            backgroundColor: appColors.white,
            minHeight: "100%",
          }}
        />
      )}

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AdminAddGallery")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AdminGallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.primaryColor,
  },

  header: {
    alignItems: "center",
    marginBottom:16
  },

  headerStyle: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: appColors.primaryColor,
    alignItems: "center",
  },

  headerText: {
    fontSize: 16,
    color: appColors.white,
    textAlign: "center",
    marginRight: 32,
    flex: 1,
    fontWeight: "600",
  },

  searchBox: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 6,
  },

  searchInput: {
    height: 45,
    paddingHorizontal: 15,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
    borderRadius: 14,
    elevation: 4,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: appColors.black,
    marginBottom: 4,
  },

  description: {
    fontSize: 14,
    color: appColors.grey,
    marginBottom: 12,
  },

  imagesContainer: {
    marginBottom: 12,
  },

  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  status: {
    fontSize: 14,
    color: appColors.grey,
  },

  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  deleteText: {
    color: appColors.white,
    fontWeight: "600",
    fontSize: 14,
  },

  fab: {
    position: "absolute",
    bottom: 50,
    right: 25,
    backgroundColor: appColors.primaryColor,
    width: 55,
    height: 55,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  fabText: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "700",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },

  emptyText: {
    fontSize: 18,
    color: appColors.grey,
    textAlign: "center",
  },
});