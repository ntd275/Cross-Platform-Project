import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeProfileScreen from '../HomeProfileScreen';
import SettingScreen from '../SettingScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const ProfileStack = createNativeStackNavigator();

export default function ProfileStackScreen({route, navigation}){
    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        const hideScreens = ["SettingScreen"]
        if (hideScreens.includes(routeName)){
            navigation.setOptions({tabBarStyle:{display: 'none'}});
        }else {
            navigation.setOptions({tabBarStyle:{display: 'show'}});
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
      </ProfileStack.Navigator>
    )
}