import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeMessageScreen from "../HomeMessageScreen";
import ConversationScreen from "../ConversationScreen";
import ConversationOptionScreen from "../ConversationOptionScreen";
import NoConnectionScreen from "../NoConnectionScreen";
import Post from "../components/Post";
import SearchScreen from "../SearchScreen";
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
import ViewProfileOptionScreen from "../ViewProfileOptionScreen";

const MessageStack = createNativeStackNavigator();

export default function MessageStackScreen({ route, navigation }) {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideScreens = [
      "ConversationScreen",
      "ConversationOption",
      "ViewProfileOptionScreen",
    ];
    if (hideScreens.includes(routeName)) {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: null } });
    }
  }, [navigation, route]);
  return (
    <MessageStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MessageStack.Screen
        name="HomeMessageScreen"
        component={HomeMessageScreen}
      />
      <MessageStack.Screen
        name="ConversationScreen"
        component={ConversationScreen}
      />
      <MessageStack.Screen
        name="ConversationOption"
        component={ConversationOptionScreen}
      />
      <MessageStack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ animation: "none" }}
      />
      <MessageStack.Screen
        name="NoConnectionScreen"
        component={NoConnectionScreen}
      />
      <MessageStack.Screen name="SettingScreen" component={SettingScreen} />
      <MessageStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <MessageStack.Screen
        name="ViewProfileScreen"
        component={ViewProfileScreen}
      />
      <MessageStack.Screen name="CreatePost" component={CreatePost} />
      <MessageStack.Screen name="PostScreen" component={PostScreen} />
      <MessageStack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <MessageStack.Screen
        name="ProfileEditScreen"
        component={ProfileEditScreen}
      />

      <MessageStack.Screen
        name="ProfileOptionScreen"
        component={ProfileOptionScreen}
      />
      <MessageStack.Screen
        name="PersonalInformationScreen"
        component={PersonalInformationScreen}
      />
      <MessageStack.Screen
        name="ViewProfileOptionScreen"
        component={ViewProfileOptionScreen}
      />
    </MessageStack.Navigator>
  );
}
