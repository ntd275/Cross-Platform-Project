import React, { useState } from "react";
import { Avatar } from "react-native-elements";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import IconCall from "../../../assets/call-outline.svg";
import { Api } from "../../api/Api";
import AuthContext from "../../components/context/AuthContext";
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
  // console.log(props.data);
  const pressChat = () => {
    navigation.navigate("ProfileScreen");
  };
  const GetFridendStatus = () => {
    if (friendStatus === "not friend") {
      return "Kết Bạn";
    }
    if (friendStatus === "sent") {
      return "Đã gửi";
    }
    if (friendStatus === "recieved") {
      return "Chấp nhận";
    }
    return "";
  };
  const SenRequestFriend = async () => {
    try {
      let accessToken = context.loginState.accessToken;
      console.log(friendId);
      results = await Api.sendFriendRequest(accessToken, friendId);
      let newFriendStatus = results.data.newStatus;
      setFriendStatus(newFriendStatus);
      // console.log(results);
    } catch (e) {
      console.log(e);
    }
  };
  const index = [...userName.matchAll(new RegExp(searchedText, "gi"))].map(
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
        <IconCall style={[styles.iconCall, { marginRight: 20 }]}></IconCall>
      );
    } else
      return (
        <View
          style={{
            width: 60,
            height: 20,
            marginLeft: "auto",
            backgroundColor: "#a3eaff",
            borderRadius: 10,
            justifyContent: "center",
            marginRight: 20,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "blue" }}
            onPress={SenRequestFriend}
          >
            {GetFridendStatus()}
          </Text>
        </View>
      );
  };
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity onPress={pressChat}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.avatars}>
            <Avatar
              rounded
              size="medium"
              onPress={pressChat}
              source={{
                uri: avatarURL,
              }}
            />
          </View>
          <View style={{ marginLeft: 10, width: "78%" }}>
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
