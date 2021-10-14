import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MessageStackScreen from './src/screens/tabs/MessageStackScreen';
import ContactStackScreen from './src/screens/tabs/ContactStackScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={{
          headerShown: false
        }}
      >
        <Tab.Screen name="MessageStackScreen" component={MessageStackScreen} />
        <Tab.Screen name="ContactStackScreen" component={ContactStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

