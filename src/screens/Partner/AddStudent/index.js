import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { appColors } from "../../../utils/color";
import BackIcon from "../../../assets/svgs/BackIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import ImagePicker from "react-native-image-crop-picker";
import { profile } from "../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { clearAgentAddStudent, hitAgentAddStudent } from "../../../redux/AgentAddStudentSlice";
import { clearUploadFileData, uploadFile } from "../../../redux/uploadFile";

const AddStudent = ({ navigation }) => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
    });

    const [key, setKey] = useState(null);

    const dispatch = useDispatch();

    const responseAddStudent = useSelector(
        (state) => state.agentAddStudentReducer.data
    );
    const responseUploadImage = useSelector((state) => state.uploadFileReducer.data);

    const [images, setImages] = useState({
        profile: "",
        pan: "",
        marksheet: "",
        passportFront: "",
        passportBack: "",
        aadhaarFront: "",
        aadhaarBack: "",
        neet: "",
    });

    const handleSubmit = () => {
        if (!form.name || !form.mobile || !form.email || !images.profile) {
            Alert.alert("Error", "Name, Mobile, Email and Profile Image are required");
            return;
        }

        const payload = {
            name: form.name,
            email: form.email,
            mobileNumber: form.mobile,
            profileImage: images.profile,
            aadhaarImageBack: images.aadhaarBack,
            aadhaarImageFront: images.aadhaarFront,
            plusTwoImage: images.marksheet,
            passportImageBack: images.passportFront,
            passportImageFront: images.passportBack,
            neetImage: images.neet,
        };

        dispatch(hitAgentAddStudent(payload));

        console.log("DATA", form, images);
    };

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const pickImage = async (key) => {
        try {
            setKey(key);
            const image = await ImagePicker.openPicker({
                width: 400,
                height: 400,
                cropping: true,
            });

            console.log("Key ====> ", key)
            dispatch(uploadFile({ uri: image.path, fileName: image.filename, type: image.mime }));
            // setImages({ ...images, [key]: image.path });
        } catch (e) { }
    };


    useEffect(() => {
        if (responseAddStudent != null && responseAddStudent.status == 1) {
            Alert.alert("Success", "Student added successfully");
            dispatch(clearAgentAddStudent())
            navigation.goBack();
        }
    }, [responseAddStudent])

    useEffect(() => {
        if (responseUploadImage != null) {
            // setReceiptUrl(responseUploadImage.Location);
            console.log("Key ===> ", key, " Response Location ====> ", responseUploadImage.Location)
            setImages({ ...images, [key]: responseUploadImage.Location });
            dispatch(clearUploadFileData());
        }
    }, [responseUploadImage]);

    useEffect(() => {
        console.log("Images ===> ", images);
    }, [images])

    const renderInput = (label, key, keyboard = "default") => (
        <>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputBox}>
                <TextInput
                    value={form[key]}
                    onChangeText={(t) => handleChange(key, t)}
                    style={styles.input}
                    keyboardType={keyboard}
                    placeholder={`Enter ${label}`}
                />
            </View>
        </>
    );

    const renderImage = (label, key) => (
        <>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.imageBox}
                onPress={() => pickImage(key)}
            >
                {images[key] ? (
                    <Image source={{ uri: images[key] }} style={styles.image} />
                ) : (
                    <Text>Select Image</Text>
                )}
            </TouchableOpacity>
        </>
    );



    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <BackIcon width={32} height={32} fill="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Add Student</Text>
            </View>

            <ScrollView>
                {renderInput("Name", "name")}
                {renderInput("Email", "email", "email-address")}
                {renderInput("Mobile Number", "mobile", "phone-pad")}

                {renderImage("Profile Image", "profile")}
                {renderImage("PAN Card", "pan")}
                {renderImage("10 / +2 Marksheet", "marksheet")}
                {renderImage("Passport Front", "passportFront")}
                {renderImage("Passport Back", "passportBack")}
                {renderImage("Aadhaar Front", "aadhaarFront")}
                {renderImage("Aadhaar Back", "aadhaarBack")}
                {renderImage("NEET Result", "neet")}

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.btnText}>Save Student</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddStudent;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    header: {
        flexDirection: "row",
        backgroundColor: appColors.primaryColor,
        padding: 12,
        alignItems: "center",
    },

    headerText: {
        flex: 1,
        textAlign: "center",
        color: "#fff",
        marginRight: 32,
    },

    label: {
        marginHorizontal: 16,
        marginTop: 16,
        fontWeight: "600",
    },

    inputBox: {
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginTop: 8,
        height: 45,
        justifyContent: "center",
        paddingHorizontal: 10,
    },

    input: {
        color: "#000",
    },

    imageBox: {
        height: 120,
        marginHorizontal: 16,
        marginTop: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },

    image: {
        width: "100%",
        height: "100%",
    },

    button: {
        backgroundColor: appColors.primaryColor,
        margin: 20,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },

    btnText: {
        color: "#fff",
        fontWeight: "600",
    },
});