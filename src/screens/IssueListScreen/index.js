import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { appColors } from "../../utils/color";
import PlusIcon from "../../assets/svgs/PlusIcon";
import { useIsFocused } from "@react-navigation/native";
import { hitGetIssue } from "../../redux/GetIssuesSlice";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import BackIcon from "../../assets/svgs/BackIcon";

const IssueListScreen = ({ navigation }) => {
  const [issueList, setIssueList] = useState([]);

  const responseReportList = useSelector((state) => state.getIssueReducer.data);

  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hitGetIssue());
  }, [isFocused]);

  useEffect(() => {
    if (responseReportList != null && responseReportList.status == 1) {
      setIssueList(responseReportList.data);
    }
  }, [responseReportList]);

  const renderItem = ({ item }) => {
    const imageSource =
      item.image?.length > 0
        ? { uri: item.image }
        : "";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("IssueDetails", { issue: item })}
      >
        <Image source={imageSource} style={styles.issueImage} />

        <View style={styles.textContainer}>
          <Text style={styles.subject}>{item.subject}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Issues List</Text>
      </View>
      <View style={{padding:16}}>
        <FlatList
          data={issueList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("IssueReportScreen")}
      >
        <PlusIcon fill={appColors.primaryColor} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default IssueListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
  card: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  issueImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#ddd",
  },
  textContainer: {
    flex: 1,
  },
  subject: {
    fontSize: 16,
    fontWeight: "bold",
    color: appColors.primaryColor,
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginTop: 3,
  },

  // Floating Button Style
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
