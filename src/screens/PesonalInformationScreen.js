import React, { useContext, useEffect, useRef, useState } from "react";
import { Avatar, Image as Image2, Divider } from "react-native-elements";
import { Api } from "../api/Api";
import AuthContext from "../components/context/AuthContext";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Alert,
} from "react-native";
import AppContext from "../components/context/AppContext";
import IconBack from "../../assets/ic_nav_header_back.svg";
import IconBackBlack from "../../assets/ic_nav_header_back_black.svg";
import { Avatar as Avatar2, Actionsheet, Box } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import RBSheet from "react-native-raw-bottom-sheet";
import ImageView from "react-native-image-viewing";
import * as ImagePicker from "expo-image-picker";

const BaseURL = "http://13.76.46.159:8000/files/";
const FULL_WIDTH = Dimensions.get("window").width;

export default function PersonalInformationScreen({ navigation }) {
  const context = React.useContext(AuthContext);
  const appContext = useContext(AppContext);
  const getAvatar = async () => {
    try {
      const accessToken = context.loginState.accessToken;
      let user = await Api.getMe(accessToken);
      //console.log(user.data)
      appContext.setAvatar(user.data.data.avatar.fileName);
      appContext.setCoverImage(user.data.data.cover_image.fileName);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAvatar();
  }, []);

  const [isViewCoverImage, setIsViewCoverImage] = useState(false);

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
        console.log(res.data.data.cover_image.fileName);
        appContext.setCoverImage(res.data.data.cover_image.fileName);
        Alert.alert("Thành công", "Đã thay đổi ảnh bìa", [{ text: "OK" }]);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const refCoverImageOption = useRef();
  const refAvatarImageOption = useRef();
  const refCallBack = useRef(() => {});

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
        });
        await getPosts();
        console.log(res.data.data.avatar.fileName);
        appContext.setAvatar(res.data.data.avatar.fileName);
        Alert.alert("Thành công", "Đã thay đổi ảnh đại diện", [{ text: "OK" }]);
      } catch (e) {
        console.log(e);
      }
    }
  };

  let gender = "Chưa có";
  if(appContext.gender == "male"){
    gender = "Nam"
  }

  if(appContext.gender == "female"){
    gender = "Nữ"
  }

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#00000000"
        barStyle={"light-content"}
        translucent={true}
      />
      <Image2
        style={{ width: FULL_WIDTH, height: 280 }}
        source={{ uri: BaseURL + appContext.coverImage }}
        onPress={() => refCoverImageOption.current.open()}
      ></Image2>
      <TouchableOpacity
        style={{ position: "absolute", top: 30, left: 10, zIndex: 2 }}
        onPress={() => navigation.goBack()}
      >
        <IconBack />
      </TouchableOpacity>
      <Pressable
        onPress={() => refAvatarImageOption.current.open()}
        style={{ position: "absolute", left: 10, top: 190 }}
      >
        <Avatar2
          size={"20"}
          source={{ uri: BaseURL + appContext.avatar }}
          style={{ borderWidth: 2, borderColor: "#fff" }}
        ></Avatar2>
      </Pressable>

      <View style={{ position:'absolute', top: 215, left: 100 }}>
        <Text style={{ fontSize: 24, fontWeight: "500", color: '#fff' }}>
          {appContext.userName}
        </Text>
        <View style={{ marginTop: 4 }}>
          {appContext.decription && (
            <Text style={{ fontSize: 16, color: "#fff" }}>
              {appContext.decription}
            </Text>
          )}
        </View>
      </View>

      <View style={{paddingLeft: 12, backgroundColor:'#fff', paddingRight: 12}}>
          <View style={styles.info}>
                <View style={styles.infoTitle}>
                    <Text style={{fontSize:15}}>Giới tính</Text>
                </View>
                <View style={{flex:1}}>
                    <Text style={{color:'#898989',fontSize: 15}}>{gender}</Text>
                </View>
          </View>
          <Divider/>
          <View style={styles.info}>
                <View style={styles.infoTitle}>
                    <Text style={{fontSize:15}}>Ngày sinh</Text>
                </View>
                <View style={{flex:1}}>
                    <Text style={{color:'#898989',fontSize: 15}}>{appContext.birthday ? new Date(appContext.birthday).toLocaleDateString() : "Chưa có"}</Text>
                </View>
          </View>
          <Divider/>
          <View style={styles.info}>
                <View style={styles.infoTitle}>
                    <Text style={{fontSize:15}}>Điện thoại</Text>
                </View>
                <View style={{flex:1}}>
                    <Text style={{color:'#009aff', fontSize:15}}>{appContext.phonenumber}</Text>
                    <Text style={{color:'#898989',fontSize: 15, marginTop: 7}}>Số điện thoại của bạn chỉ hiện thị với bạn bè có số của bạn trong danh bạ</Text>
                </View>
          </View>
      </View>
      <TouchableHighlight
              style={{
                width: "90%",
                marginTop: 10,
                alignSelf: "center",
                borderRadius: 20,
              }}
              activeOpacity={0.8}
              underlayColor="#3f3f3f"
              onPress={() => {navigation.navigate("ProfileEditScreen")}}
            >
              <LinearGradient
                colors={["#0085ff", "#05adff"]}
                start={[0, 1]}
                end={[1, 0]}
                style={{
                  width: "100%",
                  height: 40,
                  alignSelf: "center",
                  borderRadius: 20,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "500", fontSize: 15 }}>
                    Đổi thông tin
                  </Text>
                </View>
              </LinearGradient>
            </TouchableHighlight>

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
  info: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
  },
  infoTitle: {
    width: 120,
  }
});
