import React, { useEffect, useState } from "react";
import { Avatar } from "react-native-elements";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import IconCall from "../../../assets/call-outline.svg";
import { Api } from "../../api/Api";
import AuthContext from "../../components/context/AuthContext";
import ChatContext from "../../components/context/ChatContext";
import matchAll from 'string.prototype.matchall';

export default function Contact(props) {
  const BaseURL = "http://13.76.46.159:8000/files/";
  const [userName, setuserName] = useState(props.data.username);
  const [avatarURL, setavatarURL] = useState(
    BaseURL + props.data.avatar.fileName
  );
  const [friendId, setFriendId] = useState(props.data._id);
  const [isFriend, setisFriend] = useState(props.isfriend);
  const [searchedText, setSearchedText] = useState(props.searchText);
  const navigation = props.navigation;
  const [friendStatus, setFriendStatus] = useState(props.data.friendStatus);
  const context = React.useContext(AuthContext);
  const chatContext = React.useContext(ChatContext);
  const pressChat = () => {
    navigation.navigate("ProfileScreen");
  };
  var goToUserPage = () => {
    if (chatContext.needUpdateListChat) {
      chatContext.setForceUpdateChat(true);
    }
    navigation.navigate("ViewProfileScreen", {
      userId: friendId,
    });
  };

  const GetFridendStatus = (friendStatus) => {
    if (friendStatus === "not friend") {
      return "Kết Bạn";
    }
    if (friendStatus === "sent") {
      return "Đã gửi";
    }
    if (friendStatus === "received") {
      return "Chấp nhận";
    }
    return "";
  };
  useEffect(() => {
    GetFridendStatus();
  }, [friendStatus, isFriend]);

  const HandleFriendRequest = () => {
    if (friendStatus === "not friend") {
      SenRequestFriend();
      return;
    }
    if (friendStatus === "sent") {
      SendCancelFriendRequest();
      return;
    }
    if (friendStatus === "received") {
      sendAcceptFriendRequest();
      setisFriend(true);
    }
  };
  const SenRequestFriend = async () => {
    try {
      let accessToken = context.loginState.accessToken;
      console.log("Gửi lời mời kết bạn: ", friendId);
      let results = await Api.sendFriendRequest(accessToken, friendId);
      setFriendStatus(results.data.newStatus);
    } catch (e) {
      console.log(e);
    }
  };
  const SendCancelFriendRequest = async () => {
    try {
      let accessToken = context.loginState.accessToken;
      console.log("Hủy gửi lời mời kết bạn: ", friendId);
      let results = await Api.sendCancelFriendRequest(accessToken, friendId);
      setFriendStatus(results.data.newStatus);
    } catch (e) {
      console.log(e);
    }
  };

  const sendAcceptFriendRequest = async () => {
    try {
      let accessToken = context.loginState.accessToken;
      console.log("Chấp nhận lời mời kết bạn: ", friendId);
      let results = await Api.sendAcceptFriendRequest(accessToken, friendId);
      setFriendStatus(results.data.newStatus);
    } catch (e) {
      console.log(e);
    }
  };
  const index = [...matchAll(userName, new RegExp(searchedText, "gi"))].map(
    (a) => a.index
  );
  const indexDraw = [];
  for (let i = 0; i < index.length; i++) {
    indexDraw.push(index[i]);
    for (let j = index[i] + 1; j < searchedText.length + index[i]; j++) {
      indexDraw.push(j);
    }
  }
  const RenderIcon = () => {
    if (isFriend) {
      return (
        <TouchableOpacity>
          <IconCall style={[styles.iconCall, { marginRight: 0 }]}></IconCall>
        </TouchableOpacity>
      );
    } else
      return (
        <View
          style={{
            width: 70,
            height: 20,
            marginLeft: "auto",
            backgroundColor: "#a3eaff",
            borderRadius: 10,
            justifyContent: "center",
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <Text
              style={{ textAlign: "center", color: "blue" }}
              onPress={HandleFriendRequest}
            >
              {GetFridendStatus(friendStatus)}
            </Text>
          </TouchableOpacity>
        </View>
      );
  };
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity onPress={goToUserPage}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "85%",
          }}
        >
          <View style={styles.avatars}>
            <Avatar
              rounded
              size="medium"
              onPress={goToUserPage}
              source={{
                uri: avatarURL,
              }}
            />
          </View>
          <View style={{ marginLeft: 10, marginRight: "auto" }}>
            <View style={{ flexDirection: "row" }}>
              <View>
                <Text>
                  {userName.split("").map((x, ind) => (
                    <Text
                      style={{
                        color: indexDraw.includes(ind) ? "blue" : "black",
                      }}
                      key={ind}
                    >
                      {x + ""}
                    </Text>
                  ))}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <RenderIcon></RenderIcon>
    </View>
  );
}
const styles = StyleSheet.create({
  avatars: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  iconCall: {
    width: 20,
    height: 20,
    marginLeft: "auto",
  },
});
