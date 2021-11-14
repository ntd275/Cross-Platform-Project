import React, { useContext, useRef, useState } from "react";
import IconImage from "../../assets/ic_photo_grd.svg";
import IconVideo from "../../assets/ic_video_solid_24.svg";
import IconAlbum from "../../assets/ic_album.svg";
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
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  FlatList,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Alert,
} from "react-native";
import { useKeyboard } from "./components/useKeyboard";
import AppContext from "../components/context/AppContext";
import IconBack from "../../assets/ic_nav_header_back.svg";
import IconBackBlack from "../../assets/ic_nav_header_back_black.svg";
import IconOption from "../../assets/button_option_menu.svg";
import IconOptionBlack from "../../assets/button_option_menu_black.svg";
import IconEdit from "../../assets/ic_profile_edit_bio.svg";
import { Avatar as Avatar2, Actionsheet, Box } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import IconImageSolid from "../../assets/ic_photo_solidhollow_24.svg";
import IconVideoSolid from "../../assets/ic_video_solid_24_white.svg";
import RBSheet from "react-native-raw-bottom-sheet";
import ImageView from "react-native-image-viewing";
import * as ImagePicker from "expo-image-picker";

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
      const accessToken = "lol " + context.loginState.accessToken;
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

  const refCoverImageOption = useRef();
  const [isViewCoverImage, setIsViewCoverImage] = useState(false);

  var ListHeader = () => {
    return (
      <>
        {LoadingHeader()}
        <View style={{ position: "relative" }}>
          <Image2
            style={{ width: FULL_WIDTH, height: 200 }}
            source={{ uri: BaseURL + appContext.coverImage }}
            onPress={() => refCoverImageOption.current.open()}
          ></Image2>
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
          <Pressable onPress={()=> refAvatarImageOption.current.open()} style={{ position: "absolute", alignSelf: "center", top: 120 }}>
            <Avatar2
              size={"2xl"}
              source={{ uri: BaseURL + appContext.avatar }}
              style={{ borderWidth: 2, borderColor: "#fff" }}
            ></Avatar2>
          </Pressable>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator= {false}
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
  const refCallBack = useRef(() => {});

  const changeCoverPicture = async (mode) => {
    let result;
    if (mode == "camera") {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        base64: true,
        allowsEditing: true,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: true,
        allowsEditing: true,
      });
    }
    refCoverImageOption.current.close();
    if (!result.cancelled) {
      try {
        let res = await Api.editUser("lol " + context.loginState.accessToken, {
          cover_image: "data:image;base64," + result.base64,
        });
        console.log(res.data.data.cover_image.fileName)
        appContext.setCoverImage(res.data.data.cover_image.fileName)
        Alert.alert("Thành công", "Đã thay đổi ảnh bìa", [{ text: "OK" }]);
        
      } catch (e) {
        console.log(e);
      }
    }
  };

  const refAvatarImageOption = useRef();

  const changeAvatarPicture = async (mode) => {
    let result;
    if (mode == "camera") {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
        base64: true,
        allowsEditing: true,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: true,
        allowsEditing: true,
      });
    }
    refAvatarImageOption.current.close();
    if (!result.cancelled) {
      try {
        let res = await Api.editUser("lol " + context.loginState.accessToken, {
            avatar: "data:image;base64," + result.base64,
        })
        await getPosts()
        console.log(res.data.data.avatar.fileName)
        appContext.setAvatar(res.data.data.avatar.fileName)
        Alert.alert("Thành công", "Đã thay đổi ảnh đại diện", [{ text: "OK" }]);
      } catch (e) {
        console.log(e);
      }
    }
  };

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
        onPress={() => navigation.navigate('ViewProfileScreen',{userId: '60c45025ae8c0f00220f4616'})}
      >
        {iconColor == "white" ? <IconOption /> : <IconOptionBlack />}
      </TouchableOpacity>
      <RBSheet
        ref={refCoverImageOption}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        animationType="fade"
        height={320}
        closeDuration={0}
        onClose={() => refCallBack.current()}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.28)",
            width: "100%",
          },
          container: {
            marginBottom: 10,
            width: "95%",
            alignSelf: "center",
            backgroundColor: "rgba(255,255,255,0)",
          },
          draggableIcon: {
            opacity: 0,
          },
        }}
      >
        <View
          style={{
            justifyContent: "center",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(240,240,240,1)",
              borderTopLeftRadius: 15,
              borderTopEndRadius: 15,
              borderBottomRightRadius: 15,
              borderBottomStartRadius: 15,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: "#767676",
                textAlign: "center",
                marginTop: 15,
                marginBottom: 10,
              }}
            >
              Ảnh bìa
            </Text>
            <Divider orientation="horizontal" />
            <TouchableHighlight
              style={styles.reportOption}
              onPress={() => {
                refCallBack.current = () => {
                  setIsViewCoverImage(true);
                };
                refCoverImageOption.current.close();
              }}
              activeOpacity={0.99}
              underlayColor="#989898"
            >
              <Text style={styles.reportOptionText}>Xem ảnh bìa</Text>
            </TouchableHighlight>
            <Divider orientation="horizontal" />
            <TouchableHighlight
              style={styles.reportOption}
              onPress={() => {
                changeCoverPicture("camera");
              }}
              activeOpacity={0.99}
              underlayColor="#989898"
            >
              <Text style={styles.reportOptionText}>Chụp ảnh mới</Text>
            </TouchableHighlight>
            <Divider orientation="horizontal" />
            <TouchableHighlight
              style={styles.reportOption}
              onPress={() => {
                changeCoverPicture("library");
              }}
              activeOpacity={0.99}
              underlayColor="#989898"
            >
              <Text style={styles.reportOptionText}>Chọn ảnh từ thư viện</Text>
            </TouchableHighlight>
          </View>
          <TouchableHighlight
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 15,
              borderTopEndRadius: 15,
              borderBottomRightRadius: 15,
              borderBottomStartRadius: 15,
              justifyContent: "center",
              alignItems: "center",
              height: 60,
              marginTop: 10,
              marginBottom: 10,
            }}
            onPress={() => refCoverImageOption.current.close()}
            activeOpacity={0.999}
            underlayColor="#989898"
          >
            <Text style={{ color: "#0085ff", fontWeight: "600", fontSize: 19 }}>
              Hủy
            </Text>
          </TouchableHighlight>
        </View>
      </RBSheet>
      <ImageView
        images={[{ uri: BaseURL + appContext.coverImage }]}
        imageIndex={0}
        visible={isViewCoverImage}
        onRequestClose={() => {
          refCallBack.current = () => {};
          setIsViewCoverImage(false);
        }}
        swipeToCloseEnabled={true}
      />
        <RBSheet
        ref={refAvatarImageOption}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        animationType="fade"
        height={280}
        closeDuration={0}
        onClose={() => refCallBack.current()}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.28)",
            width: "100%",
          },
          container: {
            marginBottom: 10,
            width: "95%",
            alignSelf: "center",
            backgroundColor: "rgba(255,255,255,0)",
          },
          draggableIcon: {
            opacity: 0,
          },
        }}
      >
        <View
          style={{
            justifyContent: "center",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(240,240,240,1)",
              borderTopLeftRadius: 15,
              borderTopEndRadius: 15,
              borderBottomRightRadius: 15,
              borderBottomStartRadius: 15,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: "#767676",
                textAlign: "center",
                marginTop: 15,
                marginBottom: 10,
              }}
            >
              Ảnh đại diện
            </Text>
            <Divider orientation="horizontal" />
            <TouchableHighlight
              style={styles.reportOption}
              onPress={() => {
                changeAvatarPicture("camera");
              }}
              activeOpacity={0.99}
              underlayColor="#989898"
            >
              <Text style={styles.reportOptionText}>Chụp ảnh mới</Text>
            </TouchableHighlight>
            <Divider orientation="horizontal" />
            <TouchableHighlight
              style={styles.reportOption}
              onPress={() => {
                changeAvatarPicture("library");
              }}
              activeOpacity={0.99}
              underlayColor="#989898"
            >
              <Text style={styles.reportOptionText}>Chọn ảnh từ thư viện</Text>
            </TouchableHighlight>
          </View>
          <TouchableHighlight
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 15,
              borderTopEndRadius: 15,
              borderBottomRightRadius: 15,
              borderBottomStartRadius: 15,
              justifyContent: "center",
              alignItems: "center",
              height: 60,
              marginTop: 10,
              marginBottom: 10,
            }}
            onPress={() => refAvatarImageOption.current.close()}
            activeOpacity={0.999}
            underlayColor="#989898"
          >
            <Text style={{ color: "#0085ff", fontWeight: "600", fontSize: 19 }}>
              Hủy
            </Text>
          </TouchableHighlight>
        </View>
      </RBSheet>
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
