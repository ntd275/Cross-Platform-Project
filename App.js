import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MessageStackScreen from './src/screens/tabs/MessageStackScreen';
import ContactStackScreen from './src/screens/tabs/ContactStackScreen';
import LoginStackScreen from './src/screens/LoginStackScreen';

const Tab = createBottomTabNavigator();


export default function App() {
  let login = null;
  return (
    <NavigationContainer>
      {login == null? <LoginStackScreen/>:
      (<Tab.Navigator 
        screenOptions={{
          headerShown: false
        }}
      >
        <Tab.Screen name="MessageStackScreen" component={MessageStackScreen} />
        <Tab.Screen name="ContactStackScreen" component={ContactStackScreen} />
      </Tab.Navigator>)}
    </NavigationContainer>
  );
}

