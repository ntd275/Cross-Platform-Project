import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeProfileScreen from "../HomeProfileScreen";
import SettingScreen from "../SettingScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import ProfileScreen from "../ProfileScreen";
import CreatePost from "../CreatePost";
import PostScreen from "../PostScreen";
import EditPost from "../EditPost";
import ProfileEditScreen from "../ProfileEditScreen";
import ChangePasswordScreen from "../ChangePasswordScreen";
import ViewProfileScreen from "../ViewProfileScreen";
import ProfileOptionScreen from "../ProfileOptionScreen";
import PersonalInformationScreen from "../PesonalInformationScreen";
import NoConnectionScreen from "../NoConnectionScreen";
import SearchScreen from "../SearchScreen";
const ProfileStack = createNativeStackNavigator();

export default function ProfileStackScreen({ route, navigation }) {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideScreens = [
      "SettingScreen",
      "ProfileScreen",
      "CreatePost",
      "ChangePasswordScreen",
      "ProfileOptionScreen",
      "ProfileEditScreen",
      "ViewProfileScreen",
      "PersonalInformationScreen",
      "NoConnectionScreen",
    ];

    if (hideScreens.includes(routeName)) {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: null } });
    }
  }, [navigation, route]);
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStack.Screen
        name="HomeProfileScreen"
        component={HomeProfileScreen}
      />
      <ProfileStack.Screen name="SettingScreen" component={SettingScreen} />
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="CreatePost" component={CreatePost} />
      <ProfileStack.Screen name="PostScreen" component={PostScreen} />
      <ProfileStack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ animation: "none" }}
      />
      <ProfileStack.Screen name="EditPost" component={EditPost} />
      <ProfileStack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <ProfileStack.Screen
        name="ProfileEditScreen"
        component={ProfileEditScreen}
      />
      <ProfileStack.Screen
        name="ViewProfileScreen"
        component={ViewProfileScreen}
      />
      <ProfileStack.Screen
        name="ProfileOptionScreen"
        component={ProfileOptionScreen}
      />
      <ProfileStack.Screen
        name="PersonalInformationScreen"
        component={PersonalInformationScreen}
      />
      <ProfileStack.Screen
        name="NoConnectionScreen"
        component={NoConnectionScreen}
      />
    </ProfileStack.Navigator>
  );
}
