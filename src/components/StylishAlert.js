import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { appColors } from "../utils/color";
import Logo from "../assets/svgs/Logo";

const StylishAlert = ({ visible, title, message, onClose }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <View style={{ flexDirection: "row",alignItems:'center' }}>
            <Logo height={32} width={32} />
            <Text style={[styles.title,{marginLeft:8}]}>MD House</Text>
          </View>
          <Text style={[styles.title,{color:appColors.black}]}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: appColors.primaryColor,
  },
  message: {
    fontSize: 15,
    color: "#555",
    marginBottom: 8,
  },
  button: {
    alignSelf: "flex-end",
    backgroundColor: appColors.primaryColor,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default StylishAlert;
