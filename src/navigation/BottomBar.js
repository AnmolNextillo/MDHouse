import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Tabs from './Tab';
import { appColors } from '../utils/color';

const BottomBar = () => {
  return (
    <SafeAreaView style={styles.containerStyle}>
      <Tabs />
    </SafeAreaView>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: appColors.primaryColor,
    flex: 1,
  },
});
