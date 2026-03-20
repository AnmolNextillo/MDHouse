import { useEffect } from "react";
import { AppState, Alert } from "react-native";
// import RNScreenshotPrevent from "react-native-screenshot-prevent";

export default function useScreenSecurity() {

 useEffect(() => {

    // Block screenshots (Android) and secure view (iOS)
    // RNScreenshotPrevent.enableSecureView();

    // return () => {
    //   RNScreenshotPrevent.disableSecureView();
    // };

  }, []);
}