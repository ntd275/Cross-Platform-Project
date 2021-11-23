import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MessageStackScreen from "./src/screens/tabs/MessageStackScreen";
import ContactStackScreen from "./src/screens/tabs/ContactStackScreen";
import TimeLineStackScreen from "./src/screens/tabs/TimeLineStackScreen";
import ProfileStackScreen from "./src/screens/tabs/ProfileStackScreen";
import LoginStackScreen from "./src/screens/LoginStackScreen";
import AuthContext from "./src/components/context/AuthContext";
import { loginReducer } from "./src/components/reducer/loginReducer";
import IconTabMeFocus from "./assets/ic_tab_me_focus.svg";
import IconTabMe from "./assets/ic_tab_me.svg";
import IconTabMessage from "./assets/ic_tab_message.svg";
import IconTabMessageFocus from "./assets/ic_tab_message_focus.svg";
import IconTabContact from "./assets/ic_tab_contact.svg";
import IconTabContactFocus from "./assets/ic_tab_contact_focus.svg";
import IconTabSocial from "./assets/ic_tab_social.svg";
import IconTabSocialFocus from "./assets/ic_tab_social_focus.svg";
import AppContext from "./src/components/context/AppContext";
import ChatContext from "./src/components/context/ChatContext";
import { LogBox } from "react-native";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import { Api } from "./src/api/Api";
import { NativeBaseProvider } from "native-base";

const Tab = createBottomTabNavigator();

export default function App() {
  const flashMessage = React.useRef("timelineFlash");
  const displayMessage = (messageObject) => {
    showMessage(messageObject);
  };

  const initLoginState = {
    accessToken: null,
    isLoading: false,
    userId: null,
    socket: null,
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initLoginState);
  const authContext = {
    loginState,
    dispatch,
  };

  const [keyBoardHeight, setKeyBoardHeight] = React.useState(0);

  const [userName, setUserName] = React.useState("");
  const [avatar, setAvatar] = React.useState("avatar_2.png");
  const [coverImage, setCoverImage] = React.useState("defaul_cover_image.jpg");
  const [description, setDescription] = React.useState(undefined);
  const [blockedInbox, setBlockedInbox] = React.useState(new Array());
  const [blockedDiary, setBlockedDiary] = React.useState(new Array());
  const [phonenumber, setPhonenumber] = React.useState("");
  const [birthday, setBirthday] = React.useState(undefined);
  const [gender, setGender] = React.useState(undefined);
  const [postsInTimeLine, setPostsInTimeLine] = React.useState([]);
  const [postsInProfile, setPostsInProfile] = React.useState([]);

  const getMe = async () => {
    try {
      const token = loginState.accessToken;
      let res = await Api.getMe(token);
      let data = res.data.data;
      appContext.setUserName(data.username)
      appContext.setAvatar(data.avatar.fileName);
      appContext.setCoverImage(data.cover_image.fileName);
      appContext.setDescription(data.description);
      appContext.setBlockedInbox(data.blocked_inbox);
      appContext.setBlockedDiary(data.blocked_diary);
      appContext.setPhonenumber(data.phonenumber);
      appContext.setBirthday(data.birthday);
      appContext.setGender(data.gender);
    } catch (e) {
      console.log(e);
    }
  };

  const appContext = {
    displayMessage: displayMessage,

    keyBoardHeight,
    setKeyBoardHeight: (h) => {
      if (h > 0) {
        setKeyBoardHeight(h);
      }
    },

    userName,
    setUserName: (v) => {
      if (v != userName) {
        setUserName(v);
      }
    },

    avatar,
    setAvatar: (v) => {
      if (v != avatar) {
        setAvatar(v);
      }
    },

    coverImage,
    setCoverImage: (v) => {
      if (v != coverImage) {
        setCoverImage(v);
      }
    },

    description,
    setDescription: (v) => {
      if (v != description) {
        setDescription(V);
      }
    },

    blockedInbox,
    setBlockedInbox: (v) => {
      if (v.length != blockedInbox.length) {
        setBlockedInbox(v);
      }
    },

    blockedDiary,
    setBlockedDiary: (v) => {
      if (v.length != blockedDiary.length) {
        setBlockedDiary(v);
      }
    },

    phonenumber,
    setPhonenumber: (v) => {
      if (v != phonenumber) {
        setPhonenumber(v);
      }
    },

    birthday,
    setBirthday: (v) => {
      if (v != birthday) {
        setBirthday(v);
      }
    },

    gender,
    setGender: (v) => {
      if (v != gender) {
        setGender(v);
      }
    },

    updateUserInfo: getMe,

    postsInTimeLine,
    setPostsInTimeLine,

    postsInProfile,
    setPostsInProfile,

  };

  React.useEffect(()=>{
    if (loginState.accessToken) {
      appContext.updateUserInfo();
    }
  },[loginState.accessToken]);

  const [curFriendId, setCurFriendId] = React.useState(null);
  const [curChatId, setCurChatId] = React.useState(null);
  const [listUnseens, setListUnseens] = React.useState([]);
  const [listChats, setListChats] = React.useState(null);
  const [inChat, setInChat] = React.useState(false);
  const [needUpdateListChat, setNeedUpdateListChat] = React.useState(false);
  const [socket, setSocket] = React.useState(null);
  const [curBlockers, setCurBlockers] = React.useState([]);

  if (!socket && loginState.userId) {
    const { io } = require("socket.io-client");
    const socket = io("http://13.76.46.159:3000", {
      transportOptions: {
        polling: {
          extraHeaders: {
            token: loginState.accessToken,
          },
        },
      },
    });
    setSocket(socket);
  }

  const getListChats = async () => {
    try {
      accessToken = loginState.accessToken;

      const res = await Api.getChats(accessToken);
      let listChats = res.data.data;
      listChats.sort((chata, chatb) => {
        return (
          new Date(chata.lastMessage.time).getTime() <
          new Date(chatb.lastMessage.time).getTime()
        );
      });
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
    setCurBlockers([]);
  };

  var outChatRoom = () => {
    setCurFriendId(null);
    setCurChatId(null);
    setInChat(false);
  };

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
    outChatRoom,
    setCurBlockers,
    curBlockers,
  };

  return (
    <NativeBaseProvider>
      <FlashMessage
        ref={flashMessage}
        position="top"
        titleStyle={{ fontSize: 17, marginLeft: 6, marginTop: 2}}
      />
      <AuthContext.Provider value={authContext}>
        <AppContext.Provider value={appContext}>
          <ChatContext.Provider value={chatContext}>
            <NavigationContainer>
              {loginState.accessToken == null ? (
                <LoginStackScreen />
              ) : (
                <Tab.Navigator
                  screenOptions={{
                    headerShown: false,
                  }}
                >
                  <Tab.Screen
                    name="Tin nhắn"
                    component={MessageStackScreen}
                    options={{
                      tabBarIcon: ({ focused }) => {
                        if (focused && listUnseens) {
                          return <IconTabMessageFocus />;
                        }
                        return <IconTabMessage />;
                      },
                      tabBarBadge: listUnseens.length,
                      tabBarBadgeStyle: { height: listUnseens.length ? 18 : 0 },
                    }}
                  />
                  <Tab.Screen
                    name="Danh bạ"
                    component={ContactStackScreen}
                    options={{
                      tabBarIcon: ({ focused }) => {
                        if (focused) {
                          return <IconTabContactFocus />;
                        }
                        return <IconTabContact />;
                      },
                    }}
                  />
                  <Tab.Screen
                    name="Nhật ký"
                    component={TimeLineStackScreen}
                    options={{
                      tabBarIcon: ({ focused }) => {
                        if (focused) {
                          return <IconTabSocialFocus />;
                        }
                        return <IconTabSocial />;
                      },
                    }}
                  />
                  <Tab.Screen
                    name="Cá nhân"
                    component={ProfileStackScreen}
                    options={{
                      tabBarIcon: ({ focused }) => {
                        if (focused) {
                          return <IconTabMeFocus />;
                        }
                        return <IconTabMe />;
                      },
                    }}
                  />
                </Tab.Navigator>
              )}
            </NavigationContainer>
          </ChatContext.Provider>
        </AppContext.Provider>
      </AuthContext.Provider>
    </NativeBaseProvider>
  );
}
