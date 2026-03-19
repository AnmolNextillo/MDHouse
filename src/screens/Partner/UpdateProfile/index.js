import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { appColors } from "../../../utils/color";
import BackIcon from "../../../assets/svgs/BackIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import DownIcon from "../../../assets/svgs/DownIcon";
import ImagePicker from "react-native-image-crop-picker";
import { useDispatch, useSelector } from "react-redux";
import { clearUpdateProfile, hitUpdateProfile } from "../../../redux/AgentUpdateProfileSlice";
import { clearUploadFileData, uploadFile } from "../../../redux/uploadFile";

const UpdateProfile = ({ navigation }) => {
  const dispatch = useDispatch();

  const responseUpdateProfile = useSelector(
    (state) => state.agentUpdateProfileReducer.data
  );

  /* ================= STATES ================= */

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [mobile, setMobile] = useState("");
  const [officeContact, setOfficeContact] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [gst, setGst] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [pan, setPan] = useState("");
    const [key, setKey] = useState(null);

  const [images, setImages] = useState({
    panImage: null,
    aadhaarFront: null,
    aadhaarBack: null,
  });

  const responseUploadImage = useSelector((state) => state.uploadFileReducer.data);

  /* ================= IMAGE PICK ================= */

//   const pickImage = async (key) => {
//     try {
//       const image = await ImagePicker.openPicker({
//         width: 400,
//         height: 400,
//         cropping: true,
//       });

//       setImages({ ...images, [key]: image.path });
//     } catch (error) {
//       console.log(error);
//     }
//   };

      const pickImage = async (key) => {
        try {
           setKey(key);
            const image = await ImagePicker.openPicker({
                width: 400,
                height: 400,
                cropping: true,
            });
           
           console.log("Key ====> ",key)
            dispatch(uploadFile({ uri: image.path, fileName: image.filename, type: image.mime }));
            // setImages({ ...images, [key]: image.path });
        } catch (e) { }
    };

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    if (!name || !mobile || !images.panImage || !images.aadhaarFront || !images.aadhaarBack || !companyName || !officeContact || !address || !gst || !aadhaar || !pan) {
      Alert.alert("MD House", "Please fill required fields");
      return;
    }

    const payload = {
      name,
      companyName,
      mobileNumber: mobile,
      officeNumber:officeContact,
      headOfficeAddress:address,
      gst,
      adhaarNumber:aadhaar,
      panCard:pan,
      panCardImage: images.panImage,
      aadhaarImageFront: images.aadhaarFront,
      aadhaarImageBack: images.aadhaarBack,
    };

    dispatch(hitUpdateProfile(payload));
  };

  /* ================= RESPONSE ================= */

  useEffect(() => {
    if (responseUpdateProfile) {
      if (responseUpdateProfile.status === 1) {
        Alert.alert("MD House", "Profile Updated Successfully");
        navigation.goBack();
      } else {
        Alert.alert("MD House", responseUpdateProfile.message);
      }

      dispatch(clearUpdateProfile());
    }
  }, [responseUpdateProfile]);

   useEffect(() => {
          if (responseUploadImage != null) {
              // setReceiptUrl(responseUploadImage.Location);
              console.log("Key ===> ", key, " Response Location ====> ", responseUploadImage.Location)
              setImages({ ...images, [key]: responseUploadImage.Location });
              dispatch(clearUploadFileData());
          }
      }, [responseUploadImage]);

  /* ================= COMMON INPUT ================= */

  const renderInput = (label, value, setter, keyboard = "default") => (
    <>
      <Text style={styles.labelStyle}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={setter}
          style={styles.textInput}
          keyboardType={keyboard}
          placeholder={`Enter ${label}`}
        />
      </View>
    </>
  );

  /* ================= IMAGE UI ================= */

  const renderImage = (label, key) => (
    <>
      <Text style={styles.labelStyle}>{label}</Text>

      <TouchableOpacity
        style={styles.imageBox}
        onPress={() => pickImage(key)}
      >
        {images[key] ? (
          <Image source={{ uri: images[key] }} style={styles.image} />
        ) : (
          <Text style={{ color: appColors.grey }}>Select Image</Text>
        )}
      </TouchableOpacity>
    </>
  );

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.constainerStyle}>
      {/* HEADER */}
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Update Profile</Text>
      </View>

      <ScrollView>
        {renderInput("Name", name, setName)}
        {renderInput("Company Name", companyName, setCompanyName)}
        {renderInput("Mobile Number", mobile, setMobile, "phone-pad")}
        {renderInput("Office Contact", officeContact, setOfficeContact, "phone-pad")}
        {renderInput("Head Office Address", address, setAddress)}
        {renderInput("GST Number", gst, setGst)}
        {renderInput("Aadhaar Number", aadhaar, setAadhaar, "numeric")}
        {renderInput("PAN Number", pan, setPan)}

        {renderImage("PAN Card Photo", "panImage")}
        {renderImage("Aadhaar Front Image", "aadhaarFront")}
        {renderImage("Aadhaar Back Image", "aadhaarBack")}

        <TouchableOpacity style={styles.buttonStyle} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateProfile;

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
    borderWidth: 1,
    borderColor: appColors.grey,
    borderRadius: 8,
    marginTop: 8,
    height: 45,
    paddingHorizontal: 8,
    marginHorizontal: 16,
    justifyContent: "center",
  },

  textInput: {
    color: appColors.black,
  },

  imageBox: {
    height: 120,
    borderWidth: 1,
    borderColor: appColors.grey,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  buttonStyle: {
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