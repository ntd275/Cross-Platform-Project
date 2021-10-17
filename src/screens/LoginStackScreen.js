import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './WelcomeScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

const LoginStack = createNativeStackNavigator()

export default function LoginStackScreen(){
    return(
      <LoginStack.Navigator
        screenOptions={{
            headerShown: false
        }}
      >
        <LoginStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <LoginStack.Screen name="LoginScreen" component={LoginScreen} />
        <LoginStack.Screen name="RegisterScreen" component={RegisterScreen} />
      </LoginStack.Navigator>
    )
}
