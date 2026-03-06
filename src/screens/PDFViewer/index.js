import React from "react";
import { View, StyleSheet } from "react-native";
// import Pdf from "react-native-pdf";

const PDFViewer = ({ route }) => {
  const { pdfUrl } = route.params;

  return (
    <View style={styles.container}>
      {/* <Pdf
        source={{ uri: pdfUrl, cache: true }}
        style={styles.pdf}
        onError={(err) => console.log("PDF error", err)}
      /> */}
    </View>
  );
};

export default PDFViewer;

const styles = StyleSheet.create({
  container: { flex: 1 },
  pdf: { flex: 1, width: "100%" },
});
