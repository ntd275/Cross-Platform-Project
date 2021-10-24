import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MessageStackScreen from './src/screens/tabs/MessageStackScreen';
import ContactStackScreen from './src/screens/tabs/ContactStackScreen';
import TimelineStackScreen from './src/screens/tabs/TimelineStackScreen';
import LoginStackScreen from './src/screens/LoginStackScreen';
import AuthContext from './src/components/context/AuthContext';
import { loginReducer} from './src/components/reducer/loginReducer';
import ProfileStackScreen from './src/screens/tabs/ProfileStackScreen';
import IconTabMeFocus from './assets/ic_tab_me_focus.svg'
import IconTabMe from './assets/ic_tab_me.svg'
import IconTabMessage from './assets/ic_tab_message.svg'
import IconTabMessageFocus from './assets/ic_tab_message_focus.svg'
import IconTabContact from './assets/ic_tab_contact.svg'
import IconTabContactFocus from './assets/ic_tab_contact_focus.svg'

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
            <Tab.Screen name="Nhật ký'" component={TimelineStackScreen} options={{
                tabBarIcon: ({focused}) => {
                if(focused){
                    return <IconTabMeFocus/>
                }
                return <IconTabMe/>
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
  );
}

