import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeContactScreen from "../HomeContactScreen";
import NoConnectionScreen from "../NoConnectionScreen";
import SearchScreen from "../SearchScreen";
import LoiMoiKetBan from "../LoiMoiKetBan";
import ConversationScreen from "../ConversationScreen";
import ConversationOptionScreen from "../ConversationOptionScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import ProfileScreen from "../ProfileScreen";
import CreatePost from "../CreatePost";
import PostScreen from "../PostScreen";
import ProfileEditScreen from "../ProfileEditScreen";
import ChangePasswordScreen from "../ChangePasswordScreen";
import ViewProfileScreen from "../ViewProfileScreen";
import ProfileOptionScreen from "../ProfileOptionScreen";
import PersonalInformationScreen from "../PesonalInformationScreen";
import SettingScreen from "../SettingScreen";
import FriendRequests from "../LoiMoiKetBan";
import ViewProfileOptionScreen from "../ViewProfileOptionScreen";

const ContactStack = createNativeStackNavigator();

export default function ContactStackScreen({ route, navigation }) {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideScreens = ["ConversationScreen", "ConversationOption", "FriendRequests" ,"ViewProfileOptionScreen"];
    if (hideScreens.includes(routeName)) {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: null } });
    }
  }, [navigation, route]);

  return (
    <ContactStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ContactStack.Screen
        name="HomeContactScreen"
        component={HomeContactScreen}
      />
      <ContactStack.Screen
        name="NoConnectionScreen"
        component={NoConnectionScreen}
      />
      <ContactStack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ animation: "none" }}
      />
      <ContactStack.Screen
        name="FriendRequests"
        component={FriendRequests}
      />

      <ContactStack.Screen
        name="ConversationScreen"
        component={ConversationScreen}
      />
      <ContactStack.Screen
        name="ConversationOption"
        component={ConversationOptionScreen}
      />
      <ContactStack.Screen name="SettingScreen" component={SettingScreen} />
      <ContactStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ContactStack.Screen
        name="ViewProfileScreen"
        component={ViewProfileScreen}
      />
      <ContactStack.Screen name="CreatePost" component={CreatePost} />
      <ContactStack.Screen name="PostScreen" component={PostScreen} />
      <ContactStack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <ContactStack.Screen
        name="ProfileEditScreen"
        component={ProfileEditScreen}
      />

      <ContactStack.Screen
        name="ProfileOptionScreen"
        component={ProfileOptionScreen}
      />
      <ContactStack.Screen
        name="PersonalInformationScreen"
        component={PersonalInformationScreen}
      />
      <ContactStack.Screen
        name="ViewProfileOptionScreen"
        component={ViewProfileOptionScreen}
      />
    </ContactStack.Navigator>
  );
}
