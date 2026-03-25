import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { appColors } from "../../../utils/color";
import BackIcon from "../../../assets/svgs/BackIcon";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePickerIcon from "../../../assets/svgs/DatePickerIcon";
import DownIcon from "../../../assets/svgs/DownIcon";
import BottomModalUni from "../../../components/BottomModalUni";
import CountryCodeModal from "../../../components/CountryCodeModal";
import countries from "../../../assets/countries.json";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUpdateProfile,
  hitUpdateProfile,
} from "../../../redux/UpdateProfileSlice";
import { useIsFocused } from "@react-navigation/native";
import { clearGetProfile, hitGetProfile } from "../../../redux/GetProfileSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StudentDetials = ({ navigation, route }) => {
  const { from } = route.params;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const responseProfileData = useSelector(
    (state) => state.getProfileReducer.data,
  );

  const responseUpdateProfile = useSelector(
    (state) => state.updateProfileReducer.data,
  );

  /* ================= STATES ================= */

  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("Select Blood Group");
  const [passportNumber, setPassportNumber] = useState("");

  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Manual Phone
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const [modalVisibleCountry, setModalVisibleCountry] = useState(false);

  /* ================= DATE ================= */

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === "ios");
    setDob(currentDate);
  };

  /* ================= BLOOD GROUP ================= */

  const bloodGroups = [
    { name: "A+", value: "A+" },
    { name: "A−", value: "A−" },
    { name: "B+", value: "B+" },
    { name: "B−", value: "B−" },
    { name: "AB+", value: "AB+" },
    { name: "AB−", value: "AB−" },
    { name: "O+", value: "O+" },
    { name: "O−", value: "O−" },
  ];

  const onItemClick = (item) => {
    setBloodGroup(item.name);
    setModalVisible(false);
  };

  /* ================= API CALL ================= */

  useEffect(() => {
    if (isFocused) {
    dispatch(hitGetProfile({usertype:1}));
    }
  }, [isFocused]);

  const addStudentDetails = async () => {
    if (!name) {
      Alert.alert("MD House", "All fields are required");
      return;
    }

    await AsyncStorage.setItem(
      "step",
      from === 1 ? JSON.stringify(3) : JSON.stringify(6),
    );

    const payload = {
      name,
      dateOfBirth: dob.toISOString().slice(0, 10),
      countryCode: countryCode,
      mobileNumber: phoneNumber,
      passportNumber,
      bloodGroup,
      step: from === 1 ? 3 : 6,
    };

    dispatch(hitUpdateProfile(payload));
  };

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (responseProfileData?.status === 1) {
      const data = responseProfileData.data;

      setName(data.name || "");
      setBloodGroup(data.bloodGroup || "Select Blood Group");
      setPassportNumber(data.passportNumber || "");

      if (data.mobileNumber) setPhoneNumber(data.mobileNumber);
      if (data.countryCode) setCountryCode(data.countryCode);

      if (data.dateOfBirth) setDob(new Date(data.dateOfBirth));
    }
  }, [responseProfileData, isFocused]);

  /* ================= RESPONSE ================= */

  useEffect(() => {
    if (responseUpdateProfile) {
      if (responseUpdateProfile.status === 1) {
        if (from === 1) {
          navigation.navigate("ParentDetials", { from: 1 });
        } else {
          navigation.goBack();
        }
      } else {
        Alert.alert("MD House", responseUpdateProfile.message);
      }

      dispatch(clearUpdateProfile());
    }
  }, [responseUpdateProfile]);

  /* ================= BACK ================= */

  const onBackPress = () => {
    if (from === 1) {
      navigation.reset({
        index: 0,
        routes: [{ name: "UniversityInfo", params: { from: 1 } }],
      });
    } else {
      navigation.goBack();
    }
  };

  /* ================= PHONE UI ================= */

  const renderPhoneInput = () => (
    <>
      <Text style={styles.labelStyle}>Phone Number</Text>
      <View style={styles.phoneWrapper}>
        <TouchableOpacity
          style={styles.codeBox}
          onPress={() => setModalVisibleCountry(true)}
        >
          <Text style={styles.codeText}>{countryCode}</Text>
          <DownIcon width={16} height={16} />
        </TouchableOpacity>

        <TextInput
          style={styles.numberInput}
          keyboardType="number-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter mobile number"
          maxLength={15}
        />
      </View>
    </>
  );

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.constainerStyle}>
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={onBackPress}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Student Details</Text>
      </View>

      <ScrollView>
        <Text style={styles.labelStyle}>Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Name"
            value={name}
            onChangeText={setName}
            style={styles.textInput}
          />
        </View>

        <Text style={styles.labelStyle}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ flex: 1, color: appColors.black }}>
            {dob.toISOString().slice(0, 10)}
          </Text>
          <DatePickerIcon height={32} width={32} />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {renderPhoneInput()}

        <Text style={styles.labelStyle}>Passport Number</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Passport Number"
            value={passportNumber}
            onChangeText={setPassportNumber}
            style={styles.textInput}
          />
        </View>

        <Text style={styles.labelStyle}>Blood Group</Text>
        <View style={styles.viewStyle}>
          <Text style={styles.textStyle}>{bloodGroup}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <DownIcon width={32} height={32} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={addStudentDetails}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* BLOOD GROUP MODAL */}
      <BottomModalUni
        title="Select Blood Group"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onItemSelect={onItemClick}
        itemList={bloodGroups}
      />

      {/* COUNTRY MODAL */}
      <CountryCodeModal
        modalVisible={modalVisibleCountry}
        setModalVisible={setModalVisibleCountry}
        onItemSelect={(item) => {
          setCountryCode(item.dialCode);
          setModalVisibleCountry(false);
        }}
        itemList={countries}
      />
    </SafeAreaView>
  );
};

export default StudentDetials;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  constainerStyle: {
    flex: 1,
    backgroundColor: appColors.white,
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

  labelStyle: {
    marginHorizontal: 18,
    marginTop: 16,
    fontWeight: "600",
    fontSize: 16,
    color: appColors.black,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: appColors.grey,
    borderRadius: 8,
    marginTop: 8,
    height: 45,
    paddingHorizontal: 8,
    marginHorizontal: 16,
  },

  textInput: {
    color: appColors.black,
    width: "100%",
  },

  phoneWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: appColors.grey,
    borderRadius: 8,
    height: 50,
  },

  codeBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderColor: appColors.grey,
    height: "100%",
  },

  codeText: {
    marginRight: 6,
    color: appColors.black,
  },

  numberInput: {
    flex: 1,
    paddingHorizontal: 12,
    color: appColors.black,
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

  textStyle: {
    flex: 1,
    color: appColors.black,
    fontSize: 14,
    paddingVertical: 12,
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
