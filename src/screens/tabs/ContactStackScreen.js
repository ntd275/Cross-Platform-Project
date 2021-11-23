import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeContactScreen from '../HomeContactScreen'
import NoConnectionScreen from '../NoConnectionScreen';

const ContactStack = createNativeStackNavigator();

export default function ContactStackScreen(){
    return(
      <ContactStack.Navigator
        screenOptions={{
        headerShown: false
      }}
      >
        <ContactStack.Screen name="HomeContactScreen" component={HomeContactScreen} />
        <ContactStack.Screen name="NoConnectionScreen" component={NoConnectionScreen} />
      </ContactStack.Navigator>
    )
}
