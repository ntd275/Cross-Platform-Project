import React, { useContext, useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import IconNotice from "../../assets/notifications-outline.svg";
import IconSearch from "../../assets/search-outline.svg";
import IconNewPost from "../../assets/ic_post_line_24.svg";
import IconImage from "../../assets/ic_photo_grd.svg";
import IconVideo from "../../assets/ic_video_solid_24.svg";
import IconAlbum from "../../assets/ic_album.svg";
import { Avatar } from "react-native-elements";
import Post from "./components/Post";
import { Api } from "../api/Api";
import AuthContext from "../components/context/AuthContext";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useKeyboard } from "./components/useKeyboard";
import AppContext from "../components/context/AppContext";
import { AvatarReactElementCache, ImageCache } from "./components/ImageCache";
import { BaseURL } from "../utils/Constants";
import { useIsFocused } from "@react-navigation/native";

const ListHeader = ({ navigation, isLoading, firstLoad }) => {
  const appContext = useContext(AppContext);
  const NotiHeader = () => {
    if (isLoading && firstLoad) {
      return (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.describeText}>
            Đang tải dữ liệu, chờ chút thôi ...
          </Text>
          <ActivityIndicator />
        </View>
      );
    }
    if (appContext.postsInTimeLine.length == 0) {
      return (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.describeText}>Chưa có bài đăng nào</Text>
        </View>
      );
    }
    return <></>;
  };

  const keyBoardHeight = useKeyboard();
  const inputRef = useRef();
  const mode = useRef("image");
  return (
    <>
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
          <AvatarReactElementCache
            rounded
            size="medium"
            source={{
              uri: BaseURL + appContext.avatar,
            }}
          />
        </View>
        <View style={{ marginTop: 25, marginLeft: 10 }}>
          <TextInput
            style={{ color: "black", fontSize: 18 }}
            // onTouchStart={()=>  alert("Hello...")}
            placeholder="Hôm nay bạn thế nào?"
            placeholderTextColor="#dedede"
            onFocus={() => {
              inputRef.current.blur();
              navigation.navigate("CreatePost", { mode: mode.current });
            }}
            onBlur={() => {
              appContext.setKeyBoardHeight(keyBoardHeight);
            }}
            ref={inputRef}
          ></TextInput>
        </View>
      </View>
      <View style={styles.mediaArea}>
        <Pressable
          style={styles.mediaPost}
          onPress={() => {
            (mode.current = "image"), inputRef.current.focus();
          }}
        >
          <IconImage style={styles.iconImage} />
          <Text
            style={{
              marginLeft: 5,
              marginRight: "auto",
              fontWeight: "600",
              fontSize: 13,
            }}
          >
            Đăng ảnh
          </Text>
        </Pressable>
        <Pressable
          style={styles.mediaPost}
          onPress={() => {
            (mode.current = "video"), inputRef.current.focus();
          }}
        >
          <IconVideo style={styles.iconVideo} />
          <Text
            style={{
              marginLeft: 5,
              marginRight: "auto",
              fontWeight: "600",
              fontSize: 13,
            }}
          >
            Đăng video
          </Text>
        </Pressable>
        <View style={styles.mediaPost}>
          <IconAlbum style={styles.iconAlbum} />
          <Text
            style={{
              marginLeft: 5,
              marginRight: "auto",
              fontWeight: "600",
              fontSize: 13,
            }}
          >
            Tạo album
          </Text>
        </View>
      </View>
      <NotiHeader />
    </>
  );
};

export default function TimeLineScreen({ navigation }) {
  const [search, setSearch] = useState("");

  const [firstLoad, setFirstLoad] = useState(true);
  const authContext = React.useContext(AuthContext);
  const appContext = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPosts();
    appContext.updateUserInfo();
  }, []);

  const getPosts = async () => {
    setIsLoading(true);
    try {
      accessToken = authContext.loginState.accessToken;
      const res = await Api.getPosts(accessToken);
      let postList = res.data.data;
      appContext.setPostsInTimeLine(postList.reverse());

      setFirstLoad(false);
      appContext.setNeedUpdateTimeline(false);
      setIsLoading(false);
    } catch (err) {
      if (err.response && err.response.status == 401) {
        console.log(err.response.data.message);
        setIsLoading(false);
        return;
      }
      console.log(err);
      navigation.navigate("NoConnectionScreen", {
        message: "Lỗi kết nối, sẽ tự động thử lại khi có internet",
      });
    }
  };

  const refreshPosts = async () => {
    setRefreshing(true);
    await Promise.all([getPosts(), appContext.updateUserInfo()]);
    setRefreshing(false);
  };

  const isFocused = useIsFocused();

  if (isFocused && appContext.needUpdateTimeline && !isLoading) {
    setIsLoading(true);
    // console.log("update timeline")
    refreshPosts();
  }

  return (
    <View>
      <StatusBar
        backgroundColor="#00000000"
        barStyle="light-content"
        translucent={true}
      />
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
                placeholder="Tìm bạn bè, tin nhắn, ..."
                placeholderTextColor="#fff"
              ></TextInput>
            </View>
            <View style={{ flex: 1 }}>
              <IconNewPost style={styles.iconNewPost} />
            </View>
            <View style={{ flex: 1 }}>
              <IconNotice style={styles.iconNotice} />
            </View>
          </View>
        </LinearGradient>
      </View>

      <FlatList
        keyboardShouldPersistTaps={"always"}
        data={appContext.postsInTimeLine}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <ListHeader
            isLoading={isLoading}
            navigation={navigation}
            firstLoad={firstLoad}
          />
        }
        renderItem={({ item }) => (
          <View style={{ marginTop: 12 }}>
            <Post
              mode={"timeline"}
              post={item}
              navigation={navigation}
              from="timeline"
            />
          </View>
        )}
        style={{ marginBottom: 74 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshPosts} />
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f6f6",
    minHeight: "100%",
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
  story: {
    backgroundColor: "#fff",
  },
  createPostArea: {
    backgroundColor: "white",
    marginTop: 10,
    flexDirection: "row",
  },
  avatar: {
    marginLeft: 18,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 9,
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
    marginTop: 2,
  },
  iconNewPost: {
    width: 24,
    height: 24,
    color: "black",
    marginLeft: "auto",
    marginRight: 12,
    marginTop: 2,
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
    marginTop: 2,
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
    textAlign: "center",
  },
});
