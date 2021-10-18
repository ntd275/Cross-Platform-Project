import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MessageStackScreen from './src/screens/tabs/MessageStackScreen';
import ContactStackScreen from './src/screens/tabs/ContactStackScreen';
import LoginStackScreen from './src/screens/LoginStackScreen';
import AuthContext from './src/components/context/AuthContext';
import { loginReducer} from './src/components/reducer/loginReducer';

const Tab = createBottomTabNavigator();


export default function App() {
  const initLoginState = {
    userName : null,
    accessToken: null,
    isLoading: false,
  }

  const [loginState, dispatch] = React.useReducer(loginReducer,initLoginState)
  const authContext = {
    loginState,
    dispatch
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.accessToken == null? <LoginStackScreen/>:
        (<Tab.Navigator 
          screenOptions={{
          headerShown: false
          }}
        >
          <Tab.Screen name="MessageStackScreen" component={MessageStackScreen} />
          <Tab.Screen name="ContactStackScreen" component={ContactStackScreen} />
        </Tab.Navigator>)}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

