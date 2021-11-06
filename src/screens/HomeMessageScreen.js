import React, { useState, useRef } from "react";
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
  StatusBar
} from "react-native";
import { Avatar } from "react-native-elements";
import AuthContext from "../components/context/AuthContext";
import ChatContext from "../components/context/ChatContext";
import { LinearGradient } from "expo-linear-gradient";
import IconSearch from "../../assets/search-outline.svg";
import IconQR from "../../assets/ic_scan_qr_footer.svg";
import IconAdd from "../../assets/add-outline.svg";
import { Api } from '../api/Api'
import { TimeUtility } from "../utils/TimeUtility";

const BaseURL = "http://13.76.46.159:8000/files/"

export default function HomeMessageScreen({ navigation }) {
  const context = React.useContext(AuthContext);
  const chatContext = React.useContext(ChatContext);
  const [search, setSearch] = useState("");
  const [needReload, setNeedReload] = useState(chatContext.listChats ? false : true);
  const [firstLoad, setFirstLoad] = useState(chatContext.listChats ? false : true);
  const [isLoading, setIsLoading] = useState(false);
  // if(firstLoad){
  //   chatContext.setGetListChats(getListChats);
  // }

  const updateSearch = (search) => {
    setSearch(search);
  };


  const getListChats = async () => {
    if (isLoading) {
      return
    }
    // console.log("called")
    setIsLoading(true)
    try {
      accessToken = context.loginState.accessToken;

      const res = await Api.getChats(accessToken);
      let listChats = res.data.data;
      listChats.sort((chata, chatb)=>{
        return new Date(chata.lastMessage.time).getTime() < new Date(chatb.lastMessage.time).getTime();
      })
      let listChatId = [];
      let listUnseens = chatContext.listUnseens;
      for(let i=0; i< listChats.length; i++){
        if(!listChats[i].seen){
          listChatId.push(listChats[i].chatId);
        }else{
          let index = listUnseens.indexOf(listChats[i].chatId);
          if(index !== -1){
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

      setIsLoading(false)
      if (!firstLoad) {
        closeLoading()
      }

    } catch (err) {
      if (err.response && err.response.status == 401) {
        console.log(err.response.data.message);
        // setNotification("Không thể nhận diện");
        // console.log(notification)
        setIsLoading(false)
        return;
      }
      console.log(err);
      navigation.navigate("NoConnectionScreen", {
        message: "Lỗi kết nối, sẽ tự động thử lại khi có internet",
      });
    }
  };

  const pressChat = (chatId, friend, isread) => {
    chatContext.setCurChatId(chatId);
    chatContext.setCurFriendId(friend.id);
    chatContext.setInChat(true);
    navigation.navigate("ConversationScreen", {chatId: chatId, friend: friend, isread: isread});
    console.log("go to chat screen");
  };

  var Message = (userName, lastMessage, avatarURL, isread, chatId, userId, phonenumber) => {
    let content = lastMessage.content;
    if(lastMessage.senderId == context.loginState.userId){
      content= "Bạn: " + content;
    }
    return (
      <TouchableOpacity 
      onPress={()=>{
          let friend = {
            username: userName,
            avatar: avatarURL,
            id: userId,
            phonenumber: phonenumber
          }
          pressChat(chatId, friend, isread);
      }}
      >
        <View style={{ flexDirection: "row", alignItems: "center"}}>
          <View style={styles.avatars}>
            <Avatar
              rounded
              size={55.5}
              source={{
                uri: avatarURL,
              }}
            />
          </View>
          <View style={{ marginLeft: 12, width: "80%", borderBottomColor: "#ebeceb",borderBottomWidth: 1, marginTop: 12, paddingBottom: 16 }}>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text style={{ fontSize: 17, fontWeight:  isread? '500': '700', paddingBottom: 6 }}>{userName}</Text>
              </View>
              <View style={{ marginLeft: "auto", marginRight: 14 }}>
                <Text style={{ textAlign: "right", opacity: isread ? 0.5 : 1, fontSize: 13, fontWeight:  isread? '400': '500', }}>{TimeUtility.getTimeStr(new Date(lastMessage.time))} </Text>
              </View>
            </View >
            <Text style={{ opacity: isread ? 0.5 : 1, fontSize: 15, maxWidth: "74%", fontWeight:  isread? '400': '500',}} numberOfLines={1}>{content}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  let chats = chatContext.listChats;
  let chatList = [];
  if (chats) {
    for (let i = 0; i < chats.length; i++) {
      chatList.push(
        <View key={i} style={{ marginTop: 12 }}>
          {Message(chats[i].friend.username, chats[i].lastMessage, BaseURL +  chats[i].friend.avatar.fileName, chats[i].seen,
           chats[i].chatId, chats[i].friend._id, chats[i].friend.phonenumber)}
        </View>
      );
    }
  }


  let opacity = useRef(new Animated.Value(0))

  let openLoading = () => {
    opacity.current.setValue(100)
  }

  const getSearchText = () => {
    console.log(search);
  };

  let closeLoading = () => {
    opacity.current.setValue(100)
    Animated.timing(opacity.current, {
      toValue: 0,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: false
    }).start();
  }

  if (needReload && !isLoading) {
    getListChats();
  }

  var NotiHeader = () => {
    if (needReload && firstLoad) {
      return (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.describeText}>Đang tải dữ liệu, chờ chút thôi ...</Text>
          <Image
            source={require("../../assets/loading.gif")}
            style={{ alignSelf: "center" }}
          />
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

    return (
      <></>
    );
  }

  var LoadingHeader = () => {
    return (
      <Animated.View style={{ height: opacity.current, overflow:"hidden" }} >
        <Image
          source={require("../../assets/loading.gif")}
          style={{ alignSelf: "center", marginTop: 10}}
        />
        <Text style={styles.describeText}>Đang tải dữ liệu, chờ chút thôi ...</Text>
      </Animated.View>
    );
  }

  var handleScrollDrag = function (event) {
    if (event.nativeEvent.contentOffset.y < -80 && !needReload) {
      openLoading()
      setNeedReload(true)
    }
  }

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
            <TouchableOpacity>
              <View style={{ flex: 1 }}>
                <IconSearch style={styles.iconSearch} />
              </View>
            </TouchableOpacity>

            <View style={{ flex: 6 }}>
              <TextInput
                style={styles.input}
                onChangeText={updateSearch}
                value={search}
                onEndEditing={getSearchText}
                placeholder="Tìm bạn bè, tin nhắn,..."
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
        <View>
          {LoadingHeader()}
        </View>
        <ScrollView
          onScrollEndDrag={handleScrollDrag}
          style={{minHeight: '100%', backgroundColor: "#fff"}}
        >
          {NotiHeader()}
          {chatList}
          <View style={{height:194}}></View>
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
    marginBottom: 12,
    textAlign: "center"
  },
  avatars: {
    marginLeft: 12,
    marginTop: 6,
    marginBottom: 10,
  },
});
