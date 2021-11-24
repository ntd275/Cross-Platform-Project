import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeMessageScreen from "../HomeMessageScreen";
import ConversationScreen from "../ConversationScreen";
import ConversationOptionScreen from "../ConversationOptionScreen";
import NoConnectionScreen from "../NoConnectionScreen";
import Post from "../components/Post";
import SearchScreen from "../SearchScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const MessageStack = createNativeStackNavigator();

export default function MessageStackScreen({ route, navigation }) {
  React.useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideScreens = ["ConversationScreen", "ConversationOption"];
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
    </MessageStack.Navigator>
  );
}
