import React, { useContext, useEffect, useRef, useState } from "react";
import { Avatar, Divider } from "react-native-elements";
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
  RefreshControl,
  ActivityIndicator,
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
import {
  AvatarNativeBaseCache,
  ImageReactElementCache,
} from "./components/ImageCache";
import { useIsFocused } from "@react-navigation/native";
import { BaseURL } from "../utils/Constants";
import AppContext from "../components/context/AppContext";
import ChatContext from "../components/context/ChatContext";
const FULL_WIDTH = Dimensions.get("window").width;

const ListHeader = ({
  id,
  info,
  navigation,
  isLoading,
  firstLoad,
  friendStatus,
  setFriendStatus,
  posts,
  setIsViewCoverImage,
  setIsViewAvatarImage,
}) => {
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
    if (posts.length == 0) {
      return (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.describeText}>Người này chưa đăng bài nào</Text>
        </View>
      );
    }
    return <></>;
  };

  const authContext = useContext(AuthContext);

  const requestFriend = async () => {
    try {
      accessToken = authContext.loginState.accessToken;
      const res = await Api.sendFriendRequest(accessToken, id);
      if (res.status == 200) {
        setFriendStatus(res.data.newStatus);
      }
    } catch (err) {
      if (err.response && err.response.status == 401) {
        console.log(err.response.data.message);
        return;
      }
      console.log(err);
      navigation.navigate("NoConnectionScreen", {
        message: "Lỗi kết nối, sẽ tự động thử lại khi có internet",
      });
    }
  };

  const cancelFriendRequest = async () => {
    try {
      accessToken = authContext.loginState.accessToken;

      const res = await Api.sendCancelFriendRequest(accessToken, id);
      if (res.status == 200) {
        setFriendStatus(res.data.newStatus);
      }
    } catch (err) {
      if (err.response && err.response.status == 401) {
        console.log(err.response.data.message);
        return;
      }
      console.log(err);
      navigation.navigate("NoConnectionScreen", {
        message: "Lỗi kết nối, sẽ tự động thử lại khi có internet",
      });
    }
  };

  const chatContext = useContext(ChatContext);

  const goToChat = () => {
    chatContext.setCurFriendId(id);
    chatContext.setInChat(true);
    chatContext.setNeedUpdateListChat(true);
    let friend = {
      username: info.userName,
      avatar: info.avatar,
      id: id,
      phonenumber: info.phonenumber,
    };
    navigation.navigate("ConversationScreen", {
      from: "ContactScreen",
      friend: friend,
      isread: false,
    });
  };

  return (
    <>
      <View style={{ position: "relative" }}>
        <ImageReactElementCache
          style={{ width: FULL_WIDTH, height: 200 }}
          source={{ uri: BaseURL + info.coverImage }}
          onPress={() => setIsViewCoverImage(true)}
        />
        <View
          style={{
            alignItems: "center",
            paddingBottom: 10,
            backgroundColor: friendStatus == "friend" ? "#fff" : "#f0f0f0",
          }}
        >
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
          style={{ position: "absolute", alignSelf: "center", top: 120 }}
          onPress={() => setIsViewAvatarImage(true)}
        >
          <AvatarNativeBaseCache
            size={"2xl"}
            source={{ uri: BaseURL + info.avatar }}
            style={{ borderWidth: 2, borderColor: "#fff" }}
          />
        </Pressable>
      </View>
      {friendStatus == "friend" && (
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
      )}

      {friendStatus == "not friend" && (
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
              onPress={() => {
                goToChat();
              }}
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
              onPress={() => {
                requestFriend();
              }}
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
      )}

      {friendStatus == "sent" && (
        <View
          style={{
            backgroundColor: "#fff",
            paddingTop: 10,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 15 }}>
            Lời mời kết bạn đã được gửi đi. Hãy để lại tin nhắn cho{" "}
            {info.userName} trong lúc chờ đợi nhé!
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
              onPress={() => {
                goToChat();
              }}
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
              onPress={() => {
                cancelFriendRequest();
              }}
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
                    Hủy kết bạn
                  </Text>
                </View>
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </View>
      )}

{friendStatus == "received+" && (
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
              onPress={() => {
                goToChat();
              }}
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
              onPress={() => {
                requestFriend();
              }}
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
      )}
      <NotiHeader />
    </>
  );
};

export default function ViewProfileScreen({ navigation, route }) {
  const mounted = useRef(true);
  const [loaded, setLoaded] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [friendStatus, setFriendStatus] = useState("not friend");
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [info, setInfo] = useState({
    avatar: "avatar_2.png",
    coverImage: "defaul_cover_image.jpg",
    userName: "",
    description: "",
    phonenumber: "",
  });

  const authContext = React.useContext(AuthContext);

  const getInfo = async () => {
    try {
      const token = authContext.loginState.accessToken;
      let res = await Api.getUser(token, route.params.userId);
      if (!mounted.current) return;
      let data = res.data.data;
      setInfo({
        avatar: data.avatar.fileName,
        coverImage: data.cover_image.fileName,
        userName: data.username,
        description: data.description,
        phonenumber: data.phonenumber,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getFriendStatus = async () => {
    try {
      const token = authContext.loginState.accessToken;
      let res = await Api.getFriendStatus(token, route.params.userId);
      if (!mounted.current) return;
      setFriendStatus(res.data.data.status);
    } catch (e) {
      console.log(e);
    }
  };

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const accessToken = authContext.loginState.accessToken;
      const res = await Api.getPostsById(accessToken, route.params.userId);
      if (!mounted.current) return;
      console.log(res.data);
      let postList = res.data.data;
      setPosts(postList.reverse());
      setIsLoading(false);
      if (appContext.needUpdateViewProfileScreen) {
        appContext.setNeedUpdateViewProfileScreen(false);
      }
      if (firstLoad) {
        setFirstLoad(false);
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

  useEffect(() => {
    const load = async () => {
      await Promise.all(getInfo(), getPosts(), getFriendStatus());
      setLoaded(true);
    };
    load();
    return () => {
      mounted.current = false;
    };
  }, []);

  const refreshPosts = async () => {
    setRefreshing(true);
    await Promise.all([getPosts(), getInfo(), getFriendStatus()]);
    setRefreshing(false);
  };

  const appContext = useContext(AppContext);

  const isFocused = useIsFocused();
  if (isFocused && appContext.needUpdateViewProfileScreen && !isLoading) {
    setIsLoading(true);
    refreshPosts();
  }

  const [isViewCoverImage, setIsViewCoverImage] = useState(false);
  const [isViewAvatarImage, setIsViewAvatarImage] = useState(false);
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

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

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
          <AvatarNativeBaseCache
            key={info.avatar}
            source={{ uri: BaseURL + info.avatar }}
            size="sm"
          />
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
      <ImageView
        images={[{ uri: BaseURL + info.avatar }]}
        imageIndex={0}
        visible={isViewAvatarImage}
        onRequestClose={() => {
          setIsViewAvatarImage(false);
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
        ListHeaderComponent={() => (
          <ListHeader
            id={route.params.userId}
            info={info}
            navigation={navigation}
            friendStatus={friendStatus}
            setFriendStatus={setFriendStatus}
            isLoading={isLoading}
            firstLoad={firstLoad}
            posts={posts}
            setIsViewCoverImage={setIsViewCoverImage}
            setIsViewAvatarImage={setIsViewAvatarImage}
          />
        )}
        renderItem={({ item }) => (
          <View style={{ marginTop: 12 }}>
            <Post
              mode={"timeline"}
              post={item}
              navigation={navigation}
              from="viewuser"
            />
          </View>
        )}
        style={{ flex: 1 }}
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
