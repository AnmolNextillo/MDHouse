import { useEffect } from "react";
import { AppState, Alert, Platform } from "react-native";
const RNScreenshotPrevent = require("react-native-screenshot-prevent");

export default function useScreenSecurity() {

 useEffect(() => {
    if (Platform.OS === "ios") {
      try {
        // Block screenshots (Android) and secure view (iOS)
        if (RNScreenshotPrevent && RNScreenshotPrevent.enableSecureView) {
          RNScreenshotPrevent.enableSecureView();
        }

        return () => {
          if (RNScreenshotPrevent && RNScreenshotPrevent.disableSecureView) {
            RNScreenshotPrevent.disableSecureView();
          }
        };
      } catch (error) {
        console.warn('Screenshot prevention not available:', error);
      }
    }
  }, []);
}