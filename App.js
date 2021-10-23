import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MessageStackScreen from './src/screens/tabs/MessageStackScreen';
import ContactStackScreen from './src/screens/tabs/ContactStackScreen';
import LoginStackScreen from './src/screens/LoginStackScreen';
import AuthContext from './src/components/context/AuthContext';
import { loginReducer} from './src/components/reducer/loginReducer';
import ProfileStackScreen from './src/screens/tabs/ProfileStackScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

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

  getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route)
    const hideTabBarScreen = ["SettingScreen"]
    if (hideTabBarScreen.includes(routeName)) {
      return {display : "none"};
    }
    return {};
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
          <Tab.Screen name="ProfileStackScreen" component={ProfileStackScreen} 
            options={({route}) => ({
              tabBarStyle: 
                {...getTabBarVisibility(route)}
              })
            }
          />
        </Tab.Navigator>)}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

