import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import { appColors } from '../utils/color';

const EditOptionModal = ({ modalVisible, setModalVisible, onItemSelect }) => {
  useEffect(() => {
    console.log('Modal Visible', modalVisible);
  }, [modalVisible]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={styles.backdrop}
          onPress={() => setModalVisible(false)}
        />
        <View style={styles.modalContainer}>
          <View style={styles.bottomModal}>
            <Text style={styles.modalTitle}>What you want Edit</Text>
            <TouchableOpacity onPress={() => onItemSelect('UniversityInfo')}>
              <Text style={styles.itemText}>Univerty Info</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onItemSelect('StudentDetials')}>
              <Text style={styles.itemText}>Personal Details</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onItemSelect('DocumentUpload')}>
              <Text style={styles.itemText}>Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onItemSelect('StudentAddress')}>
              <Text style={styles.itemText}>Address</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onItemSelect('ParentDetials')}>
              <Text style={styles.itemText}>Parent Detials</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditOptionModal;

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000066',
  },
  modalContainer: {
    justifyContent: 'flex-end',
  },
  bottomModal: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
  
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.4,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: appColors.primaryColor,
  },
  item: {
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  itemText: {
    fontSize: 16,
    padding: 8,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: appColors.grey,
  },
  itemImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 15, // optional: makes it circular if it's a flag or avatar
  },
});
