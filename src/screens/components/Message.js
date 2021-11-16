import React, { useState } from "react";
import { Avatar } from "react-native-elements";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";

export default function Message(props) {

  const [lastTimeChat, setlastTimeChat] = useState(props.lastTimeChat);
  const [userName, setuserName] = useState(props.userName);
  const [lastMessage, setlastMessage] = useState(props.lastMessage);
  const [avatarURL, setavatarURL] = useState(props.avatar)
  const [isread, setisread] = useState(props.isread)
  const pressChat = () => {
    const new_isread  = true
    setisread(new_isread)
    console.log("go to chat screen");
  };
  return (
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
        <View style={{ marginLeft: 10, width: "80%" }}>
          <View style={{ flexDirection: "row" }}>
            <View>
              <Text>{userName}</Text>
            </View>
            <View style={{ marginLeft: "auto" }}>
              <Text style={{ textAlign: "right" , opacity:isread ? 0.5 : 1}}>{lastTimeChat} </Text>
            </View>
          </View>
          <Text style={{opacity:isread ? 0.5 : 1}}>{lastMessage}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatars: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});
