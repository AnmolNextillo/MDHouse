import {
  Alert,
  KeyboardAvoidingView,
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
import DownIcon from "../../../assets/svgs/DownIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUpdateProfile,
  hitUpdateProfile,
} from "../../../redux/UpdateProfileSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountryCodeModal from "../../../components/CountryCodeModal";
import countries from "../../../assets/countries.json";

const StudentAddress = ({ navigation, route }) => {
  const { from } = route.params;
  const dispatch = useDispatch();

  const responseProfileData = useSelector(
    (state) => state.getProfileReducer.data
  );
  const responseUpdateProfile = useSelector(
    (state) => state.updateProfileReducer.data
  );

  /* ================= STATES ================= */

  // India Address
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");

  // Foreign Address
  const [landmarkF, setLandmarkF] = useState("");
  const [cityF, setCityF] = useState("");
  const [stateF, setStateF] = useState("");
  const [pinCodeF, setPinCodeF] = useState("");

  // Foreign Contact
  const [phoneNumberF, setPhoneNumberF] = useState("");
  const [phoneNumberW, setPhoneNumberW] = useState("");

  const [phoneCountryCodeF, setPhoneCountryCodeF] = useState("+91");
  const [phoneCountryCodeW, setPhoneCountryCodeW] = useState("+91");

  const [modalVisibleCountry, setModalVisibleCountry] = useState(false);
  const [selectedModal, setSelectedModal] = useState("");

  /* ================= UPDATE PROFILE ================= */

  const updateStudentAddress = async () => {
    if (
      !landmark ||
      !city ||
      !state ||
      !pinCode ||
      !landmarkF ||
      !cityF ||
      !stateF ||
      !pinCodeF
    ) {
      Alert.alert("MD House", "All fields are required.");
      return;
    }

    await AsyncStorage.setItem(
      "step",
      from === 1 ? JSON.stringify(5) : JSON.stringify(6)
    );

    const payload = {
      address: landmark,
      city,
      state,
      pinCode,

      studyAddress: landmarkF,
      studyCity: cityF,
      studyState: stateF,
      studyPinCode: pinCodeF,

      studyMobileNumber: phoneNumberF,
      studyWhatsAppMobileNumber: phoneNumberW,

      studyMobileCountryCode: phoneCountryCodeF,
      studyWhatsAppCountryCode: phoneCountryCodeW,

      step: from === 1 ? 5 : 6,
    };

    dispatch(hitUpdateProfile(payload));
  };

  /* ================= COUNTRY SELECT ================= */

  const selectCountry = (item) => {
    const dialCode = item.dialCode;

    if (selectedModal === "studyMobile") {
      setPhoneCountryCodeF(dialCode);
    } else if (selectedModal === "studyWhatsapp") {
      setPhoneCountryCodeW(dialCode);
    }

    setModalVisibleCountry(false);
  };

  /* ================= PREFILL DATA ================= */

  useEffect(() => {
    if (responseProfileData?.status === 1) {
      const data = responseProfileData.data;

      // India
      setLandmark(data.address || "");
      setCity(data.city || "");
      setState(data.state || "");
      setPinCode(data.pinCode || "");

      // Foreign
      setLandmarkF(data.studyAddress || "");
      setCityF(data.studyCity || "");
      setStateF(data.studyState || "");
      setPinCodeF(data.studyPinCode || "");

      setPhoneNumberF(data.studyMobileNumber || "");
      setPhoneNumberW(data.studyWhatsAppMobileNumber || "");

      if (data.studyMobileCountryCode)
        setPhoneCountryCodeF(data.studyMobileCountryCode);

      if (data.studyWhatsAppCountryCode)
        setPhoneCountryCodeW(data.studyWhatsAppCountryCode);
    }
  }, [responseProfileData]);

  /* ================= RESPONSE HANDLING ================= */

  useEffect(() => {
    if (responseUpdateProfile) {
      if (responseUpdateProfile.status === 1) {
        if (from === 1) {
          navigation.navigate("DocumentUpload", { from: 3 });
        } else {
          navigation.goBack();
        }
      } else {
        Alert.alert("MD House", responseUpdateProfile.message);
      }

      dispatch(clearUpdateProfile());
    }
  }, [responseUpdateProfile]);

  /* ================= PHONE INPUT UI ================= */

  const renderPhoneInput = (
    label,
    number,
    setNumber,
    code,
    modalKey
  ) => (
    <>
      <Text style={styles.labelStyle}>{label}</Text>
      <View style={styles.phoneWrapper}>
        <TouchableOpacity
          style={styles.codeBox}
          onPress={() => {
            setSelectedModal(modalKey);
            setModalVisibleCountry(true);
          }}
        >
          <Text style={styles.codeText}>{code}</Text>
          <DownIcon width={16} height={16} />
        </TouchableOpacity>

        <TextInput
          style={styles.numberInput}
          keyboardType="number-pad"
          value={number}
          onChangeText={setNumber}
          placeholder="Enter mobile number"
          maxLength={15}
        />
      </View>
    </>
  );

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Student Address</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* INDIA ADDRESS */}
          <Text style={styles.sectionTitle}>Address (India)</Text>

          <Text style={styles.labelStyle}>Address</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="H. No., apartment, street etc."
              value={landmark}
              onChangeText={setLandmark}
              style={styles.textInput}
            />
          </View>

          <Text style={styles.labelStyle}>City</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter City"
              value={city}
              onChangeText={setCity}
              style={styles.textInput}
            />
          </View>

          <Text style={styles.labelStyle}>State</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter State"
              value={state}
              onChangeText={setState}
              style={styles.textInput}
            />
          </View>

          <Text style={styles.labelStyle}>Pin Code</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter Pin Code"
              value={pinCode}
              onChangeText={setPinCode}
              keyboardType="number-pad"
              style={styles.textInput}
            />
          </View>

          {/* FOREIGN CONTACT */}
          <Text style={styles.sectionTitle}>Contact (Foreign)</Text>

          {renderPhoneInput(
            "Phone Number",
            phoneNumberF,
            setPhoneNumberF,
            phoneCountryCodeF,
            "studyMobile"
          )}

          {renderPhoneInput(
            "WhatsApp Number",
            phoneNumberW,
            setPhoneNumberW,
            phoneCountryCodeW,
            "studyWhatsapp"
          )}

          {/* FOREIGN ADDRESS */}
          <Text style={styles.sectionTitle}>Address (Foreign)</Text>

          <Text style={styles.labelStyle}>Address</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="H. No., apartment, street etc."
              value={landmarkF}
              onChangeText={setLandmarkF}
              style={styles.textInput}
            />
          </View>

          <Text style={styles.labelStyle}>City</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter City"
              value={cityF}
              onChangeText={setCityF}
              style={styles.textInput}
            />
          </View>

          <Text style={styles.labelStyle}>State</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter State"
              value={stateF}
              onChangeText={setStateF}
              style={styles.textInput}
            />
          </View>

          <Text style={styles.labelStyle}>Pin Code</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter Pin Code"
              value={pinCodeF}
              onChangeText={setPinCodeF}
              keyboardType="number-pad"
              style={styles.textInput}
            />
          </View>

          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={updateStudentAddress}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <CountryCodeModal
        modalVisible={modalVisibleCountry}
        setModalVisible={setModalVisibleCountry}
        onItemSelect={selectCountry}
        itemList={countries}
      />
    </SafeAreaView>
  );
};

export default StudentAddress;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.white },

  headerStyle: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: appColors.primaryColor,
    alignItems: "center",
  },

  headerText: {
    fontSize: 16,
    color: "#fff",
    flex: 1,
    textAlign: "center",
    marginRight: 32,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
    color: appColors.black,
  },

  labelStyle: {
    marginHorizontal: 16,
    marginTop: 16,
    fontWeight: "600",
    color: appColors.black,
  },

  inputContainer: {
    borderWidth: 1,
    borderColor: appColors.grey,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 8,
    height: 45,
    justifyContent: "center",
  },

  textInput: { flex: 1, color: appColors.black },

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

  codeText: { marginRight: 6, color: appColors.black },

  numberInput: {
    flex: 1,
    paddingHorizontal: 12,
    color: appColors.black,
  },

  buttonStyle: {
    margin: 16,
    padding: 16,
    backgroundColor: appColors.primaryColor,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "600" },
});