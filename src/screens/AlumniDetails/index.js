import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackIcon from "../../assets/svgs/BackIcon";
import DownIcon from "../../assets/svgs/DownIcon";
import BottomModal from "../../components/BottomModal";
import BottomModalUni from "../../components/BottomModalUni";
import { appColors } from "../../utils/color";
import { hitGetUni } from "../../redux/GetUniSlice";
import { useDispatch, useSelector } from "react-redux";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import countries from "../../assets/countries.json";
import {
  clearUpdateProfile,
  hitUpdateProfile,
} from "../../redux/UpdateProfileSlice";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CountryCodeModal from "../../components/CountryCodeModal";

const AlumniDetails = ({ navigation }) => {
  const dispatch = useDispatch();
  const countriesCode = getCountries();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleCountry, setModalVisibleCountry] = useState(false);
  const [modalVisibleUni, setModalVisibleUni] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);

  const [country, setCountry] = useState("Select Country");
  const [university, setUniversity] = useState("Select University");
  const [passoutYear, setPassoutYear] = useState("Select Passout Year");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [mobileCallingCode, setMobileCallingCode] = useState("+91");
  const [whatsappCallingCode, setWhatsappCallingCode] = useState("+91");

  const [workingAt, setWorkingAt] = useState("");
  const [universities, setUniversities] = useState([]);

  const responseProfileData = useSelector(
    (state) => state.getProfileReducer.data,
  );

  const responseGetUni = useSelector((state) => state.getUniReducer.data);

  const responseUpdateProfile = useSelector(
    (state) => state.updateProfileReducer.data,
  );

  /* ================= PROFILE DATA ================= */

  useEffect(() => {
    if (responseProfileData?.status === 1) {
      const data = responseProfileData.data;

      setCountry(data.country || "Select Country");
      setUniversity(data.studyUni || "Select University");
      setPassoutYear(data.passoutYear || "Select Passout Year");
      setAddress(data.address || "");
      setCity(data.city || "");
      setState(data.state || "");
      setMobile(data.mobileNumber || "");
      setWhatsapp(data.whatsAppMobileNumber || "");
      setWorkingAt(data.workingAt || "");

      if (data.countryCode)
        setMobileCallingCode(data.countryCode);
      if (data.whatsappCountryCode)
        setWhatsappCallingCode(data.whatsappCountryCode);
    }
  }, [responseProfileData]);

  /* ================= GET UNIVERSITIES ================= */

  useEffect(() => {
    dispatch(hitGetUni());
  }, []);

  useEffect(() => {
    if (responseGetUni?.status === 1) {
      setUniversities(responseGetUni.data);
    }
  }, [responseGetUni]);

  /* ================= UPDATE RESPONSE ================= */

  useEffect(() => {
    if (responseUpdateProfile?.status === 1) {
      navigation.reset({
        index: 0,
        routes: [{ name: "BottomBar" }],
      });
    }
    dispatch(clearUpdateProfile());
  }, [responseUpdateProfile]);

  /* ================= SELECT HANDLERS ================= */

  const selectCountry = (item) => {
    setCountry(item.name);
    setModalVisible(false);
  };

  const selectCountryCode = (item) => {
    if (selectedModal === "mobile") {
      setMobileCallingCode(item.dialCode);
    } else if (selectedModal === "whatsapp") {
      setWhatsappCallingCode(item.dialCode);
    }

    setModalVisibleCountry(false);
  };

  const selectUniversity = (item) => {
    setUniversity(item.name);
    setModalVisibleUni(false);
  };

  const selectYear = (item) => {
    setPassoutYear(item.name);
    setModalVisibleUni(false);
  };

  /* ================= SUBMIT ================= */

  const onSubmit = () => {
    if (country === "Select Country")
      return Alert.alert("MD House", "Please select country");

    if (university === "Select University")
      return Alert.alert("MD House", "Please select university");

    if (passoutYear === "Select Passout Year")
      return Alert.alert("MD House", "Please select passout year");

    if (!mobile) return Alert.alert("MD House", "Please enter mobile number");

    const payload = {
      country,
      studyUni: university,
      passoutYear,
      address,
      city,
      state,
      mobileNumber: mobile,
      whatsAppMobileNumber: whatsapp,
      countryCode: mobileCallingCode,
      whatsappCountryCode: whatsappCallingCode,
      workingAt,
    };

    dispatch(hitUpdateProfile(payload));
  };

  const years = Array.from({ length: 30 }, (_, i) => ({
    id: 2025 - i,
    name: `${2025 - i}`,
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Alumni Details</Text>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formStyle}>
          {/* Country */}
          <Text style={styles.labelStyle}>Country</Text>
          <View style={styles.viewStyle}>
            <Text style={styles.textStyle}>{country}</Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedModal("country");
                setModalVisible(true);
              }}
            >
              <DownIcon width={28} height={28} />
            </TouchableOpacity>
          </View>

          {/* University */}
          <Text style={styles.labelStyle}>University</Text>
          <View style={styles.viewStyle}>
            <Text style={styles.textStyle}>{university}</Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedModal(1);
                setModalVisibleUni(true);
              }}
            >
              <DownIcon width={28} height={28} />
            </TouchableOpacity>
          </View>

          {/* Passout Year */}
          <Text style={styles.labelStyle}>Passout Year</Text>
          <View style={styles.viewStyle}>
            <Text style={styles.textStyle}>{passoutYear}</Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedModal(2);
                setModalVisibleUni(true);
              }}
            >
              <DownIcon width={28} height={28} />
            </TouchableOpacity>
          </View>

          {/* Address */}
          <Text style={styles.labelStyle}>Address</Text>
          <TextInput
            style={styles.inputStyle}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter address"
          />

          {/* City */}
          <Text style={styles.labelStyle}>City</Text>
          <TextInput
            style={styles.inputStyle}
            value={city}
            onChangeText={setCity}
            placeholder="Enter city"
          />

          {/* State */}
          <Text style={styles.labelStyle}>State</Text>
          <TextInput
            style={styles.inputStyle}
            value={state}
            onChangeText={setState}
            placeholder="Enter state"
          />

          {/* Mobile */}
          <Text style={styles.labelStyle}>Mobile Number</Text>
          <View style={styles.phoneWrapper}>
            <TouchableOpacity
              style={styles.codeBox}
              onPress={() => {
                setSelectedModal("mobile");
                setModalVisibleCountry(true);
              }}
            >
              <Text style={styles.codeText}>+{mobileCallingCode}</Text>
              <DownIcon width={16} height={16} />
            </TouchableOpacity>

            <TextInput
              style={styles.numberInput}
              keyboardType="number-pad"
              value={mobile}
              onChangeText={setMobile}
              placeholder="Enter mobile number"
              maxLength={15}
            />
          </View>

          {/* WhatsApp */}
          <Text style={styles.labelStyle}>WhatsApp Number</Text>
          <View style={styles.phoneWrapper}>
            <TouchableOpacity
              style={styles.codeBox}
              onPress={() => {
                setSelectedModal("whatsapp");
                setModalVisibleCountry(true);
              }}
            >
              <Text style={styles.codeText}>{whatsappCallingCode}</Text>
              <DownIcon width={16} height={16} />
            </TouchableOpacity>

            <TextInput
              style={styles.numberInput}
              keyboardType="number-pad"
              value={whatsapp}
              onChangeText={setWhatsapp}
              placeholder="Enter WhatsApp number"
              maxLength={15}
            />
          </View>

          {/* Working At */}
          <Text style={styles.labelStyle}>Working At</Text>
          <TextInput
            style={styles.inputStyle}
            value={workingAt}
            onChangeText={setWorkingAt}
            placeholder="Company / Hospital Name"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={onSubmit}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      {/* Country Modal */}
      <BottomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onItemSelect={selectCountry}
        itemList={countries}
      />
      <CountryCodeModal
        modalVisible={modalVisibleCountry}
        setModalVisible={setModalVisibleCountry}
        onItemSelect={selectCountryCode}
        itemList={countries}
      />

      {/* University / Year Modal */}
      <BottomModalUni
        title={
          selectedModal === 1 ? "Select University" : "Select Passout Year"
        }
        modalVisible={modalVisibleUni}
        setModalVisible={setModalVisibleUni}
        onItemSelect={selectedModal === 1 ? selectUniversity : selectYear}
        itemList={selectedModal === 1 ? universities : years}
      />
    </SafeAreaView>
  );
};

export default AlumniDetails;
/* ================= Styles ================= */

const styles = StyleSheet.create({
  container: {
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
    fontWeight: "600",
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
  inputStyle: {
    marginHorizontal: 16,
    marginTop: 8,
    borderColor: appColors.black,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 14,
    color: appColors.black,
  },
  phoneContainer: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  phoneInputContainer: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: appColors.grey,
  },
  phoneTextContainer: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "#fff",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  phoneTextInput: {
    color: appColors.black,
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginTop: Platform.OS === "android" ? -2 : 0,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white",
  },
  buttonStyle: {
    paddingVertical: 16,
    backgroundColor: appColors.primaryColor,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: appColors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  label: {
    marginHorizontal: 16,
    marginTop: 16,
    fontSize: 14,
    color: appColors.black,
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
    fontSize: 14,
    color: appColors.black,
  },
  numberInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    color: appColors.black,
  },
  modalContainer: {
    backgroundColor: appColors.white,
    maxHeight: "70%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 12,
  },
  countryItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: appColors.grey,
  },
  countryText: {
    fontSize: 14,
    color: appColors.black,
  },
});
