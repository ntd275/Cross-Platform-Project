import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeMessageScreen from '../HomeMessageScreen';
import Post from "../components/Post"

const MessageStack = createNativeStackNavigator();

export default function MessageStackScreen(){
    return(
      <MessageStack.Navigator
        screenOptions={{
        headerShown: false
      }}
      >
        <MessageStack.Screen name="Post" component={Post} />
        <MessageStack.Screen name="HomeMessageScreen" component={HomeMessageScreen} />
      </MessageStack.Navigator>
    )
}
