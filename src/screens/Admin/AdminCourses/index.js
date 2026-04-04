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
} from "react-native";
import { useDispatch } from "react-redux";
import { hitGetCourses } from "../../../redux/admin_apis/GetCoursesSlice";
import { appColors } from "../../../utils/color";
import BackIcon from "../../../assets/svgs/BackIcon";

const PAGE_LENGTH = 10;

const AdminCourses = ({ navigation }) => {
  const dispatch = useDispatch();

  const debounceRef = useRef(null);
  const onEndReachedCalledDuringMomentum = useRef(true);

  const [courses, setCourses] = useState([]);
  const [start, setStart] = useState(0);
  const [search, setSearch] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCourses(0, true);
  }, []);

  const fetchCourses = async (
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
        hitGetCourses({
          start: startValue,
          length: PAGE_LENGTH,
          search: searchText,
        })
      ).unwrap();

      const list = result?.data || [];

      if (reset) {
        setCourses(list);
      } else {
        setCourses((prev) => [...prev, ...list]);
      }

      // stop pagination if returned items < page size
      if (list.length < PAGE_LENGTH) {
        setHasMore(false);
      }

      setStart(startValue);
    } catch (e) {
      console.log("Courses API Error:", e);
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
      fetchCourses(0, true, text);
    }, 400);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses(0, true);
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
    fetchCourses(start + 1);
    onEndReachedCalledDuringMomentum.current = true;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("AdminCourseDetails", { course: item })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item?.name ? item.name.charAt(0).toUpperCase() : "C"}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item?.name}</Text>

        <Text style={styles.info}>📚 Course</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerStyle}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackIcon height={32} width={32} fill={appColors.white} />
          </TouchableOpacity>

          <Text style={styles.headerText}>Courses</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search courses..."
            value={search}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Loader */}
      {loading && courses.length === 0 ? (
        <ActivityIndicator
          size="large"
          color={appColors.primaryColor}
          style={{ flex: 1, backgroundColor: appColors.white }}
        />
      ) : (
        <FlatList
          data={courses}
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
        onPress={() => navigation.navigate("AdminAddCourse")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AdminCourses;

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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
    borderRadius: 14,
    elevation: 4,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    backgroundColor: appColors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
  },

  info: {
    fontSize: 13,
    color: "#666",
    marginTop: 3,
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
});