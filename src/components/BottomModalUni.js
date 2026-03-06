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

const BottomModalUni = ({
  title,
  modalVisible,
  setModalVisible,
  onItemSelect,
  itemList,
}) => {
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
            <Text style={styles.modalTitle}>{title}</Text>
            <FlatList
              data={itemList}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => onItemSelect(item)}
                >
                  <Text style={styles.itemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BottomModalUni;

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
    paddingTop: 16,
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
  },
  item: {
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center'
  },
  itemText: {
    fontSize: 16,
    textAlign:'center'
  },
  itemImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 15, // optional: makes it circular if it's a flag or avatar
  },
});
