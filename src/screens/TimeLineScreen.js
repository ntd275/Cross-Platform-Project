import React, { useContext, useState } from "react";
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
import { Pressable, StatusBar } from 'react-native';
import { Api } from '../api/Api'
import AuthContext from '../components/context/AuthContext';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  FlatList
} from "react-native";
import useKeyboardHeight from 'react-native-use-keyboard-height';
import AppContext from "../components/context/AppContext";

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

  const keyBoardHeight = useKeyboardHeight()
  const appContext = useContext(AppContext)

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
                uri: "https://scontent.fhan2-4.fna.fbcdn.net/v/t1.6435-9/133090782_1371551809851101_5019511807721447445_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=bCAO7C_sS4EAX_qyJiC&tn=3oiMvUeJSpvhduTu&_nc_ht=scontent.fhan2-4.fna&oh=48243902ce00139fbac561642e71d76a&oe=61994089",
              }}
            />
          </View>
          <View style={{ marginTop: 25, marginLeft: 10, width: '100%' }}>
            <Pressable style={{ width: '100%' }} onPress={() => { navigation.navigate("CreatePost") }} >
              <Text style={{ color: "#dedede", fontSize: 18 }}>
                Hôm nay bạn thế nào?
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.mediaArea}>
          <TouchableOpacity flex={1} style={{ width: "33.3%" }} onPress={() => { navigation.navigate("CreatePost") }}>
            <View style={styles.mediaPost}>
              <IconImage style={styles.iconImage} />
              <Text style={{ marginLeft: 5, marginRight: "auto", fontWeight: '600', fontSize: 13 }}>
                Đăng ảnh
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity flex={1} style={{ width: "33.3%" }} onPress={() => { navigation.navigate("CreatePost") }}>
            <View style={styles.mediaPost}>
              <IconVideo style={styles.iconVideo} />
              <Text style={{ marginLeft: 5, marginRight: "auto", fontWeight: '600', fontSize: 13 }}>
                Đăng video
              </Text>
            </View>
          </TouchableOpacity>
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
