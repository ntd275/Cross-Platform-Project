import React, { useState } from "react";
import { SearchBar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import IconNotice from "../../assets/notifications-outline.svg";
import IconBack from "../../assets/arrow-back-outline.svg";
import IconSearch from "../../assets/search-outline.svg";
import IconNewPost from "../../assets/ic_post_line_24.svg";
import IconImage from "../../assets/image-outline.svg";
import IconVideo from "../../assets/videocam-outline.svg";
import IconAlbum from "../../assets/albums-outline.svg";
import { Avatar } from "react-native-elements";
import Post from "./components/Post"
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
export default function TimeLineScreen() {
  const [search, setSearch] = useState("");
  const updateSearch = (search) => {
    setSearch(search);
  };
  const getSearchText = () => {
    console.log(search);
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchBar}>
        <LinearGradient
          colors={["#0085ff", "#05adff"]}
          start={[0, 1]}
          end={[1, 0]}
          style={styles.header}
        >
          <View style={{ flexDirection: "row", marginTop: 55 }}>
            <TouchableOpacity onPress={getSearchText}>
              <View style={{ flex: 1 }}>
                <IconSearch style={styles.iconSearch} />
              </View>
            </TouchableOpacity>

            <View style={{ flex: 6 }}>
              <TextInput
                style={styles.input}
                onChangeText={updateSearch}
                value={search}
                // onTouchStart={()=>  alert("Hello...")}
                onEndEditing={getSearchText}
                placeholder="Tìm bạn bè, tin nhắn,..."
                placeholderTextColor="#fff"
              ></TextInput>
            </View>
            {/* <View>
              <IconBack style={styles.iconBack} />
            </View> */}
            <View style={{ flex: 1 }}>
              <IconNewPost style={styles.iconNewPost} />
            </View>
            <View style={{ flex: 1 }}>
              <IconNotice style={styles.iconNotice} />
            </View>
          </View>
        </LinearGradient>
      </View>
      <View style={styles.story}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            marginLeft: 10,
            marginTop: 20,
          }}
        >
          Khoảnh khắc
        </Text>
        <View>
          <Image
            style={styles.storyImage}
            source={require("../../assets/sticker_07.gif")}
          ></Image>
        </View>
      </View>
      <View style={styles.createPostArea}>
        <View style={styles.avatar}>
          <Avatar
            rounded
            size="medium"
            source={{
              uri: "https://scontent.fhan2-4.fna.fbcdn.net/v/t1.6435-9/133090782_1371551809851101_5019511807721447445_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=bCAO7C_sS4EAX_qyJiC&tn=3oiMvUeJSpvhduTu&_nc_ht=scontent.fhan2-4.fna&oh=48243902ce00139fbac561642e71d76a&oe=61994089",
            }}
          />
        </View>
        <View style={{ marginTop: 25, marginLeft: 10 }}>
          <TextInput
            style={{ color: "black", fontSize: 20 }}
            onChangeText={updateSearch}
            value={search}
            // onTouchStart={()=>  alert("Hello...")}
            onEndEditing={getSearchText}
            placeholder="Hôm nay bạn thế nào?"
            placeholderTextColor="#dedede"
          ></TextInput>
        </View>
      </View>
      <View style={styles.mediaArea}>
        <View style={styles.mediaPost}>
          <IconImage style={styles.iconImage} />
          <Text style={{ marginLeft: 5, marginRight: "auto" }}>
            Đăng ảnh
          </Text>
        </View>
        <View style={styles.mediaPost}>
          <IconVideo style={styles.iconVideo} />
          <Text style={{ marginLeft: 5, marginRight: "auto" }}>
            Đăng video
          </Text>
        </View>
        <View style={styles.mediaPost}>
          <IconAlbum style={styles.iconAlbum} />
          <Text style={{ marginLeft: 5, marginRight: "auto" }}>
            Tạo album
          </Text>
        </View>
      </View>
      <ScrollView style={{marginTop:0}}>
        <Post></Post>
      </ScrollView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dedede",
  },
  input: {
    color: "white",
    fontSize: 22,
    marginLeft: 10,
    width: "100%",
  },
  header: {
    width: "100%",
    color: "#fff",
    height: 90,
  },
  searchBar: {
    flex: 2,
    marginTop: 0,
  },
  story: {
    backgroundColor: "#fff",
  },
  createPostArea: {
    backgroundColor: "white",
    marginTop: 10,
    flexDirection: "row",
  },
  avatar: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  storyImage: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    width: 75,
    height: 100,
    borderRadius: 10,
    borderColor: "#dedede",
    borderWidth: 2,
  },
  mediaArea: {
    flexDirection: "row",
    marginTop: 2,
    backgroundColor: "white",
    height: 43,
  },
  mediaPost: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#dedede",
    borderWidth: 1,
    alignItems: "center",
  },
  iconNotice: {
    width: 22,
    height: 22,
    color: "white",
  },
  iconNewPost: {
    width: 20,
    height: 20,
    color: "black",
  },
  iconBack: {
    width: 20,
    height: 20,
    color: "white",
  },
  iconSearch: {
    width: 20,
    height: 20,
    color: "white",
    marginLeft: 10,
  },
  iconImage: {
    width: 20,
    height: 20,
    color: "green",
    marginLeft: "auto",
    
  },
  iconVideo: {
    width: 20,
    height: 20,
    color: "red",
    marginLeft: "auto",
    
  },
  iconAlbum: {
    width: 20,
    height: 20,
    color: "blue",
    marginLeft: "auto",
  },
});
