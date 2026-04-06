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
} from "react-native";
import { useDispatch } from "react-redux";
import { hitGetStudents } from "../../../redux/admin_apis/AdminGetStudentsSlice";
import { appColors } from "../../../utils/color";
import BackIcon from "../../../assets/svgs/BackIcon";

const PAGE_LENGTH = 10;

const AdminAlumni = ({ navigation }) => {
  const dispatch = useDispatch();

  const debounceRef = useRef(null);
  const onEndReachedCalledDuringMomentum = useRef(true);

  const [students, setStudents] = useState([]);
  const [start, setStart] = useState(0);
  const [search, setSearch] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchStudents(0, true);
  }, []);

  const fetchStudents = async (
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
        hitGetStudents({
          start: startValue,
          length: PAGE_LENGTH,
          search: searchText,
          type: "alumni",
        })
      ).unwrap();

      const list = result?.data || [];

      if (reset) {
        setStudents(list);
      } else {
        setStudents((prev) => [...prev, ...list]);
      }

      if (list.length < PAGE_LENGTH) {
        setHasMore(false);
      }

      setStart(startValue);
    } catch (e) {
      console.log("Alumni API Error:", e);
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
      fetchStudents(0, true, text);
    }, 400);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchStudents(0, true);
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
    fetchStudents(start + 1);
    onEndReachedCalledDuringMomentum.current = true;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("AdminStudentDetails", { student: item, printOnly: true })}
    >
      <View style={styles.avatar}>
        {item?.profileImage ? (
          <Image
            source={{ uri: item.profileImage }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.avatarText}>
            {item?.name ? item.name.charAt(0).toUpperCase() : "S"}
          </Text>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item?.name}</Text>
        <Text style={styles.studentId}>ID: {item?._id || item?.studentId}</Text>
        <Text style={styles.info}>📧 {item?.email}</Text>
        <Text style={styles.info}>📞 {item?.mobileNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerStyle}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackIcon height={32} width={32} fill={appColors.white} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Alumni Students</Text>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search alumni..."
            value={search}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      {loading && students.length === 0 ? (
        <ActivityIndicator
          size="large"
          color={appColors.primaryColor}
          style={{ flex: 1, backgroundColor: appColors.white }}
        />
      ) : (
        <FlatList
          data={students}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.primaryColor,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  headerStyle: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: appColors.primaryColor,
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    color: appColors.white,
    textAlign: "center",
    marginRight: 32,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: appColors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColors.black,
  },
  studentId: {
    fontSize: 12,
    color: appColors.grey,
    marginBottom: 2,
  },
  info: {
    fontSize: 14,
    color: appColors.grey,
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

export default AdminAlumni;
