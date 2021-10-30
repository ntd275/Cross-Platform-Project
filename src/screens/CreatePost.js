import React, { useRef, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import { Image } from "react-native-elements";
import IconHeaderClose from "../../assets/icn_header_close.svg";
import IconFriend from "../../assets/ic_friend.svg";
import IconSendDiable from "../../assets/icn_send_disable.svg";
import IconSend from "../../assets/icn_send.svg";
import IconSticker from "../../assets/icn_csc_menu_sticker_n.svg";
import IconPhoto from "../../assets/ic_photo_n.svg";
import IconVideo from "../../assets/icn_video.svg";
import ImageSelect from "./components/ImageSelect";
import AppContext from "../components/context/AppContext";
import AuthContext from "../components/context/AuthContext";
import useKeyboardHeight from "react-native-use-keyboard-height";
import IconCloseCircle from "../../assets/ic_close_circle.svg";
import VideoSelect from "./components/VideoSelect";
import { Video } from "expo-av";
import IconPhotoActive from "../../assets/ic_photo_active.svg";
import IconVideoActive from "../../assets/icn_video_active.svg";
import * as FileSystem from "expo-file-system";
import { Api } from "../api/Api";
import * as MediaLibrary from "expo-media-library";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const MAX_VIDEO_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_DURATION = 10;
const MIN_VIDEO_DURATION = 1;
export default function CreatePost({ navigation }) {
  const refInput = useRef();

  const [postText, setPostText] = useState("");
  const [isSent, setIsSent] = useState(false);

  const checkCanSend = () => {
    return postText !== "" || selectedVideo != null || selectedImage.length > 0;
  };

  const onChangeText = (text) => {
    setPostText(text);
  };

  const authContext = useContext(AuthContext);

  const requestSend = async () => {
    if (!isSent) {
      setIsSent(true);
      if (postText.length > 500) {
        Alert.alert(
          "Bài viết quá dài",
          "Chỉ cho phép bài viết tối đa 500 ký tự",
          [{ text: "OK" }]
        );
        return;
      }
      let images = [];
      for (let i = 0; i < selectedImage.length; i++) {
        let info = await MediaLibrary.getAssetInfoAsync(selectedImage[i]);
        let fileInfo = await FileSystem.getInfoAsync(info.localUri);
        if (fileInfo.size > MAX_IMAGE_SIZE) {
          Alert.alert("Ảnh quá lớn", "Chỉ cho phép ảnh kích thước tối đa 4MB", [
            { text: "OK" },
          ]);
          return;
        }
        let base64 = await FileSystem.readAsStringAsync(info.localUri, {
          encoding: "base64",
        });
        images.push("data:image;base64," + base64);
        console.log(base64.length / 1024 / 1024);
      }

      let videos = [];

      if (selectedVideo != null) {
        let info = await MediaLibrary.getAssetInfoAsync(selectedVideo);
        let fileInfo = await FileSystem.getInfoAsync(info.localUri);
        if (fileInfo.size > MAX_VIDEO_SIZE) {
          Alert.alert(
            "Video quá lớn",
            "Chỉ cho phép video kích thước tối đa 10MB",
            [{ text: "OK" }]
          );
          return;
        }
        if (info.duration > MAX_VIDEO_DURATION) {
          Alert.alert(
            "Video quá dài",
            "Chỉ cho phép video có độ dài tối đa 10s",
            [{ text: "OK" }]
          );
          return;
        }
        if (info.duration < MIN_VIDEO_DURATION) {
          Alert.alert("Video quá ngắn", "Video cần tối thiểu 1s", [
            { text: "OK" },
          ]);
          return;
        }

        let video = await FileSystem.readAsStringAsync(info.localUri, {
          encoding: "base64",
        });
        videos.push("data:video;base64," + video);
        console.log(videos[0].length);
      }

      const onSend = (progressEvent) => {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(percentCompleted);
      };

      Api.createPost(
        authContext.loginState.accessToken,
        postText,
        images,
        videos,
        onSend
      )
        .then((res) => {
          console.log(res.data);
          console.log(res.status);
          Alert.alert("Thành công", "Đã đăng bài xong", [{ text: "OK" }]);
          return;
        })
        .catch((e) => {
          console.log(e.response.status);
          console.log(e.response);
        });
      navigation.goBack();
    }
  };

  const exitScreen = () => {
    navigation.goBack();
  };

  const [openSelect, setOpenSelect] = useState("image");
  const [selectedImage, setSelectedImage] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [inputIsFocus, setInputIsFocus] = useState(false);

  const openPhoto = () => {
    refInput.current.blur();
    setOpenSelect("image");
  };

  const closePhoto = () => {
    setOpenSelect(null);
  };

  const canOpenPhoto = () => {
    if (selectedVideo != null) return false;
    return true;
  };

  const context = useContext(AppContext);
  const keyBoardHeight = useKeyboardHeight();

  const removeImage = (i) => {
    let images = Array.from(selectedImage);
    images.splice(i, 1);
    setSelectedImage(images);
  };

  const openVideo = () => {
    refInput.current.blur();
    setOpenSelect("video");
  };

  const closeVideo = () => {
    setOpenSelect(null);
  };

  const canOpenVideo = () => {
    if (selectedImage.length > 0) return false;
    return true;
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#00000000"
        barStyle="dark-content"
        translucent={true}
      />
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconClose} onPress={exitScreen}>
          <IconHeaderClose />
        </TouchableOpacity>
        <View style={styles.modeContainer}>
          <View style={styles.mode}>
            <IconFriend style={{ marginTop: 2 }} />
            <Text style={styles.textMode}>Tất cả bạn bè</Text>
          </View>
          <Text style={{ color: "#909090" }}>Xem bởi bạn bè trên Zalo</Text>
        </View>
        <TouchableOpacity
          style={styles.iconSendWrap}
          onPress={checkCanSend() ? requestSend : null}
        >
          {checkCanSend() ? <IconSend /> : <IconSendDiable />}
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.input}>
          <TextInput
            style={styles.textInput}
            placeholder="Bạn đang nghĩ gì?"
            placeholderTextColor="#929292"
            multiline={true}
            ref={refInput}
            onChangeText={(text) => onChangeText(text)}
            value={postText}
            onBlur={() => setInputIsFocus(false)}
            onFocus={() => setInputIsFocus(true)}
          ></TextInput>
          {selectedImage.length > 0 && (
            <View style={styles.imageContainer}>
              <View
                style={{
                  flex: selectedImage.length > 2 ? 2 : 1,
                  height: "100%",
                  marginRight: 1,
                  position: "relative",
                }}
              >
                <Image
                  source={selectedImage[0]}
                  style={{ height: "100%" }}
                  onPress={() => {}}
                />
                <TouchableOpacity
                  style={{ position: "absolute", top: 5, right: 5 }}
                  onPress={() => {
                    removeImage(0);
                  }}
                >
                  <IconCloseCircle />
                </TouchableOpacity>
              </View>
              {selectedImage.length > 1 && (
                <View style={{ flex: 1, marginLeft: 1 }}>
                  {selectedImage.slice(1).map((e, i) => {
                    return (
                      <View
                        key={i}
                        style={{
                          flex: 1,
                          marginTop: i != 0 ? 2 : 0,
                          position: "relative",
                        }}
                      >
                        <Image
                          source={selectedImage[i + 1]}
                          style={{ height: "100%", resizeMode: "cover" }}
                          onPress={() => {}}
                        />
                        <TouchableOpacity
                          style={{ position: "absolute", top: 5, right: 5 }}
                          onPress={() => {
                            removeImage(i);
                          }}
                        >
                          <IconCloseCircle />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}
          {selectedVideo && (
            <View style={styles.videoContainer}>
              <View
                style={{
                  flex: 1,
                  height: "100%",
                  marginRight: 1,
                  position: "relative",
                }}
              >
                <Video
                  style={{ height: "100%", width: "100%" }}
                  source={selectedVideo}
                  resizeMode="cover"
                  useNativeControls
                />
                <TouchableOpacity
                  style={{ position: "absolute", top: 5, right: 5 }}
                  onPress={() => {
                    setSelectedVideo(null);
                  }}
                >
                  <IconCloseCircle />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {selectedImage.length == 0 && selectedVideo == null && (
            <Pressable
              style={{
                height: openSelect
                  ? Dimensions.get("screen").height -
                    150 -
                    context.keyBoardHeight
                  : Dimensions.get("screen").height - 150 - keyBoardHeight,
              }}
              onPress={() => {
                refInput.current.focus();
              }}
            ></Pressable>
          )}
        </ScrollView>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.iconSticker}>
            <IconSticker />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.iconPhoto, opacity: canOpenPhoto() ? 1 : 0.5 }}
            onPress={
              openSelect == "image" && !inputIsFocus ? closePhoto : openPhoto
            }
            disabled={!canOpenPhoto()}
          >
            {openSelect == "image" && !inputIsFocus ? (
              <IconPhotoActive />
            ) : (
              <IconPhoto />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.iconVideo, opacity: canOpenVideo() ? 1 : 0.5 }}
            onPress={
              openSelect == "video" && !inputIsFocus ? closeVideo : openVideo
            }
            disabled={!canOpenVideo()}
          >
            {openSelect == "video" && !inputIsFocus ? (
              <IconVideoActive />
            ) : (
              <IconVideo />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {openSelect == "image" && (
        <ImageSelect
          style={{
            height: context.keyBoardHeight != 0 ? context.keyBoardHeight : 266,
          }}
          onChange={setSelectedImage}
          selected={selectedImage}
        />
      )}
      {openSelect == "video" && (
        <VideoSelect
          style={{
            height: context.keyBoardHeight != 0 ? context.keyBoardHeight : 266,
          }}
          onChange={(video) => {
            setSelectedVideo(video);
            setOpenSelect(null);
          }}
          selected={selectedVideo}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#fafafa",
    height: 62,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
  },
  iconClose: {
    marginTop: 28,
    left: 10,
  },
  modeContainer: {
    marginTop: 20,
    marginLeft: 25,
  },
  mode: {
    flexDirection: "row",
  },
  textMode: {
    fontWeight: "500",
    fontSize: 16,
    marginLeft: 5,
  },
  iconSendWrap: {
    marginTop: 28,
    marginLeft: "auto",
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  textInput: {
    marginTop: 20,
    fontSize: 18,
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    height: 400,
    marginTop: 30,
  },
  videoContainer: {
    height: 600,
    marginTop: 30,
  },
  bottomBar: {
    height: 45,
    backgroundColor: "#fafafa",
    flexDirection: "row",
  },
  iconSticker: {
    marginTop: 5,
    marginLeft: 5,
  },
  iconPhoto: {
    marginTop: 10,
    marginLeft: "auto",
  },
  iconVideo: {
    marginRight: 20,
    marginTop: 10,
    marginLeft: 30,
  },
});
