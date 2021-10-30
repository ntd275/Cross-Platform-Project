import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AuthContext from "../components/context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import IconSearch from "../../assets/search-outline.svg";
import IconQR from "../../assets/ic_scan_qr_footer.svg";
import IconAdd from "../../assets/add-outline.svg";
import Message from "./components/Message";
export default function HomeMessageScreen() {
  const [search, setSearch] = useState("");
  const [isRead, setIsRead] = useState(false)
  const updateSearch = (search) => {
    setSearch(search);
  };
  const getSearchText = () => {
    console.log(search);
  };
  let datas = [
    {
      avatar:
        "https://scontent.fhan2-4.fna.fbcdn.net/v/t1.6435-9/133090782_1371551809851101_5019511807721447445_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=bCAO7C_sS4EAX_qyJiC&tn=3oiMvUeJSpvhduTu&_nc_ht=scontent.fhan2-4.fna&oh=48243902ce00139fbac561642e71d76a&oe=61994089",
      userName: "Tiểu Mai",
      lastMessage: "Em Yêu Anh",
      lastTimeChat: "Vừa xong",
    },
    {
      avatar:
        "https://scontent.fhan14-2.fna.fbcdn.net/v/t1.6435-9/69630456_1167922943417332_306513317491376128_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=aIiB6rnovfIAX-fgy8j&tn=3oiMvUeJSpvhduTu&_nc_ht=scontent.fhan14-2.fna&oh=dddc5362a24270abd0562e3fe3b9fcd6&oe=61A1F823",
      userName: "Phong Ha",
      lastMessage: "Ah hihi ",
      lastTimeChat: "Vừa xong",
    },
    {
      avatar:
        "https://scontent.fhan14-2.fna.fbcdn.net/v/t31.18172-8/28164977_894042084103505_4027496170173227810_o.jpg?_nc_cat=103&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=X4w42rK-MncAX8oyX-3&_nc_ht=scontent.fhan14-2.fna&oh=c3e8c090d382a5a841eec2ba78849ab1&oe=61A2ADC0",
      userName: "Vũ Nhật Anh",
      lastMessage: "Anh gửi em mấy tỉ tiêu dần",
      lastTimeChat: "2 phút trước",
    },
  ];
  messageList = [];
  for (let i = 0; i < datas.length; i++) {
    messageList.push(
      <TouchableHighlight key={i} style={{ marginTop: 12 }}>
        <Message
          userName={datas[i].userName}
          lastMessage={datas[i].lastMessage}
          lastTimeChat={datas[i].lastTimeChat}
          avatar={datas[i].avatar}
          isread = {isRead}
        ></Message>
      </TouchableHighlight>
    );
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
                placeholder="Tìm bạn bè, tin nhắn, ..."
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
        </LinearGradient>
        <ScrollView style={{ height: "100%" }}>{messageList}</ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f6f6",
    flexDirection: "column",
  },
  input: {
    color: "white",
    fontSize: 18,
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
});
