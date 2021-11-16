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
import { Api } from './src/api/Api'
import { NativeBaseProvider } from 'native-base';
import { Audio } from 'expo-av';


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

  const _setCoverImage = (v) => {
    if (v != coverImage) {
      setCoverImage(v)
    }
  }

  const _setDescription = (v) => {
    if (v != description) {
      setDescription(v)
    }
  }

  const _setBlockedInbox = (v) => {
    if (v.length != blockedInbox.length) {
      setBlockedInbox(v)
    }
  }

  const _setBlockedDiary = (v) => {
    if (v.length != blockedDiary.length) {
      setBlockedDiary(v)
    }
  }

  const _setPhonenumber = (v) => {
    if (v != phonenumber) {
      setPhonenumber(v)
    }
  }

  const [keyBoardHeight, setKeyBoardHeight] = React.useState(0)
  const [avatar, setAvatar] = React.useState("avatar_2.png")
  const [phonenumber, setPhonenumber] = React.useState("")
  const [blockedInbox, setBlockedInbox] = React.useState(new Array())
  const [blockedDiary, setBlockedDiary] = React.useState(new Array())
  const [coverImage, setCoverImage] = React.useState("defaul_cover_image.jpg")
  const [description, setDescription] = React.useState(undefined);
  const [sound, setSound] = React.useState();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/message_noti.mp3')
    );
    await sound.playAsync();
  }

  const appContext = {
    keyBoardHeight,
    setKeyBoardHeight: _setKeyBoardHeight,
    avatar,
    setAvatar: _setAvatar,
    displayMessage: displayMessage,
    coverImage,
    setCoverImage: _setCoverImage,
    description,
    setDescription,
    blockedInbox,
    setBlockedInbox: _setBlockedInbox,
    blockedDiary,
    setBlockedDiary: _setBlockedDiary,
    phonenumber,
    setPhonenumber: _setPhonenumber,
  }

  const getMe = async () => {
    try {
      const token = "lol " + loginState.accessToken
      let res = await Api.getMe(token)
      _setAvatar(res.data.data.avatar.fileName)
      _setCoverImage(res.data.data.cover_image.fileName)
      _setDescription(res.data.data.description)
      _setBlockedInbox(res.data.data.blocked_inbox)
      _setBlockedDiary(res.data.data.blocked_diary)
      _setPhonenumber(res.data.data.phonenumber)
    } catch (e) {
      console.log(e)
    }
  }

  if (loginState.accessToken) {
    getMe()
  }

  const [curFriendId, setCurFriendId] = React.useState(null);
  const [curChatId, setCurChatId] = React.useState(null);
  const [listUnseens, setListUnseens] = React.useState([]);
  const [listChats, setListChats] = React.useState(null);
  const [inChat, setInChat] = React.useState(false);
  const [needUpdateListChat, setNeedUpdateListChat] = React.useState(false);
  const [socket, setSocket] = React.useState(null);

  if (!socket && loginState.userId) {
    const { io } = require("socket.io-client");
    const socket = io("http://13.76.46.159:3000", {
      transportOptions: {
        polling: {
          extraHeaders: {
            token: loginState.accessToken
          }
        }
      }
    });
    setSocket(socket);

    socket.on("message", (msg) => {
      if ((msg.senderId == curFriendId || msg.receiverId == curFriendId) && inChat) {
        socket.emit("seenMessage", {
          token: loginState.accessToken,
          chatId: msg.chatId
        });
        if (curChatId !== msg.chatId) {
          setCurChatId(msg.chatId);
        }
      } else if (msg.senderId != loginState.userId) {
        playSound();
        let chatId = msg.chatId;
        let temp = listUnseens;
        let index = temp.indexOf(chatId);
        if (index == -1) {
          temp.push(chatId)
        }
        setListUnseens(temp);
        // console.log(listUnseens)
      }
      if (!needUpdateListChat) {
        setNeedUpdateListChat(true);
      }
    });

  }

  const getListChats = async () => {
    try {
      accessToken = loginState.accessToken;

      const res = await Api.getChats(accessToken);
      let listChats = res.data.data;
      listChats.sort((chata, chatb) => {
        return new Date(chata.lastMessage.time).getTime() < new Date(chatb.lastMessage.time).getTime();
      })
      let listChatId = [];
      let temp = listUnseens;
      for (let i = 0; i < listChats.length; i++) {
        if (!listChats[i].seen) {
          listChatId.push(listChats[i].chatId);
        } else {
          let index = temp.indexOf(listChats[i].chatId);
          if (index !== -1) {
            temp.splice(index, 1);
          }
        }
      }
      temp = Array.from(new Set(listChatId.concat(temp)));
      // console.log(temp);
      setListChats(listChats);
      setListUnseens(temp);
    } catch (err) {
      console.log(err);
    }
  };

  var resetChat = () => {
    setCurFriendId(null);
    setCurChatId(null);
    setInChat(false);
    setListUnseens([]);
    setListChats(null);
    socket.disconnect();
    setSocket(null);
    setNeedUpdateListChat(false);
  }

  var outChatRoom = () => {
    setCurFriendId(null);
    setCurChatId(null);
    setInChat(false);
  }

  const chatContext = {
    curFriendId,
    setCurFriendId,
    listUnseens,
    setListUnseens,
    resetChat,
    listChats,
    setListChats,
    curChatId,
    setCurChatId,
    getListChats,
    inChat,
    setInChat,
    needUpdateListChat,
    setNeedUpdateListChat,
    socket,
    outChatRoom
  }

  return (
    <NativeBaseProvider>
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
                        if (focused && listUnseens) {
                          return <IconTabMessageFocus />
                        }
                        return <IconTabMessage />
                      },
                      tabBarBadge: listUnseens.length,
                      tabBarBadgeStyle: { height: listUnseens.length ? 18 : 0 }
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
    </NativeBaseProvider>
  );
}
