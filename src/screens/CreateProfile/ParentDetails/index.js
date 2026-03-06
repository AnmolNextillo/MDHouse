import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
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
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CountryCodeModal from "../../../components/CountryCodeModal";
import countries from "../../../assets/countries.json";

const ParentDetails = ({ navigation, route }) => {
  const { from } = route.params;
  const dispatch = useDispatch();
  // const countries = getCountries();

  const responseProfileData = useSelector(
    (state) => state.getProfileReducer.data
  );
  const responseUpdateProfile = useSelector(
    (state) => state.updateProfileReducer.data
  );

  /* ================= STATES ================= */

  const [fatherName, setFatherName] = useState("");
  const [fatherEmail, setFatherEmail] = useState("");
  const [motherName, setMotherName] = useState("");
  const [motherEmail, setMotherEmail] = useState("");

  const [fatherPhoneNumber, setFatherPhoneNumber] = useState("");
  const [fatherWappNumber, setFatherWappNumber] = useState("");
  const [motherPhoneNumber, setMotherPhoneNumber] = useState("");
  const [motherWappNumber, setMotherWappNumber] = useState("");

  const [fatherCountryCode, setFatherCountryCode] = useState("+91");
  const [fatherCountryCodeW, setFatherCountryCodeW] = useState("+91");
  const [motherCountryCode, setMotherCountryCode] = useState("+91");
  const [motherCountryCodeW, setMotherCountryCodeW] = useState("+91");

  const [modalVisibleCountry, setModalVisibleCountry] = useState(false);
  const [selectedModal, setSelectedModal] = useState("");
  const [searchText, setSearchText] = useState("");

  /* ================= UPDATE PROFILE ================= */

  const updateParentDetails = async () => {
    if (!fatherName || !fatherEmail || !motherName || !motherEmail) {
      Alert.alert("MD House", "All fields are required");
      return;
    }

    await AsyncStorage.setItem(
      "step",
      from === 1 ? JSON.stringify(4) : JSON.stringify(6)
    );

    const payload = {
      fatherName,
      fatherEmail,
      fatherMobileNumber: fatherPhoneNumber,
      fatherWhatsAppMobileNumber: fatherWappNumber,
      motherName,
      motherEmail,
      motherMobileNumber: motherPhoneNumber,
      motherWhatsAppMobileNumber: motherWappNumber,
      fatherMobileCountryCode: fatherCountryCode,
      fatherWhatsAppCountryCode: fatherCountryCodeW,
      motherMobileCountryCode: motherCountryCode,
      motherWhatsAppCountryCode: motherCountryCodeW,
      step: from === 1 ? 4 : 6,
    };

    dispatch(hitUpdateProfile(payload));
  };

  /* ================= COUNTRY SELECT ================= */

  const selectCountry = (item) => {
    console.log("Selected Country:", item);
    const dialCode = item.dialCode;
    

    switch (selectedModal) {
      case "fatherMobile":
        setFatherCountryCode(dialCode);
        break;
      case "fatherWhatsapp":
        setFatherCountryCodeW(dialCode);
        break;
      case "motherMobile":
        setMotherCountryCode(dialCode);
        break;
      case "motherWhatsapp":
        setMotherCountryCodeW(dialCode);
        break;
    }

    setModalVisibleCountry(false);
  };

  // const filteredCountries = countries.filter((c) =>
  //   c.toLowerCase().includes(searchText.toLowerCase())
  // );

  /* ================= PREFILL DATA ================= */

  useEffect(() => {
    if (responseProfileData?.status === 1) {
      const data = responseProfileData.data;

      setFatherName(data.fatherName || "");
      setFatherEmail(data.fatherEmail || "");
      setFatherPhoneNumber(data.fatherMobileNumber || "");
      setFatherWappNumber(data.fatherWhatsAppMobileNumber || "");
      setMotherName(data.motherName || "");
      setMotherEmail(data.motherEmail || "");
      setMotherPhoneNumber(data.motherMobileNumber || "");
      setMotherWappNumber(data.motherWhatsAppMobileNumber || "");

      if (data.fatherMobileCountryCode)
        setFatherCountryCode(data.fatherMobileCountryCode);
      if (data.fatherWhatsAppCountryCode)
        setFatherCountryCodeW(data.fatherWhatsAppCountryCode);
      if (data.motherMobileCountryCode)
        setMotherCountryCode(data.motherMobileCountryCode);
      if (data.motherWhatsAppCountryCode)
        setMotherCountryCodeW(data.motherWhatsAppCountryCode);
    }
  }, [responseProfileData]);

  /* ================= RESPONSE HANDLING ================= */

  useEffect(() => {
    if (responseUpdateProfile) {
      if (responseUpdateProfile.status === 1) {
        if (from === 1) {
          navigation.navigate("StudentAddress", { from: 1 });
        } else {
          navigation.goBack();
        }
      } else {
        Alert.alert("MD House", responseUpdateProfile.message);
      }
      dispatch(clearUpdateProfile());
    }
  }, [responseUpdateProfile]);

  /* ================= UI ================= */

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Parent Details</Text>
      </View>

      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        {/* Father */}
        <Text style={styles.labelStyle}>Father Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={fatherName}
            onChangeText={setFatherName}
            placeholder="Enter Name"
            style={styles.textInput}
          />
        </View>

        <Text style={styles.labelStyle}>Father Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={fatherEmail}
            onChangeText={setFatherEmail}
            placeholder="Enter Email"
            keyboardType="email-address"
            style={styles.textInput}
          />
        </View>

        {renderPhoneInput(
          "Father Phone Number",
          fatherPhoneNumber,
          setFatherPhoneNumber,
          fatherCountryCode,
          "fatherMobile"
        )}

        {renderPhoneInput(
          "Father WhatsApp Number",
          fatherWappNumber,
          setFatherWappNumber,
          fatherCountryCodeW,
          "fatherWhatsapp"
        )}

        {/* Mother */}
        <Text style={styles.labelStyle}>Mother Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={motherName}
            onChangeText={setMotherName}
            placeholder="Enter Name"
            style={styles.textInput}
          />
        </View>

        <Text style={styles.labelStyle}>Mother Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={motherEmail}
            onChangeText={setMotherEmail}
            placeholder="Enter Email"
            keyboardType="email-address"
            style={styles.textInput}
          />
        </View>

        {renderPhoneInput(
          "Mother Phone Number",
          motherPhoneNumber,
          setMotherPhoneNumber,
          motherCountryCode,
          "motherMobile"
        )}

        {renderPhoneInput(
          "Mother WhatsApp Number",
          motherWappNumber,
          setMotherWappNumber,
          motherCountryCodeW,
          "motherWhatsapp"
        )}

        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={updateParentDetails}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      {/* COUNTRY MODAL */}
     <CountryCodeModal
        modalVisible={modalVisibleCountry}
        setModalVisible={setModalVisibleCountry}
        onItemSelect={selectCountry}
        itemList={countries}
      />
    </SafeAreaView>
  );
};

export default ParentDetails;

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
  },

  labelStyle: {
    marginHorizontal: 16,
    marginTop: 16,
    fontWeight: "600",
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

  textInput: { flex: 1 },

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

  codeText: { marginRight: 6 },

  numberInput: { flex: 1, paddingHorizontal: 12 },

  buttonStyle: {
    margin: 16,
    padding: 16,
    backgroundColor: appColors.primaryColor,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "600" },

  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 16,
    borderRadius: 8,
    padding: 10,
  },

  countryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  closeBtn: {
    backgroundColor: appColors.primaryColor,
    padding: 16,
    alignItems: "center",
    margin: 16,
    borderRadius: 8,
  },
});