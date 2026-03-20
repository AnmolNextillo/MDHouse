import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Chat from "../screens/Chat";
import Notification from "../screens/Notification";
import ProfileScreen from "../screens/ProfileScreen.js";
import NotificationIcon from "../assets/svgs/NotificationIcon.js";
import HomeScreen from "../screens/Home/Index.js";
import HomeIconBtm from "../assets/svgs/HomeIconBtm.js";
import ChatIconBtm from "../assets/svgs/ChatIconBtm.js";
import ProfileIconBtm from "../assets/svgs/ProfileIconBtm.js";
import { appColors } from "../utils/color.js";
import { useDispatch, useSelector } from "react-redux";
import { hitDashboardApi } from "../redux/DashboardSlice.js";
import ProfileOptios from "../screens/ProfileOptions/index.js";
import GalleryIcon from "../assets/svgs/GalleryIcon.js";
import GalleryScreen from "../screens/GalleryScreen/index.js";
import ProfileOptions from "../screens/Partner/ProfileOptions/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hitCheckUser } from "../redux/CheckUserSlice.js";

// import HomeIcon from '../assets/svg/HomeIcon';
// import TasksIcon from '../assets/svg/TasksIcon';
// import ChatIcon from '../assets/svg/ChatIcon';
// import AddScreen from '../screens/BottomBar/Add';
// import PlusIcon from '../assets/svg/PlusIcon';
// import InactiveHome from '../assets/svg/InactiveHome';

const Tab = createBottomTabNavigator();

const Tabs = () => {

  const responseDashboard = useSelector((state) => state.dashboardReducer.data);
  const responseCheckUser = useSelector((state) => state.checkUserReducer.data);
  const dispatch = useDispatch();
  const [dashboardData, setDashboard] = useState(null)
  const [userType, setUserType] = useState(null)

  useEffect(() => {
    // const setUserTypeFromStorage = async () => {
    //   try {
    //     const storedUserType = await AsyncStorage.getItem("userType");
    //     console.log("Stored User Type:", storedUserType);
    //     if (storedUserType) {
    //         console.log("Stored User Type: 2", storedUserType);
    //       setUserType(storedUserType);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching user type from storage:", error);
    //   }
    // };

    // setUserTypeFromStorage();

    dispatch(hitDashboardApi());
    dispatch(hitCheckUser());
  }, []);

  useEffect(() => {
    if (responseDashboard != null && responseDashboard.status == 1) {
      setDashboard(responseDashboard.data)
    }
    if (responseCheckUser != null && responseCheckUser.status == 1) {
      setUserType(responseCheckUser.data.userType);
      saveUserTypeToStorage(responseCheckUser.data.userType);
    }
  }, [responseDashboard, responseCheckUser]);

  const saveUserTypeToStorage = async (type) => {
    try {
      await AsyncStorage.setItem("userType", type.toString());
    } catch (error) {
      console.error("Error saving user type to storage:", error);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true, // ✅ Show default labels
        tabBarActiveTintColor: appColors.primaryColor, // ✅ Active text color
        tabBarInactiveTintColor: appColors.black, // ✅ Inactive text color
        tabBarStyle: {
          position: "absolute",
          elevation: 0,
          backgroundColor: appColors.white,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 14, // ✅ Bigger text
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <HomeIconBtm
              fill={focused ? appColors.primaryColor : appColors.black}
              height={24}
              width={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <GalleryIcon
              fill={focused ? appColors.primaryColor : appColors.black}
              height={24}
              width={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({ focused }) => (
            <ChatIconBtm
              stroke={focused ? appColors.primaryColor : appColors.black}
              height={24}
              width={24}
            />
          ),
          tabBarBadge: dashboardData != null && dashboardData.unreadMessagesCount > 0 ? dashboardData.unreadMessagesCount : undefined,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarIcon: ({ focused }) => (
            <NotificationIcon
              fill={focused ? appColors.primaryColor : appColors.black}
              height={24}
              width={24}
            />
          ),
          tabBarBadge: dashboardData != null && dashboardData.unreadNotificationsCount > 0 ? dashboardData.unreadNotificationsCount : undefined, // show a number badge
        }}
      />
     
      {userType&&<Tab.Screen
        name="Profile"
        component={ userType==3?ProfileOptions:ProfileOptios}
        options={{
          tabBarIcon: ({ focused }) => (
            <ProfileIconBtm
              fill={focused ? appColors.primaryColor : appColors.black}
              height={24}
              width={24}
            />
          ),
        }}
      />}
    </Tab.Navigator>
  );
};

export default Tabs;

const styles = StyleSheet.create({});
