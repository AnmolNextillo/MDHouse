/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import 'react-native-get-random-values';
import { name as appName } from './app.json';
import {firebase} from '@react-native-firebase/app';

// Initialize Firebase (Default app)
if (!firebase.apps.length) {
  console.log('[Firebase] initializeApp default');
  firebase.initializeApp();  
}

// Setup background handler first
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[FCM] Message handled in background:', remoteMessage);
  return Promise.resolve();
});

AppRegistry.registerComponent(appName, () => App);
