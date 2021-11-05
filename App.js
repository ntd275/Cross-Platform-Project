import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MessageStackScreen from './src/screens/tabs/MessageStackScreen';
import ContactStackScreen from './src/screens/tabs/ContactStackScreen';
import TimeLineStackScreen from './src/screens/tabs/TimeLineStackScreen';
import ProfileStackScreen from './src/screens/tabs/ProfileStackScreen';
import LoginStackScreen from './src/screens/LoginStackScreen';
import AuthContext from './src/components/context/AuthContext';
import { loginReducer } from './src/components/reducer/loginReducer';
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
import ChatContext from './src/components/context/ChatContext';
import { LogBox } from 'react-native';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";


const Tab = createBottomTabNavigator();

export default function App() {
  var displayMessage = (messageObject) => {
    showMessage(messageObject);
  }

  const flashMessage = React.useRef("timelineFlash");
  const initLoginState = {
    userName: null,
    accessToken: null,
    isLoading: false,
  }

  const [loginState, dispatch] = React.useReducer(loginReducer, initLoginState)
  const authContext = {
    loginState,
    dispatch
  }


  const _setKeyBoardHeight = (h) => {
    if (h > 0) {
      setKeyBoardHeight(h)
    }
  }

  const _setAvatar = (v) => {
    if (v != avatar) {
      setAvatar(v)
    }
  }

  const [keyBoardHeight, setKeyBoardHeight] = React.useState(0)
  const [avatar, setAvatar] = React.useState("avatar_2.png")
  const appContext = {
    keyBoardHeight,
    setKeyBoardHeight: _setKeyBoardHeight,
    avatar,
    setAvatar: _setAvatar,
    displayMessage: displayMessage,
  }


  const [curFriendId, setCurFriendId] = React.useState(null);
  const [curChatId, setCurChatId] = React.useState(null);
  const [listUnseens, setListUnseens] = React.useState([]);
  const [curMessages, setCurMessages] = React.useState([]);
  const [listChats, setListChats] = React.useState(null);

  var resetChat = () => {
    setCurFriendId(null);
    setCurChatId(null);
    setListUnseens([]);
    setCurMessages([]);
    setListChats(null);
  }

  const chatContext = {
    curFriendId,
    setCurFriendId,
    listUnseens,
    setListUnseens,
    curMessages,
    setCurMessages,
    resetChat,
    listChats,
    setListChats,
    curChatId,
    setCurChatId,
  }

  return (
    <>
      <FlashMessage ref={flashMessage} position="top" titleStyle={{ fontSize: 16, marginLeft: 12, marginTop: 1 }} />
      <AppContext.Provider value={appContext}>

        <AuthContext.Provider value={authContext}>
          <ChatContext.Provider value={chatContext}>
            <NavigationContainer>

              {loginState.accessToken == null ? <LoginStackScreen /> :
                (<Tab.Navigator
                  screenOptions={{
                    headerShown: false
                  }}
                >

                  <Tab.Screen name="Tin nhắn" component={MessageStackScreen}
                    options={{
                      tabBarIcon: ({ focused }) => {
                        if (focused) {
                          return <IconTabMessageFocus />
                        }
                        return <IconTabMessage />
                      }
                    }}
                  />
                  <Tab.Screen name="Danh bạ" component={ContactStackScreen}
                    options={{
                      tabBarIcon: ({ focused }) => {
                        if (focused) {
                          return <IconTabContactFocus />
                        }
                        return <IconTabContact />
                      }
                    }}
                  />
                  <Tab.Screen name="Nhật ký" component={TimeLineStackScreen} options={{
                    tabBarIcon: ({ focused }) => {
                      if (focused) {
                        return <IconTabSocialFocus />
                      }
                      return <IconTabSocial />
                    }
                  }} />
                  <Tab.Screen name="Cá nhân" component={ProfileStackScreen} options={{
                    tabBarIcon: ({ focused }) => {
                      if (focused) {
                        return <IconTabMeFocus />
                      }
                      return <IconTabMe />
                    }
                  }} />
                </Tab.Navigator>)}
            </NavigationContainer>
          </ChatContext.Provider>
        </AuthContext.Provider>
      </AppContext.Provider>
    </>
  );
}
