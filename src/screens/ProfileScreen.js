import React, { useContext, useRef, useState } from "react";
import IconImage from "../../assets/ic_photo_grd.svg";
import IconVideo from "../../assets/ic_video_solid_24.svg";
import IconAlbum from "../../assets/ic_album.svg";
import { Avatar } from "react-native-elements";
import Post from "./components/Post";
import { Api } from "../api/Api";
import AuthContext from "../components/context/AuthContext";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  FlatList,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from "react-native";
import { useKeyboard } from "./components/useKeyboard";
import AppContext from "../components/context/AppContext";
import IconBack from "../../assets/ic_nav_header_back.svg";
import IconBackBlack from "../../assets/ic_nav_header_back_black.svg";
import IconOption from "../../assets/button_option_menu.svg";
import IconOptionBlack from "../../assets/button_option_menu_black.svg";
import IconEdit from "../../assets/ic_profile_edit_bio.svg";
import { Avatar as Avatar2 } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import IconImageSolid from "../../assets/ic_photo_solidhollow_24.svg";
import IconVideoSolid from "../../assets/ic_video_solid_24_white.svg";

const BaseURL = "http://13.76.46.159:8000/files/";
const FULL_WIDTH = Dimensions.get("window").width;

export default function ProfileScreen({ navigation }) {
  const [needReload, setNeedReload] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const context = React.useContext(AuthContext);
  const appContext = useContext(AppContext);
  const getAvatar = async () => {
    try {
      accessToken = "lol " + context.loginState.accessToken;
      let user = await Api.getMe(accessToken);
      //console.log(user.data)
      appContext.setAvatar(user.data.data.avatar.fileName);
      appContext.setCoverImage(user.data.data.cover_image.fileName);
    } catch (e) {
      console.log(e);
    }
  };
  const getPosts = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      accessToken = context.loginState.accessToken;
      accessToken = "lol " + accessToken;
      // console.log(accessToken)
      const res = await Api.getPostsById(
        accessToken,
        context.loginState.userId
      );
      let postList = res.data.data;

      setPosts(postList.reverse());

      if (firstLoad) {
        setFirstLoad(false);
      }
      if (needReload) {
        setNeedReload(false);
      }
      setIsLoading(false);
      if (!firstLoad) {
        closeLoading();
      }
      // console.log(postList)
    } catch (err) {
      if (err.response && err.response.status == 401) {
        console.log(err.response.data.message);
        // setNotification("Không thể nhận diện");
        // console.log(notification)
        setIsLoading(false);
        return;
      }
      console.log(err);
      navigation.navigate("NoConnectionScreen", {
        message: "Lỗi kết nối, sẽ tự động thử lại khi có internet",
      });
    }
  };

  let opacity = useRef(new Animated.Value(0));

  let openLoading = () => {
    opacity.current.setValue(100);
  };

  let closeLoading = () => {
    opacity.current.setValue(100);
    Animated.timing(opacity.current, {
      toValue: 0,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  if (needReload && !isLoading) {
    getAvatar();
    getPosts();
  }

  var handleScrollDrag = function (event) {
    if (event.nativeEvent.contentOffset.y < -80 && !needReload) {
      openLoading();
      setNeedReload(true);
    }
  };

  var NotiHeader = () => {
    if (needReload && firstLoad) {
      return (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.describeText}>
            Đang tải dữ liệu, chờ chút thôi ...
          </Text>
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

    return <></>;
  };

  const keyBoardHeight = useKeyboard();
  const inputRef = useRef();
  const mode = useRef("image");
  var LoadingHeader = () => {
    return (
      <Animated.View style={{ height: opacity.current }}>
        <Image
          source={require("../../assets/loading.gif")}
          style={{ alignSelf: "center", marginTop: 10 }}
        />
        <Text style={styles.describeText}>
          Đang tải dữ liệu, chờ chút thôi ...
        </Text>
      </Animated.View>
    );
  };

  var ListHeader = () => {
    return (
      <>
        {LoadingHeader()}
        <View style={{ position: "relative" }}>
          <Image
            style={{ width: FULL_WIDTH, height: 200 }}
            source={{ uri: BaseURL + appContext.coverImage }}
          ></Image>
          <View style={{ alignItems: "center", backgroundColor: "#fff" }}>
            <Text style={{ fontSize: 26, fontWeight: "500", marginTop: 50 }}>
              {context.loginState.userName}
            </Text>
            <Pressable style={{ marginTop: 4 }}>
              {appContext.decription ? (
                <Text style={{ fontSize: 16, color: "#767676" }}>
                  {appContext.decription}
                </Text>
              ) : (
                <View style={{ alignItems: "center", flexDirection: "row" }}>
                  <IconEdit />
                  <Text
                    style={{ color: "#1e96f2", fontSize: 16, marginLeft: 2 }}
                  >
                    Thêm lời giới thiệu của bạn
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
          <View style={{ position: "absolute", alignSelf: "center", top: 120 }}>
            <Avatar2
              size={"2xl"}
              source={{ uri: BaseURL + appContext.avatar }}
              style={{ borderWidth: 2, borderColor: "#fff" }}
            ></Avatar2>
          </View>
        </View>
        <ScrollView
          horizontal={true}
          style={{
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: "#fff",
          }}
        >
          <LinearGradient
            colors={["#469065", "#90b97b", "#e6f2c2"]}
            start={[0, 1]}
            end={[1, 0]}
            style={{ height: 100, width: 200, borderRadius: 10 }}
          >
            <View
              style={{
                marginTop: 12,
                marginLeft: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <IconImageSolid />
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: 16,
                  marginLeft: 2,
                }}
              >
                Ảnh của tôi
              </Text>
            </View>
            <Text style={{ marginLeft: 15, color: "#fff", marginTop: 5 }}>
              Xem tất cả ảnh và
            </Text>
            <Text style={{ marginLeft: 15, color: "#fff" }}>video đã đăng</Text>
          </LinearGradient>
          <LinearGradient
            colors={["#e16779", "#d88d92", "#c6abac"]}
            end={[1, 0]}
            style={{
              height: 100,
              width: 200,
              borderRadius: 10,
              marginLeft: 10,
            }}
          >
            <View
              style={{
                marginTop: 12,
                marginLeft: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <IconVideoSolid />
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: 16,
                  marginLeft: 2,
                }}
              >
                Video của tôi
              </Text>
            </View>
            <Text style={{ marginLeft: 15, color: "#fff", marginTop: 5 }}>
              Xem tất cả video đã đăng
            </Text>
          </LinearGradient>
        </ScrollView>
        <View style={styles.createPostArea}>
          <View style={styles.avatar}>
            <Avatar
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

  const offset = useRef(new Animated.Value(0)).current;
  const opacityOnScroll = offset.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  opacityOnScroll.addListener((e) => {
    if (e.value == 1 && iconColor == "white") setIconColor("black");
    if (e.value < 1 && iconColor == "black") setIconColor("white");
  });

  const [iconColor, setIconColor] = useState("white");

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#00000000"
        barStyle={iconColor=="white"?"light-content":"dark-content"}
        translucent={true}
      />
      <Animated.View
        style={{
          position: "absolute",
          height: 70,
          backgroundColor: "#fff",
          top: 0,
          width: FULL_WIDTH,
          opacity: opacityOnScroll,
          zIndex: 2,
          flexDirection: "row",
        }}
      >
        <View style={{ marginTop: 25, marginLeft: 60 }}>
          <Avatar2
            source={{ uri: BaseURL + appContext.avatar }}
            size="sm"
          ></Avatar2>
        </View>

        <Text
          style={{
            marginTop: 28,
            marginLeft: 10,
            fontWeight: "500",
            fontSize: 20,
          }}
        >
          {context.loginState.userName}
        </Text>
      </Animated.View>
      <TouchableOpacity
        style={{ position: "absolute", top: 30, left: 10, zIndex: 2 }}
        onPress={() => navigation.goBack()}
      >
        {iconColor == "white" ? <IconBack /> : <IconBackBlack />}
      </TouchableOpacity>
      <TouchableOpacity
        style={{ position: "absolute", top: 25, right: 10, zIndex: 2 }}
      >
        {iconColor == "white" ? <IconOption /> : <IconOptionBlack />}
      </TouchableOpacity>
      <FlatList
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: offset } } }],
          { useNativeDriver: false }
        )}
        keyboardShouldPersistTaps={"always"}
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={<ListHeader />}
        renderItem={({ item }) => (
          <View style={{ marginTop: 12 }}>
            <Post
              mode={"timeline"}
              updateFunc={getPosts}
              post={item}
              navigation={navigation}
            />
          </View>
        )}
        style={{ flex: 1 }}
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
