import React, { useState } from "react";
import { Avatar } from "react-native-elements";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import IconCall from "../../../assets/call-outline.svg";
export default function Contact(props) {
  const [userName, setuserName] = useState(props.userName);
  const [avatarURL, setavatarURL] = useState(props.avatar);
  const [isFriend, setisFriend] = useState(props.isfriend);
  const [searchedText, setSearchedText] = useState(props.searchText);
  const navigation = props.navigation
  const pressChat = () => {
    navigation.navigate("ProfileScreen")
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
            onPress={() => {
              setisFriend(true);
            }}
          >
            Kết bạn
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
