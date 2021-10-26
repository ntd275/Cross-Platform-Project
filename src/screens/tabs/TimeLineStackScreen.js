import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TimeLineScreen from "../TimeLineScreen";
import PostScreen from "../PostScreen";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const TimeLineStack = createNativeStackNavigator();

export default function TimeLineStackScreen({route, navigation}) {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideScreens = ["PostScreen"]
    if (hideScreens.includes(routeName)){
        navigation.setOptions({tabBarStyle:{display: 'none'}});
    }else {
        navigation.setOptions({tabBarStyle:{display: null}});
    }
}, [navigation, route]);
  return (
    <TimeLineStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <TimeLineStack.Screen name="TimeLineScreen" component={TimeLineScreen} />
      <TimeLineStack.Screen name="PostScreen" component={PostScreen} />
    </TimeLineStack.Navigator>
  );
}