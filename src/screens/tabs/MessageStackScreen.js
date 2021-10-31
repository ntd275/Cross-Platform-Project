import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeMessageScreen from '../HomeMessageScreen';
import ConversationScreen from '../ConversationScreen';
import ConversationOptionScreen from '../ConversationOptionScreen';
import Post from "../components/Post"

const MessageStack = createNativeStackNavigator();

export default function MessageStackScreen() {
  return (
    <MessageStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <MessageStack.Screen name="ConversationScreen" component={ConversationScreen} />
      <MessageStack.Screen name="HomeMessageScreen" component={HomeMessageScreen} />
      <MessageStack.Screen name="ConversationOption" component={ConversationOptionScreen} />
    </MessageStack.Navigator>
  )
}
