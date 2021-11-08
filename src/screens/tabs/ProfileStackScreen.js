import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeProfileScreen from '../HomeProfileScreen';
import SettingScreen from '../SettingScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ProfileScreen from '../ProfileScreen';
import CreatePost from '../CreatePost';
import PostScreen from '../PostScreen';
import ChangePasswordScreen from '../ChangePasswordScreen'

const ProfileStack = createNativeStackNavigator();

export default function ProfileStackScreen({route, navigation}){
    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        const hideScreens = ["SettingScreen","ProfileScreen","CreatePost","ChangePasswordScreen"]
        if (hideScreens.includes(routeName)){
            navigation.setOptions({tabBarStyle:{display: 'none'}});
        }else {
            navigation.setOptions({tabBarStyle:{display: null}});
        }
    }, [navigation, route]);
    return(
      <ProfileStack.Navigator
        screenOptions={{
        headerShown: false
      }}
      >
        <ProfileStack.Screen name="HomeProfileScreen" component={HomeProfileScreen} />
        <ProfileStack.Screen name="SettingScreen" component={SettingScreen} />
        <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen}/>
        <ProfileStack.Screen name="CreatePost" component={CreatePost} />
        <ProfileStack.Screen name="PostScreen" component={PostScreen} />
        <ProfileStack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
      </ProfileStack.Navigator>
    )
}