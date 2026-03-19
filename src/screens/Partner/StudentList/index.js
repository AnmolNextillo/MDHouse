import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { use, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { appColors } from "../../../utils/color";
import BackIcon from "../../../assets/svgs/BackIcon";
import { useDispatch, useSelector } from "react-redux";
import { hitAgentStudentList } from "../../../redux/AgentStudentListSlice";
import { useIsFocused } from "@react-navigation/native";

const StudentList = ({ navigation }) => {
//   const students = [
//     { id: "1", name: "John Doe", mobile: "9876543210" },
//   ]; // replace with API data

const isFocused = useIsFocused();

const [students, setStudents] = useState([]);

  const dispatch = useDispatch();
  const responseStudentList = useSelector(
    (state) => state.agentStudentListReducer.data
  );

  useEffect(()=>{
    if(isFocused){
      dispatch(hitAgentStudentList());
    }
    // dispatch(hitAgentStudentList());
  },[isFocused])

  useEffect(()=>{
    if(responseStudentList && responseStudentList.status == 1){
        setStudents(responseStudentList.data);
    }
  },[responseStudentList])

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{
            uri:item.profileImage,
          }}
          style={styles.profile}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.mobile}>Mobile No. : +91 {item.mobileNumber}</Text>
          <Text style={styles.mobile}>Email : {item.email}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Students</Text>
      </View>

      {/* LIST */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* FAB BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddStudent")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default StudentList;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.white },

  header: {
    flexDirection: "row",
    backgroundColor: appColors.primaryColor,
    padding: 12,
    alignItems: "center",
  },

  headerText: {
    flex: 1,
    textAlign: "center",
    color: appColors.white,
    fontSize: 16,
    marginRight: 32,
  },

  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },

  profile: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: appColors.black,
  },

  mobile: {
    color: appColors.grey,
  },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: appColors.primaryColor,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  fabText: {
    fontSize: 36,
    color: "#fff",
    textAlign:'center',
    marginBottom:4
  },
});