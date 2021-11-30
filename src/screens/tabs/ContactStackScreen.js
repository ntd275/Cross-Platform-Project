import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeContactScreen from "../HomeContactScreen";
import NoConnectionScreen from "../NoConnectionScreen";
import SearchScreen from "../SearchScreen";
import LoiMoiKetBan from "../LoiMoiKetBan";
const ContactStack = createNativeStackNavigator();

export default function ContactStackScreen() {
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
      name = "LoiMoiKetBan"
      component={LoiMoiKetBan}
      />
    </ContactStack.Navigator>
  );
}
