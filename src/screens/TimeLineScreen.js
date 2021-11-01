import React, { useContext, useRef, useState } from "react";
import { SearchBar } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import IconNotice from "../../assets/notifications-outline.svg";
import IconBack from "../../assets/arrow-back-outline.svg";
import IconSearch from "../../assets/search-outline.svg";
import IconNewPost from "../../assets/ic_post_line_24.svg";
import IconImage from "../../assets/ic_photo_grd.svg";
import IconVideo from "../../assets/ic_video_solid_24.svg";
import IconAlbum from "../../assets/ic_album.svg";
import { Avatar } from "react-native-elements";
import Post from "./components/Post"
import { Api } from '../api/Api'
import AuthContext from '../components/context/AuthContext';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  FlatList
} from "react-native";
import { useKeyboard } from "./components/useKeyboard";
import AppContext from "../components/context/AppContext";

const BaseURL = "http://13.76.46.159:8000/files/"

export default function TimeLineScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [needReload, setNeedReload] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [posts, setPosts] = useState([]);

  const updateSearch = (search) => {
    setSearch(search);
  };
  const getSearchText = () => {
    console.log(search);
  };
  const context = React.useContext(AuthContext);
  const appContext = useContext(AppContext)
  const getAvatar = async () => {
    try {
      accessToken ="lol "+context.loginState.accessToken
      let user = await Api.getMe(accessToken)
      console.log(user.data)
      appContext.setAvatar(user.data.data.avatar.fileName)
    } catch (e){
      console.log(e)
    }
  }
  const getPosts = async () => {
    try {
      accessToken = context.loginState.accessToken;
      accessToken = "lol " + accessToken
      // console.log(accessToken)
      const res = await Api.getPosts(accessToken);
      let postList = res.data.data;

      setPosts(postList);
      if (needReload) {
        setNeedReload(false);
      }

      if (firstLoad) {
        setFirstLoad(false);
      }
      // console.log(postList)
    } catch (err) {
      if (err.response && err.response.status == 401) {
        console.log(err.response.data.message);
        // setNotification("Không thể nhận diện");
        // console.log(notification)
        return;
      }
      console.log(err);
      navigation.navigate("NoConnectionScreen", {
        message: "Lỗi kết nối, sẽ tự động thử lại khi có internet",
      });
    }
  };

  if (needReload) {
    getAvatar();
    getPosts();
  }

  var handleScrollDrag = function (event) {
    if (event.nativeEvent.contentOffset.y < -80 && !needReload) {
      setNeedReload(true)
    }
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
    if (posts.length == 0) {
      return (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.describeText}>Chưa có bài đăng nào</Text>
        </View>
      );
    }

    return (
      <></>
    );
  }

  var ScreenBody = () => {
    let postList = [];
    for (let i = 0; i < posts.length; i++) {
      postList.push(
        <View key={i} style={{ marginTop: 12 }}>
          <Post mode={"timeline"} updateFunc={getPosts} post={posts[i]} navigation={navigation} />
        </View>
      );
    }

    return (
      <>
        {postList}
      </>
    );
  }

  const keyBoardHeight = useKeyboard()
  const inputRef = useRef()
  const mode = useRef('image')
  var LoadingHeader = () => {
    if (!firstLoad && needReload) {
      return (
        <View style={{ marginTop: 10 }}>
          <Image
            source={require("../../assets/loading.gif")}
            style={{ alignSelf: "center" }}
          />
          <Text style={styles.describeText}>Đang tải dữ liệu, chờ chút thôi ...</Text>
        </View>
      );
    } else {
      return <></>
    }

  }

  var ListHeader = () => {
    return (
      <>
        {LoadingHeader()}
        <View style={styles.story}>
          <Text
            style={{
              fontSize: 14,
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
                uri: BaseURL+appContext.avatar,
              }}
            />
          </View>
          <View style={{ marginTop: 25, marginLeft: 10 }}>
            <TextInput
              style={{ color: "black", fontSize: 18 }}
              // onTouchStart={()=>  alert("Hello...")}
              placeholder="Hôm nay bạn thế nào?"
              placeholderTextColor="#dedede"
              onFocus={() => {inputRef.current.blur();navigation.navigate("CreatePost",{mode: mode.current});}}
              onBlur={() => {appContext.setKeyBoardHeight(keyBoardHeight)}}
              ref = {inputRef}
            >
            </TextInput>
          </View>
        </View>
        <View style={styles.mediaArea}>
          <Pressable style={styles.mediaPost} onPress={()=>{mode.current = 'image', inputRef.current.focus()}}>
            <IconImage style={styles.iconImage} />
            <Text style={{ marginLeft: 5, marginRight: "auto", fontWeight: '600', fontSize: 13 }}>
              Đăng ảnh
            </Text>
          </Pressable>
          <Pressable style={styles.mediaPost} onPress={()=>{mode.current = 'video', inputRef.current.focus()}}>
            <IconVideo style={styles.iconVideo} />
            <Text style={{ marginLeft: 5, marginRight: "auto", fontWeight: '600', fontSize: 13 }}>
              Đăng video
            </Text>
          </Pressable>
          <View style={styles.mediaPost}>
            <IconAlbum style={styles.iconAlbum} />
            <Text style={{ marginLeft: 5, marginRight: "auto", fontWeight: '600', fontSize: 13 }}>
              Tạo album
            </Text>
          </View>
        </View>
        <NotiHeader />
      </>
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
            <TouchableOpacity onPress={getPosts}>
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
                placeholder="Tìm bạn bè, tin nhắn, ..."
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
          <StatusBar
            backgroundColor="#00000000"
            barStyle="light-content"
            translucent={true}
          />
        </LinearGradient>
      </View>

      <FlatList
        keyboardShouldPersistTaps={'always'}
        onScrollEndDrag={handleScrollDrag}
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={<ListHeader />}
        renderItem={({ item }) => (
          <View style={{ marginTop: 12 }}>
            <Post mode={"timeline"} updateFunc={getPosts} post={item} navigation={navigation} />
          </View>
        )}
        style={{marginBottom: 74}}
      />

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f6f6",
    minHeight: "100%",
    flexDirection: "column"
  },
  input: {
    color: "white",
    fontSize: 16,
    marginLeft: 16,
    width: "100%",
    marginTop: 4
  },
  header: {
    width: "100%",
    color: "#fff",
    height: 62,
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
    marginTop: 0,
    backgroundColor: "white",
    height: 43,
  },
  mediaPost: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#dedede",
    borderWidth: 0.5,
    alignItems: "center",
  },
  iconNotice: {
    width: 24,
    height: 24,
    color: "white",
    marginLeft: "auto",
    marginRight: 8,
    marginTop: 2
  },
  iconNewPost: {
    width: 24,
    height: 24,
    color: "black",
    marginLeft: "auto",
    marginRight: 12,
    marginTop: 2
  },
  iconBack: {
    width: 20,
    height: 20,
    color: "white",
  },
  iconSearch: {
    width: 24,
    height: 24,
    color: "white",
    marginLeft: 10,
    marginTop: 2
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
  describeText: {
    fontSize: 14,
    paddingLeft: 16,
    paddingRight: 16,
    color: "#778993",
    marginTop: 12,
    marginBottom: 12,
    textAlign: "center"
  }
});
