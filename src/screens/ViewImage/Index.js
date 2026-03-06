import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackIcon from '../../assets/svgs/BackIcon';
import { appColors } from '../../utils/color';
import EditIcon from '../../assets/svgs/EditIcon';

const ViewImage = ({ navigation, route }) => {
  const { uri } = route.params;

  return (
    <SafeAreaView style={[styles.constainerStyle]}>
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{flex:1}}>
          <BackIcon height={32} width={32} fill={appColors.white} />
        </TouchableOpacity>
        {/* <Text style={styles.headerText}>Student Details</Text> */}
      </View>
      <View style={styles.imageStyle}>
        <Image
          source={{ uri: uri}}
          style={{height:400,width:"100%",borderRadius:16}}
        />
      </View>
    </SafeAreaView>
  );
};

export default ViewImage;

const styles = StyleSheet.create({
  constainerStyle: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  headerStyle: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: appColors.primaryColor,
    alignItems: 'center',
  },
    headerText: {
    fontSize: 16,
    color: appColors.white,
    textAlign: 'center',
    flex: 1
  },
  imageStyle:{
    flex:1,
    padding:16,
    alignItems:'center',
    justifyContent:'center',
  }
});
