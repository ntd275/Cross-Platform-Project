import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MessageStackScreen from './src/screens/tabs/MessageStackScreen';
import ContactStackScreen from './src/screens/tabs/ContactStackScreen';
import TimeLineStackScreen from './src/screens/tabs/TimeLineStackScreen';
import ProfileStackScreen from './src/screens/tabs/ProfileStackScreen';
import LoginStackScreen from './src/screens/LoginStackScreen';
import AuthContext from './src/components/context/AuthContext';
import { loginReducer} from './src/components/reducer/loginReducer';
import IconTabMeFocus from './assets/ic_tab_me_focus.svg'
import IconTabMe from './assets/ic_tab_me.svg'
import IconTabMessage from './assets/ic_tab_message.svg'
import IconTabMessageFocus from './assets/ic_tab_message_focus.svg'
import IconTabContact from './assets/ic_tab_contact.svg'
import IconTabContactFocus from './assets/ic_tab_contact_focus.svg'
import IconTabSocial from './assets/ic_tab_social.svg'
import IconTabSocialFocus from './assets/ic_tab_social_focus.svg'
import CreatePost from './src/screens/CreatePost';
import AppContext from './src/components/context/AppContext';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

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

  const [keyBoardHeight, setKeyBoardHeight] = React.useState(0)
  const appContext = {
    keyBoardHeight,
    setKeyBoardHeight
  }

    return (
      <AppContext.Provider value={appContext}>

        <AuthContext.Provider value={authContext}>
        <NavigationContainer>
            
            {loginState.accessToken == null? <LoginStackScreen/>:
            (<Tab.Navigator 
            screenOptions={{
            headerShown: false
            }}
            >

            <Tab.Screen name="Tin nhắn" component={MessageStackScreen} 
                options={{
                tabBarIcon: ({focused}) => {
                    if(focused){
                    return <IconTabMessageFocus/>
                    }
                    return <IconTabMessage/>
                }
                }}
            />
            <Tab.Screen name="Danh bạ" component={ContactStackScreen} 
                options={{
                tabBarIcon: ({focused}) => {
                    if(focused){
                    return <IconTabContactFocus/>
                    }
                    return <IconTabContact/>
                }
                }}
            />
            <Tab.Screen name="Nhật ký" component={TimeLineStackScreen} options={{
                tabBarIcon: ({focused}) => {
                if(focused){
                    return <IconTabSocialFocus/>
                }
                return <IconTabSocial/>
                }
            }}/>
            <Tab.Screen name="Cá nhân" component={ProfileStackScreen} options={{
                tabBarIcon: ({focused}) => {
                if(focused){
                    return <IconTabMeFocus/>
                }
                return <IconTabMe/>
                }
            }}/>
        </Tab.Navigator>)}
      </NavigationContainer>
    </AuthContext.Provider>
    </AppContext.Provider>
  );
}
