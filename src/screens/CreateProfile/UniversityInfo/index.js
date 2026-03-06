import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import BackIcon from "../../../assets/svgs/BackIcon";
import { appColors } from "../../../utils/color";
import DownIcon from "../../../assets/svgs/DownIcon";
import BottomModal from "../../../components/BottomModal";
import countries from "../../../assets/countries.json"; // your JSON file
import BottomModalUni from "../../../components/BottomModalUni";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUpdateProfile,
  hitUpdateProfile,
} from "../../../redux/UpdateProfileSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hitGetUni } from "../../../redux/GetUniSlice";

const UniversityInfo = ({ navigation, route }) => {
  const { from } = route.params;
  const [selectedCountry, setSelectedCountry] = useState("Uzbekistan");
  const [selectedUni, setSelectedUni] = useState(
    "Samarkand State Medical University"
  );
  const [selectedYear, setSelectedYear] = useState("Select Year of Admission");
  const [year, setYear] = useState("Select Year");
  const [selectedSemester, setSelectedSemester] = useState("Select Semester");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleUni, setModalVisibleUni] = useState(false);
  const [selectedModal, setModal] = useState(0);
  const [semesterId, setSemesterId] = useState(1);
  const [profileData, setProfileData] = useState(null);
  const responseProfileData = useSelector(
    (state) => state.getProfileReducer.data
  );

  const dispatch = useDispatch();

  const responseUpdateProfile = useSelector(
    (state) => state.updateProfileReducer.data
  );
  const responseGetUni = useSelector((state) => state.getUniReducer.data);

  const yearArr = [
    {
      id: 1,
      name: "1st",
    },
    {
      id: 2,
      name: "2nd",
    },
    {
      id: 3,
      name: "3rd",
    },
    {
      id: 4,
      name: "4th",
    },
    {
      id: 5,
      name: "5th",
    },
    {
      id: 6,
      name: "6th",
    }
  ];
  const years = [
    {
      id: 2018,
      name: "2018",
    },
    {
      id: 2019,
      name: "2019",
    },
    {
      id: 2020,
      name: "2020",
    },
    {
      id: 2021,
      name: "2021",
    },
    {
      id: 2022,
      name: "2022",
    },
    {
      id: 2023,
      name: "2023",
    },
    {
      id: 2024,
      name: "2024",
    },
    {
      id: 2025,
      name: "2025",
    },
  ];
  const semesters = [
    {
      id: 1,
      name: "1st",
    },
    {
      id: 2,
      name: "2nd",
    },
    {
      id: 3,
      name: "3rd",
    },
    {
      id: 4,
      name: "4th",
    },
    {
      id: 5,
      name: "5th",
    },
    {
      id: 6,
      name: "6th",
    },
    {
      id: 7,
      name: "7th",
    },
    {
      id: 8,
      name: "8th",
    },
    {
      id: 9,
      name: "9th",
    },
    {
      id: 10,
      name: "10th",
    },
    {
      id: 11,
      name: "11th",
    },
    {
      id: 12,
      name: "12th",
    },
  ];

  const [universities, setUniversities] = useState(null);

  // const universities = [
  //   {
  //     id: 1,
  //     name: "Samarkand State Medical University",
  //   },
  //   {
  //     id: 2,
  //     name: "Medical Institute of Karakalpak, Nukus",
  //   },
  // ];

  useEffect(() => {
    dispatch(hitGetUni());
  }, []);

  useEffect(() => {
    if (responseGetUni != null && responseGetUni.status == 1) {
      setUniversities(responseGetUni.data);
    }
  }, [responseGetUni]);

  const selectCountry = (country) => {
    setSelectedCountry(country.name);
    setModalVisible(false);
  };
  const selectUni = (uni) => {
    setSelectedUni(uni.name);
    setModalVisibleUni(false);
  };

  const selectYear = (year) => {
    setSelectedYear(year.name);
    setModalVisibleUni(false);
  };
  const studyYear = (year) => {
    setYear(year.name);
    setModalVisibleUni(false);
  };
  const selectSemester = (semester) => {
    setSelectedSemester(semester.name);
    setModalVisibleUni(false);
    setSemesterId(semester.id);
  };

  const addData = async () => {
    if (selectedYear == "Select Year") {
      Alert.alert("MD House", "Please select the year");
    } else if (selectedSemester == "Select Semester") {
      Alert.alert("MD House", "Please select semester");
    } else {
      await AsyncStorage.setItem(
        "step",
        from == JSON.stringify(1) ? JSON.stringify(2) : JSON.stringify(6)
      );
      const payload = {
        studyCountry: selectedCountry,
        studyUni: selectedUni,
        yearOfJoining: selectedYear,
        yearStudy: year,
        semester: semesterId,
        step: from == 1 ? 2 : 6,
      };

      dispatch(hitUpdateProfile(payload));
    }
  };

  useEffect(() => {
    console.log("responseProfileData ===> ", responseProfileData);
    if (responseProfileData != null && responseProfileData.status == 1) {
      setProfileData(responseProfileData.data);
      setSelectedCountry(responseProfileData.data.studyCountry);
      setSelectedUni(responseProfileData.data.studyUni);
      setSelectedYear(responseProfileData.data.yearOfJoining);
      setYear(responseProfileData.data.yearStudy);
      const semesterName = semesters.find(
        (item) => item.id === responseProfileData.data.semester
      )?.name;
      setSelectedSemester(semesterName);
      setSemesterId(responseProfileData.data.semester);
      // setSelectedUni(responseProfileData.data.studyUni)
    }
  }, [responseProfileData]);

  useEffect(() => {
    if (responseUpdateProfile != null && responseUpdateProfile.status == 1) {
      if (from == 1) {
        navigation.navigate("StudentDetials", { from: 1 });
      } else {
        navigation.goBack();
      }
    } else {
      if (responseUpdateProfile != null) {
        Alert.alert("MD House", responseUpdateProfile.message);
      }
    }
    dispatch(clearUpdateProfile());
  }, [responseUpdateProfile]);

  const onBackClick = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.constainerStyle}>
      <View style={styles.headerStyle}>
        {from != 1 && (
          <TouchableOpacity onPress={() => onBackClick()}>
            <BackIcon height={32} width={32} fill={appColors.white} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerText}>University Info</Text>
      </View>
      <View style={styles.formStyle}>
        <Text style={styles.labelStyle}>Country</Text>
        <View style={styles.viewStyle}>
          <Text style={styles.textStyle}>{selectedCountry}</Text>
          <TouchableOpacity
            onPress={() => {
              setModal(0);
              setModalVisible(true);
            }}
          >
            <DownIcon width={32} height={32} />
          </TouchableOpacity>
        </View>
        <Text style={styles.labelStyle}>University</Text>
        <View style={styles.viewStyle}>
          <Text style={styles.textStyle}>{selectedUni}</Text>
          <TouchableOpacity
            onPress={() => {
              setModal(1);
              setModalVisibleUni(true);
            }}
          >
            <DownIcon width={32} height={32} />
          </TouchableOpacity>
        </View>
        <Text style={styles.labelStyle}>Year of Admission</Text>
        <View style={styles.viewStyle}>
          <Text style={styles.textStyle}>{selectedYear}</Text>
          <TouchableOpacity
            onPress={() => {
              setModal(2);
              setModalVisibleUni(true);
            }}
          >
            <DownIcon width={32} height={32} />
          </TouchableOpacity>
        </View>
        <Text style={styles.labelStyle}>Year of Study</Text>
        <View style={styles.viewStyle}>
          <Text style={styles.textStyle}>{year}</Text>
          <TouchableOpacity
            onPress={() => {
              setModal(4);
              setModalVisibleUni(true);
            }}
          >
            <DownIcon width={32} height={32} />
          </TouchableOpacity>
        </View>
        <Text style={styles.labelStyle}>Semester</Text>
        <View style={styles.viewStyle}>
          <Text style={styles.textStyle}>{selectedSemester}</Text>
          <TouchableOpacity
            onPress={() => {
              setModal(3);
              setModalVisibleUni(true);
            }}
          >
            <DownIcon width={32} height={32} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.buttonStyle} onPress={() => addData()}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <BottomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onItemSelect={
          selectedModal == 0
            ? selectCountry
            : selectedModal == 1
              ? selectCountry
              : selectedModal == 2
                ? selectYear
                : selectSemester
        }
        itemList={
          selectedModal == 0
            ? countries
            : selectedModal == 1
              ? countries
              : selectedModal == 2
                ? years
                : semesters
        }
      />
      {universities != null && (
        <BottomModalUni
          title={
            selectedModal == 1
              ? "Select University"
              : selectedModal == 2
                ? "Select Year"
                : selectedModal == 3 ? "Select Semester" : "Select Year"
          }
          modalVisible={modalVisibleUni}
          setModalVisible={setModalVisibleUni}
          onItemSelect={
            selectedModal == 0
              ? selectCountry
              : selectedModal == 1
                ? selectUni
                : selectedModal == 2
                  ? selectYear
                  : selectedModal == 3 ? selectSemester
                    : studyYear
          }
          itemList={
            selectedModal == 0
              ? countries
              : selectedModal == 1
                ? universities
                : selectedModal == 2
                  ? years
                  : selectedModal == 3
                    ? semesters
                    : yearArr
          }
        />
      )}
    </SafeAreaView>
  );
};

export default UniversityInfo;

const styles = StyleSheet.create({
  constainerStyle: {
    flex: 1,
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
  },
  formStyle: {
    flex: 1,
  },
  labelStyle: {
    marginHorizontal: 18,
    marginTop: 16,
    fontWeight: "600",
    fontSize: 16,
    color: appColors.black,
  },
  textStyle: {
    flex: 1,
    color: appColors.black,
    fontSize: 14,
    paddingVertical: 16,
  },
  viewStyle: {
    marginHorizontal: 16,
    marginTop: 8,
    borderColor: appColors.black,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  buttonStyle: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    backgroundColor: appColors.primaryColor,
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: appColors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
