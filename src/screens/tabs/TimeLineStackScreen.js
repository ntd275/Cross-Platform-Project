import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TimeLineScreen from "../TimeLineScreen";
import PostScreen from "../PostScreen";
const TimeLineStack = createNativeStackNavigator();

export default function TimeLineStackScreen() {
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
