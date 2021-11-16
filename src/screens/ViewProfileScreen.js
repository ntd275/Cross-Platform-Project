import React, { useContext, useRef, useState } from "react";
import { Avatar, Image as Image2, Divider } from "react-native-elements";
import Post from "./components/Post";
import { Api } from "../api/Api";
import AuthContext from "../components/context/AuthContext";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  FlatList,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Alert,
  TouchableHighlight,
} from "react-native";
import IconBack from "../../assets/ic_nav_header_back.svg";
import IconBackBlack from "../../assets/ic_nav_header_back_black.svg";
import IconOption from "../../assets/button_option_menu.svg";
import IconOptionBlack from "../../assets/button_option_menu_black.svg";
import { Avatar as Avatar2 } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import IconImageSolid from "../../assets/ic_photo_solidhollow_24.svg";
import IconVideoSolid from "../../assets/ic_video_solid_24_white.svg";
import ImageView from "react-native-image-viewing";

const BaseURL = "http://13.76.46.159:8000/files/";
const FULL_WIDTH = Dimensions.get("window").width;

export default function ViewProfileScreen({ navigation, route }) {
  const [needReload, setNeedReload] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const [info, setInfo] = useState({
    avatar: "avatar_2.png",
    coverImage: "defaul_cover_image.jpg",
    userName: "",
    description: "",
  });

  const [isFriend, setIsFriend] = useState(false);

  const context = React.useContext(AuthContext);
  const getAvatar = async () => {
    try {
      const accessToken = "lol " + context.loginState.accessToken;
      let user = await Api.getUser(accessToken, route.params.userId);
      console.log(user.data);
      setInfo({
        avatar: user.data.data.avatar.fileName,
        coverImage: user.data.data.cover_image.fileName,
        userName: user.data.data.username,
        description: user.data.data.description,
      });
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
      const res = await Api.getPostsById(accessToken, route.params.userId);
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

  let opacity = useRef(new Animated.Value(0));

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

  const [isViewCoverImage, setIsViewCoverImage] = useState(false);

  var ListHeader = () => {
    return (
      <>
        {LoadingHeader()}
        <View style={{ position: "relative" }}>
          <Image2
            style={{ width: FULL_WIDTH, height: 200 }}
            source={{ uri: BaseURL + info.coverImage }}
            onPress={() => {}}
          ></Image2>
          <View style={{ alignItems: "center", paddingBottom: 10, backgroundColor: isFriend?"#fff":'#f0f0f0' }}>
            <Text style={{ fontSize: 26, fontWeight: "500", paddingTop: 50 }}>
              {info.userName}
            </Text>
            <View style={{ marginTop: 4 }}>
              {info.decription && (
                <Text style={{ fontSize: 16, color: "#767676" }}>
                  {info.decription}
                </Text>
              )}
            </View>
          </View>
          <Pressable
            onPress={() => {}}
            style={{ position: "absolute", alignSelf: "center", top: 120 }}
          >
            <Avatar2
              size={"2xl"}
              source={{ uri: BaseURL + info.avatar }}
              style={{ borderWidth: 2, borderColor: "#fff" }}
            ></Avatar2>
          </Pressable>
        </View>
        {isFriend ? 
        <ScrollView
          horizontal={true}
          style={{
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: "#fff",
          }}
          showsHorizontalScrollIndicator={false}
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
                Ảnh
              </Text>
            </View>
            <Text style={{ marginLeft: 15, color: "#fff", marginTop: 5 }}>
              Xem lại ảnh và video
            </Text>
          </LinearGradient>
          <LinearGradient
            colors={["#e16779", "#d88d92", "#c6abac"]}
            end={[1, 0]}
            style={{
              height: 100,
              width: 200,
              borderRadius: 10,
              marginLeft: 10,
              marginRight: 15,
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
                Video
              </Text>
            </View>
            <Text style={{ marginLeft: 15, color: "#fff", marginTop: 5 }}>
              Xem tất cả video đã đăng
            </Text>
          </LinearGradient>
        </ScrollView>
        :
        <View
          style={{
            backgroundColor: "#fff",
            paddingTop: 10,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 15 }}>
            Kết bạn với {info.userName} ngay để cùng tạo nên những cuộc trò
            chuyện thú vị và đáng nhớ
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              paddingTop: 10,
              paddingBottom: 12,
            }}
          >
            <TouchableHighlight
              style={{
                width: "30%",
                marginTop: "auto",
                alignSelf: "center",
                borderRadius: 15,
                marginRight: 10,
              }}
              activeOpacity={0.8}
              underlayColor="#3f3f3f"
              onPress={()=>{}}
            >
              <LinearGradient
                colors={["#b5d2ec55", "#b5d2ec55"]}
                start={[0, 1]}
                end={[1, 0]}
                style={{
                  width: "100%",
                  height: 30,
                  alignSelf: "center",
                  borderRadius: 15,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Text style={{ color: "#0085ff", fontWeight: "500" }}>
                    Nhắn tin
                  </Text>
                </View>
              </LinearGradient>
            </TouchableHighlight>
            <TouchableHighlight
              style={{
                width: "30%",
                marginTop: "auto",
                alignSelf: "center",
                borderRadius: 15,
                marginLeft: 10,
              }}
              activeOpacity={0.8}
              underlayColor="#3f3f3f"
              onPress={() => {}}
            >
              <LinearGradient
                colors={["#0085ff", "#05adff"]}
                start={[0, 1]}
                end={[1, 0]}
                style={{
                  width: "100%",
                  height: 30,
                  alignSelf: "center",
                  borderRadius: 15,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "500" }}>
                    Kết bạn
                  </Text>
                </View>
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </View>
        }
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
        barStyle={iconColor == "white" ? "light-content" : "dark-content"}
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
          borderBottomColor: "#cdcdcd",
          borderBottomWidth: 1,
        }}
      >
        <View style={{ marginTop: 25, marginLeft: 60 }}>
          <Avatar2 source={{ uri: BaseURL + info.avatar }} size="sm"></Avatar2>
        </View>

        <Text
          style={{
            marginTop: 28,
            marginLeft: 10,
            fontWeight: "500",
            fontSize: 20,
          }}
        >
          {info.userName}
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
      <ImageView
        images={[{ uri: BaseURL + info.coverImage }]}
        imageIndex={0}
        visible={isViewCoverImage}
        onRequestClose={() => {
          setIsViewCoverImage(false);
        }}
        swipeToCloseEnabled={true}
      />
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
  reportOption: {
    alignItems: "center",
    justifyContent: "center",
    height: 55,
  },
  reportOptionText: {
    color: "#0085ff",
    fontSize: 20,
    fontWeight: "400",
  },
});
