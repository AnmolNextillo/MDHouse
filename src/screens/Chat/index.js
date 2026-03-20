import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import BackIcon from "../../assets/svgs/BackIcon";
import { appColors } from "../../utils/color";
import { useDispatch, useSelector } from "react-redux";
import { clearChat, hitChatApi } from "../../redux/GetChatSlice";
import moment from "moment";
import { hitSendMessage } from "../../redux/SendMessageSlice";
import { pick, types } from "@react-native-documents/picker";
import PdfIcon from "../../assets/svgs/PdfIcon";
import ImageCropPicker from "react-native-image-crop-picker";
import { requestAllPermissions } from "../../utils/constants";
import { clearUploadFileData, uploadFile } from "../../redux/uploadFile";
import AttachmentIcon from "../../assets/svgs/AttachmentIcon";
import DocumentPickerModal from "../../components/DocumentPickerModal";
import { useIsFocused } from "@react-navigation/native";

const Chat = ({ navigation }) => {
  const [messages, setMessages] = useState(null);
  const [isProgress, setIsProgress] = useState(false);
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef(null);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const responseChat = useSelector((state) => state.getChatReducer.data);
  const responseSendMessage = useSelector(
    (state) => state.setMessageReducer.data
  );
  const responseUploadImage = useSelector(
    (state) => state.uploadFileReducer.data
  );

  /* ================= CHAT AUTO REFRESH ================= */

  useEffect(() => {
    if (!isFocused) return;

    dispatch(hitChatApi());

    const interval = setInterval(() => {
      dispatch(hitChatApi());
    }, 10000);

    return () => clearInterval(interval);
  }, [isFocused]);

  useEffect(() => {
    if (responseChat && responseChat.status === 1) {
      setIsProgress(false);
      setMessages(responseChat.data);
      dispatch(clearChat());
    }
  }, [responseChat]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    if (responseSendMessage && responseSendMessage.status === 1) {
      dispatch(hitChatApi());
    }
  }, [responseSendMessage]);

  /* ================= SEND ================= */

  const handleSend = () => {
    if (message.trim().length > 0) {
      onSend(message, 1);
      setMessage("");
    }
  };

  const onSend = (msg, type) => {
    const payload = {
      message: {
        message: msg,
        senderType: 1,
        receiverType: 4,
        type: type, // 1 = text, 2 = file
      },
    };
    dispatch(hitSendMessage(payload));
  };

  /* ================= FILE HANDLING ================= */

  const openModal = async () => {
    const hasPermission = await requestAllPermissions();
    if (hasPermission) {
      setModalVisible(true);
    } else {
      Alert.alert(
        "Permission Denied",
        "Please allow permissions from settings."
      );
    }
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({ width: 300, height: 400, cropping: true })
      .then((image) => {
        setModalVisible(false);
        dispatch(
          uploadFile({
            uri: image.path,
            fileName: image.filename || "image.jpg",
            type: image.mime,
          })
        );
      })
      .catch(() => {});
  };

  const openGallery = () => {
    ImageCropPicker.openPicker({ width: 300, height: 400, cropping: true })
      .then((image) => {
        setModalVisible(false);
        dispatch(
          uploadFile({
            uri: image.path,
            fileName: image.filename || "image.jpg",
            type: image.mime,
          })
        );
      })
      .catch(() => {});
  };

  const openDocument = async () => {
    setModalVisible(false);
    try {
      const results = await pick({ type: [types.allFiles] });
      dispatch(
        uploadFile({
          uri: results[0].uri,
          fileName: results[0].name,
          type: results[0].type,
        })
      );
    } catch {}
  };

  useEffect(() => {
    if (responseUploadImage && isFocused) {
      onSend(responseUploadImage.Location, 2);
      dispatch(clearUploadFileData());
    }
  }, [responseUploadImage]);

  /* ================= HELPERS ================= */

  const getFileExtension = (url) =>
    url?.split(".").pop()?.split(/\#|\?/)[0] || "";

  const getFileName = (url) =>
    url?.split("/").pop()?.split(/\#|\?/)[0] || "";

  const renderContent = (item) => {
    const isMe = item.senderType == 1;

    if (item.type === 2) {
      const ext = getFileExtension(item.message).toLowerCase();

      if (["jpg", "jpeg", "png"].includes(ext)) {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ViewImage", { uri: item.message })
            }
          >
            <Image source={{ uri: item.message }} style={styles.imageMessage} />
          </TouchableOpacity>
        );
      }

      if (ext === "pdf") {
        return (
          <TouchableOpacity
            style={styles.pdfContainer}
            onPress={() => Linking.openURL(item.message)}
          >
            <PdfIcon height={36} width={36} />
            <Text
              style={[
                styles.pdfText,
                { color: isMe ? "#fff" : appColors.black },
              ]}
              numberOfLines={1}
            >
              {getFileName(item.message)}
            </Text>
          </TouchableOpacity>
        );
      }
    }

    return (
      <Text style={[styles.messageText, { color: isMe ? "#fff" : "#333" }]}>
        {item.message}
      </Text>
    );
  };

  /* ================= UI ================= */

  return (
    <View style={styles.containerStyle}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon height={28} width={28} fill="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chat</Text>
      </View>

      {/* KEYBOARD SAFE AREA */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        {/* CHAT LIST */}
        {!isProgress ? (
          messages ? (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(_, i) => i.toString()}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              contentContainerStyle={[
                styles.messageList,
                { paddingBottom: 10 },
              ]}
              renderItem={({ item }) => {
                const isMe = item.senderType == 1;
                return (
                  <View
                    style={[
                      styles.messageWrapper,
                      { alignSelf: isMe ? "flex-end" : "flex-start" },
                    ]}
                  >
                    <View
                      style={[
                        styles.messageBubble,
                        {
                          backgroundColor: isMe
                            ? appColors.primaryColor
                            : "#fff",
                        },
                      ]}
                    >
                      {renderContent(item)}
                      <Text
                        style={[
                          styles.messageTime,
                          { color: isMe ? "#ddd" : "#555" },
                        ]}
                      >
                        {moment(item.createdAt).format("DD MMM, hh:mm A")}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          ) : (
            <View style={styles.emptyChatContainer}>
              <Text style={styles.emptyChatText}>Start a conversation ✨</Text>
            </View>
          )
        ) : (
          <ActivityIndicator style={{ flex: 1 }} />
        )}

        {/* INPUT */}
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={openModal}>
            <AttachmentIcon height={28} width={28} />
          </TouchableOpacity>

          <TextInput
            style={styles.inputBox}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
          />

          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>

        <DocumentPickerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onCamera={openCamera}
          onGallery={openGallery}
          onDocument={openDocument}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
  headerStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: appColors.primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 10,
    elevation: 3,
  },
  backBtn: {
    paddingRight: 12,
  },
  headerText: {
    flex: 1,
    color: appColors.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginRight: 32,
  },
  messageList: {
    padding: 12,
  },
  messageWrapper: {
    marginVertical: 6,
    maxWidth: "80%",
  },
  messageBubble: {
    borderRadius: 16,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    textAlign: "right",
    marginTop: 4,
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  pdfContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pdfText: {
    marginLeft: 8,
    fontSize: 14,
    maxWidth: 160,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    padding: 8,
  },
  inputBox: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: appColors.primaryColor,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendText: {
    color: "#fff",
    fontWeight: "700",
  },
  emptyChatContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyChatText: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
