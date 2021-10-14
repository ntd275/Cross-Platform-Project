import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeContactScreen from '../HomeContactScreen'

const ContactStack = createNativeStackNavigator();

export default function ContactStackScreen(){
    return(
      <ContactStack.Navigator
        screenOptions={{
        headerShown: false
      }}
      >
        <ContactStack.Screen name="HomeContactScreen" component={HomeContactScreen} />
      </ContactStack.Navigator>
    )
}
