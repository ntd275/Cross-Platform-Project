import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TimeLineScreen from "../TimeLineScreen";
import PostScreen from "../PostScreen";
import Post from "../components/Post"
const TimeLineStack = createNativeStackNavigator();
const MessageStack = createNativeStackNavigator();
export default function TimeLineStackScreen() {
  return (
    <TimeLineStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <TimeLineStack.Screen name="TimeLineScreen" component={TimeLineScreen} />
      <TimeLineStack.Screen name="PostScreen" component={PostScreen} />
      {/* <MessageStack.Screen name="Post" component={Post} /> */}
    </TimeLineStack.Navigator>
  );
}
