import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const DocumentPickerModal = ({ visible, onClose, onCamera, onGallery, onDocument }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.option} onPress={onCamera}>
            <Text style={styles.optionText}>📸 Open Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={onGallery}>
            <Text style={styles.optionText}>🖼 Open Gallery</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.option} onPress={onDocument}>
            <Text style={styles.optionText}>📂 Open Document</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={[styles.option, { backgroundColor: "#eee" }]}
            onPress={onClose}
          >
            <Text style={[styles.optionText, { color: "red" }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalView: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default DocumentPickerModal;
