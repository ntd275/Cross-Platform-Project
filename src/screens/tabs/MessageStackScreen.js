import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeMessageScreen from '../HomeMessageScreen';

const MessageStack = createNativeStackNavigator();

export default function MessageStackScreen(){
    return(
      <MessageStack.Navigator
        screenOptions={{
        headerShown: false
      }}
      >
        <MessageStack.Screen name="HomeMessageScreen" component={HomeMessageScreen} />
      </MessageStack.Navigator>
    )
}
