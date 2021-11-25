import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Image,
  Text,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Avatar } from "react-native-elements";
import AuthContext from "../components/context/AuthContext";
import ChatContext from "../components/context/ChatContext";
import { LinearGradient } from "expo-linear-gradient";
import IconSearch from "../../assets/search-outline.svg";
import IconQR from "../../assets/ic_scan_qr_footer.svg";
import IconAdd from "../../assets/add-outline.svg";
import { Api } from "../api/Api";
import { TimeUtility } from "../utils/TimeUtility";
import { useIsFocused } from "@react-navigation/native";
import { Audio } from "expo-av";

const BaseURL = "http://13.76.46.159:8000/files/";

export default function HomeMessageScreen({ navigation }) {
  const mounted = useRef(false);
  const isFocused = useIsFocused();
  const scrollViewRef = useRef(null);
  const context = React.useContext(AuthContext);
  const chatContext = React.useContext(ChatContext);
  const [search, setSearch] = useState("");
  const [needReload, setNeedReload] = useState(
    chatContext.listChats ? false : true
  );
  const [firstLoad, setFirstLoad] = useState(
    chatContext.listChats ? false : true
  );
  const [isLoading, setIsLoading] = useState(false);
  // if(firstLoad){
  //   chatContext.setGetListChats(getListChats);
  // }

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/message_noti.mp3")
    );
    await sound.playAsync();
  }

  useEffect(() => {
    mounted.current = true;
    const messageListener = (msg) => {
      if (mounted.current === false) {
        return;
      }

      // console.log("msg: "+ msg)
      if (
        msg.chatId == chatContext.curChatId ||
        msg.receiverId == chatContext.curFriendId ||
        msg.senderId == chatContext.curFriendId
      ) {
        chatContext.socket.emit("seenMessage", {
          token: context.loginState.accessToken,
          chatId: msg.chatId,
        });
        if (chatContext.curChatId !== msg.chatId) {
          chatContext.setCurChatId(msg.chatId);
        }
      } else if (msg.senderId != context.loginState.userId) {
        playSound();
        let chatId = msg.chatId;
        let temp = chatContext.listUnseens;
        let index = temp.indexOf(chatId);
        if (index == -1) {
          temp.push(chatId);
        }
        chatContext.setListUnseens(temp);
      }
      chatContext.setNeedUpdateListChat(true);

    };

    blockersListener = (msg) => {
      if (
        (msg.senderId == chatContext.curFriendId ||
          msg.receiverId == chatContext.curFriendId ||
          msg.chatId == chatContext.curChatId) &&
        chatContext.inChat
      ) {
        if (msg.data) {
          chatContext.setCurBlockers(msg.data.blockers);
          if (chatContext.curChatId !== msg.data.chatId) {
            chatContext.setCurChatId(msg.data.chatId);
          }
        }
      }
      if (!chatContext.needUpdateListChat) {
        chatContext.setNeedUpdateListChat(true);
      }
    };

    recallMessageListener = (msg) => {
      if (!chatContext.needUpdateListChat) {
        chatContext.setNeedUpdateListChat(true);
      }
    };

    chatContext.socket.removeListener("message", messageListener);
    chatContext.socket.removeListener("blockers", blockersListener);
    chatContext.socket.removeListener("recallmessage", recallMessageListener);
    chatContext.socket.on("message", messageListener);
    chatContext.socket.on("blockers", blockersListener);
    chatContext.socket.on("recallmessage", recallMessageListener);
    return () => {
      chatContext.socket.removeListener("message", messageListener);
      chatContext.socket.removeListener("blockers", blockersListener);
      chatContext.socket.removeListener("recallmessage", recallMessageListener);
      mounted.current = false;
    };
  }, [chatContext.curChatId, chatContext.curFriendId]);

  const updateSearch = (search) => {
    setSearch(search);
  };

  const getListChats = async () => {
    if (isLoading) {
      return;
    }
    // console.log("called")
    setIsLoading(true);
    try {
      accessToken = context.loginState.accessToken;

      const res = await Api.getChats(accessToken);
      let listChats = res.data.data;
      listChats.sort((chata, chatb) => {
        return (
          new Date(chata.lastMessage.time).getTime() <
          new Date(chatb.lastMessage.time).getTime()
        );
      });
      let listChatId = [];
      let listUnseens = chatContext.listUnseens;
      for (let i = 0; i < listChats.length; i++) {
        if (!listChats[i].seen) {
          listChatId.push(listChats[i].chatId);
        } else {
          let index = listUnseens.indexOf(listChats[i].chatId);
          if (index !== -1) {
            listUnseens.splice(index, 1);
          }
        }
      }
      let temp = Array.from(new Set(listChatId.concat(listUnseens)));
      // console.log(temp);
      chatContext.setListChats(listChats);
      chatContext.setListUnseens(temp);
      // console.log(chatContext.listChats);

      if (needReload) {
        setNeedReload(false);
      }

      if (firstLoad) {
        setFirstLoad(false);
      }

      if (!firstLoad && !chatContext.needUpdateListChat) {
        closeLoading();
      }

      chatContext.setNeedUpdateListChat(false);
      // if (chatContext.needUpdateListChat) {
    
      //   // scrollViewRef.current.scrollTo({x: 0, y: 0, animated: true})
      // }

      setIsLoading(false);
    } catch (err) {
      if (err.response && err.response.status == 401) {
        console.log(err.response.data.message);
        // setNotification("Không thể nhận diện");
        // console.log(notification)
        setIsLoading(false);
        return;
      }
      console.log(err);
      navigation.navigate("NoConnectionScreen", {
        message: "Lỗi kết nối, sẽ tự động thử lại khi có internet",
      });
    }
  };

  if (!firstLoad && !isLoading && chatContext.needUpdateListChat && isFocused) {
    getListChats();
  }

  const pressChat = (chatId, friend, isread, blockers) => {
    chatContext.setCurFriendId(friend.id);
    chatContext.setCurChatId(chatId);
    chatContext.setInChat(true);
    chatContext.setCurBlockers(blockers);
    if (!isread) {
      chatContext.setNeedUpdateListChat(true);
    }
    navigation.navigate("ConversationScreen", {
      chatId: chatId,
      friend: friend,
      isread: isread,
    });
    // console.log("go to chat screen");
  };

  var Message = (
    userName,
    lastMessage,
    avatarURL,
    isread,
    chatId,
    userId,
    phonenumber,
    blockers
  ) => {
    let content = lastMessage.content;
    if (lastMessage.senderId == context.loginState.userId) {
      content = "Bạn: " + content;
    }
    return (
      <TouchableOpacity
        onPress={() => {
          let friend = {
            username: userName,
            avatar: avatarURL,
            id: userId,
            phonenumber: phonenumber,
          };
          pressChat(chatId, friend, isread, blockers);
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.avatars}>
            <Avatar
              rounded
              size={55.5}
              source={{
                uri: avatarURL,
              }}
            />
          </View>
          <View
            style={{
              marginLeft: 12,
              width: "80%",
              borderBottomColor: "#ebeceb",
              borderBottomWidth: 1,
              marginTop: 12,
              paddingBottom: 16,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: isread ? "500" : "700",
                    paddingBottom: 6,
                  }}
                >
                  {userName}
                </Text>
              </View>
              <View style={{ marginLeft: "auto", marginRight: 10 }}>
                <Text
                  style={{
                    textAlign: "right",
                    opacity: isread ? 0.5 : 1,
                    fontSize: 13,
                    fontWeight: isread ? "400" : "500",
                  }}
                >
                  {TimeUtility.getTimeStr(new Date(lastMessage.time))}{" "}
                </Text>
              </View>
            </View>
            <Text
              style={{
                opacity: isread ? 0.5 : 1,
                fontSize: 15,
                maxWidth: "74%",
                fontWeight: isread ? "400" : "500",
              }}
              numberOfLines={1}
            >
              {content}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  let chats = chatContext.listChats;
  let chatList = [];
  if (chats) {
    for (let i = 0; i < chats.length; i++) {
      chatList.push(
        <View key={i} style={{ marginTop: 12 }}>
          {Message(
            chats[i].friend.username,
            chats[i].lastMessage,
            BaseURL + chats[i].friend.avatar.fileName,
            chats[i].seen,
            chats[i].chatId,
            chats[i].friend._id,
            chats[i].friend.phonenumber,
            chats[i].blockers
          )}
        </View>
      );
    }
  }

  let opacity = useRef(new Animated.Value(0));

  let openLoading = () => {
    opacity.current.setValue(100);
  };

  const getSearchText = () => {
    console.log(search);
  };

  let closeLoading = () => {
    opacity.current.setValue(100);
    Animated.timing(opacity.current, {
      toValue: 0,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  if (needReload && !isLoading) {
    getListChats();
  }

  var NotiHeader = () => {
    if (needReload && firstLoad) {
      return (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.describeText}>
            Đang tải dữ liệu, chờ chút thôi ...
          </Text>
        </View>
      );
    }
    if (chats && chats.length == 0) {
      return (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.describeText}>Chưa có cuộc trò chuyện nào</Text>
        </View>
      );
    }

    return <></>;
  };

  var LoadingHeader = () => {
    return (
      <Animated.View style={{ height: opacity.current, overflow: "hidden" }}>
        <ActivityIndicator size="large" style={{ marginTop: 14 }} />
        <Text style={styles.describeText}>
          Đang tải dữ liệu, chờ chút thôi ...
        </Text>
      </Animated.View>
    );
  };

  var handleScrollDrag = function (event) {
    if (event.nativeEvent.contentOffset.y < -57 && !needReload && !isLoading) {
      openLoading();
      setNeedReload(true);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <LinearGradient
          colors={["#0085ff", "#05adff"]}
          start={[0, 1]}
          end={[1, 0]}
          style={styles.header}
        >
          <View style={{ flexDirection: "row", marginTop: 28 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SearchScreen");
              }}
            >
              <View style={{ flex: 1 }}>
                <IconSearch style={styles.iconSearch} />
              </View>
            </TouchableOpacity>

            <View style={{ flex: 6 }}>
              <TextInput
                style={styles.input}
                value={search}
                onTouchStart={() => {
                  navigation.navigate("SearchScreen");
                }}
                placeholder="Tìm bạn bè, tin nhắn..."
                placeholderTextColor="#fff"
              ></TextInput>
            </View>
            <View style={{ flex: 1 }}>
              <IconQR style={styles.iconQR} />
            </View>
            <View style={{ flex: 1 }}>
              <IconAdd style={styles.iconAdd} />
            </View>
          </View>
          <StatusBar
            backgroundColor="#00000000"
            barStyle="light-content"
            translucent={true}
          />
        </LinearGradient>
        <View>{LoadingHeader()}</View>
        <ScrollView
          onScrollEndDrag={handleScrollDrag}
          style={{ minHeight: "100%", backgroundColor: "#fff" }}
          ref={scrollViewRef}
        >
          {NotiHeader()}
          {chatList}
          <View style={{ height: 194 }}></View>
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  input: {
    color: "white",
    fontSize: 16,
    marginLeft: 16,
    width: "100%",
    marginTop: 4,
  },
  header: {
    width: "100%",
    color: "#fff",
    height: 62,
  },
  iconSearch: {
    width: 24,
    height: 24,
    color: "white",
    marginLeft: 10,
    marginTop: 2,
  },
  iconQR: {
    width: 24,
    height: 24,
    color: "white",
    marginLeft: "auto",
    marginRight: 12,
    marginTop: 2,
  },
  iconAdd: {
    width: 28,
    height: 28,
    color: "white",
    marginLeft: "auto",
    marginRight: 12,
    marginTop: 0,
  },
  describeText: {
    fontSize: 14,
    paddingLeft: 16,
    paddingRight: 16,
    color: "#778993",
    marginTop: 12,
    marginBottom: 4,
    textAlign: "center",
  },
  avatars: {
    marginLeft: 12,
    marginTop: 6,
    marginBottom: 10,
  },
});
