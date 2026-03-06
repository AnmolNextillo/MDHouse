import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { appColors } from "../../utils/color";
import BackIcon from "../../assets/svgs/BackIcon";
import { SafeAreaView } from "react-native-safe-area-context";

const PdfRecreatedScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{flex:1}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackIcon height={32} width={32} fill={appColors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help</Text>
        </View>
      <ScrollView style={styles.container}>
        {/* ------- PDF Images in Exact Order ------- */}
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{
              uri: "https://kcmschool.s3.ap-south-1.amazonaws.com/1763446414_extract_12.jpeg",
            }}
            style={[styles.fullImage, { height: 180, marginTop: -10 }]}
          />
          <Image
            source={{
              uri: "https://kcmschool.s3.ap-south-1.amazonaws.com/1763446455_extract_13.jpeg",
            }}
            style={styles.fullImage}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{
              uri: "https://kcmschool.s3.ap-south-1.amazonaws.com/1763446490_extract_14.jpeg",
            }}
            style={styles.fullImage}
          />
          <Image
            source={{
              uri: "https://kcmschool.s3.ap-south-1.amazonaws.com/1763446507_extract_15.jpeg",
            }}
            style={styles.fullImage}
          />
        </View>

        {/* ------- PDF Text (Exact) ------- */}
        <Text style={styles.heading}>Indian Students’ Society 2025-2026</Text>

        <Text style={styles.text}>
          President - Jayant Chauhan ( +998 902248777 )
        </Text>
        <Text style={styles.text}>
          Head Pioneer - Ashish Dabas ( +998 902248111 )
        </Text>
        <Text style={styles.text}>
          Vice President - Aastha Verma ( +998 500019960 )
        </Text>
        <Text style={styles.text}>
          Deputy Vice president - Harsh Yadav ( +998 505518088 )
        </Text>

        <Text style={styles.section}>Dean office committee :</Text>
        <Text style={styles.text}>
          Head - Yogi Keshav ( +998 939585839 ) and Isha Kaushal ( +998
          940568101 )
        </Text>
        <Text style={styles.text}>
          Deputy Head - Sulakshya Sharma ( +998 507261188 ) and Helen Joseph (
          +998 955554782 )
        </Text>

        <Text style={styles.section}>Cultural committee :</Text>
        <Text style={styles.text}>
          Head - Parneet Nadha (+998 904499945 ) and Khushi Chouhan ( +998
          901916667 )
        </Text>
        <Text style={styles.text}>
          Deputy head - Saji Sani Mariam ( +998 917772092 ) and Devapriya ( +998
          886150170 )
        </Text>

        <Text style={styles.section}>IT committee :</Text>
        <Text style={styles.text}>
          Head - Harsh Parikh ( +998 939585826 ) and Meet Chauhan ( +998
          990344673 )
        </Text>
        <Text style={styles.text}>
          Deputy head - Yen Sonani ( +998 500019024 ) and Anil Kumar ( +998
          992801069 )
        </Text>

        <Text style={styles.section}>Cinematics and Arts committee :</Text>
        <Text style={styles.text}>
          Head - Amir Sohail ( +998 991358886 ) and Shantanu ( +998 994461920 )
        </Text>
        <Text style={styles.text}>
          Deputy head - Khushmeet Kaur ( +998 507119935 )
        </Text>

        <Text style={styles.section}>Medical committee :</Text>
        <Text style={styles.text}>
          Head - Sagar Daroch ( +998 901003674 ) and Suchitra ( +998 910301530 )
        </Text>
        <Text style={styles.text}>
          Deputy head - Batul ( +998 502007353 ) and Kartik ( +998 770321332 )
        </Text>

        <Text style={styles.section}>Sports committee :</Text>
        <Text style={styles.text}>
          Head - Ganet Ayush ( +998 930379078 ) and Nandini Tyagi ( +998
          904504059 )
        </Text>
        <Text style={styles.text}>
          Deputy head - Nabihah Huda ( +998 906003506 ) and Harshith Doddla (
          +998 700182487 )
        </Text>

        <Text style={styles.section}>Social welfare committee :</Text>
        <Text style={styles.text}>
          Head - Abid Ali ( +998 947672308 ) and Aadil Patel ( +998 507113533 )
        </Text>

        <Text style={styles.section}>Hostel committee :</Text>
        <Text style={styles.text}>
          Hostel Head Pioneer - Zaid Quddusi ( +998 917000946 )
        </Text>
        <Text style={styles.text}>
          Hostel Leader - Anisha - ( Hostel - 5 ) ( +998 947993703 )
        </Text>

        <Text style={styles.section}>Academics committee :</Text>
        <Text style={styles.text}>
          Head - Tanmayee Parasar ( +998 901003658 ) and Rajat Choudhary ( +998
          945568832 )
        </Text>

        <Text style={styles.section}>Finance committee :</Text>
        <Text style={styles.text}>
          Head - Arpit Lawaniya ( +998 507445842 ) and Jateen Sikarwar ( +998
          505522332 )
        </Text>

        <Text style={styles.section}>Immigration committee :</Text>
        <Text style={styles.text}>
          Head - Harsh Saini ( +998 906578323 ) and Vijay Khushwaha ( +998
          507585841 )
        </Text>
        <Text style={styles.text}>
          Deputy head - Aryan Kumar ( +998 930738228 ) and Ritesh ( +91
          9812507816 )
        </Text>

        <Text style={styles.section}>Flats committee :</Text>
        <Text style={styles.text}>
          Head - Suraj Thapliyal ( +998 915446398 ) and Mridul Thakur ( +998
          507119957 )
        </Text>

        <Text style={styles.section}>Mess / Food related concerns :</Text>
        <Text style={styles.text}>
          Head - Nagendra Prasad sir ( +998 951861823 ) and Ayush Sharma ( +998
          915463070 )
        </Text>

        <Text style={styles.footer}></Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PdfRecreatedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
  fullImage: {
    width: "100%",
    height: 150,
    resizeMode: "center",
    marginBottom: 10,
    flex: 1,
    borderRadius: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  section: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 15,
  },
  text: {
    fontSize: 15,
    marginTop: 4,
    color: "#444",
  },
  footer: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 25,
    fontWeight: "bold",
  },
});
