import React, {
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
  useContext,
} from "react";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { Avatar, ListItem, Icon } from "react-native-elements";
import HeaderBar from "../screens/components/HeaderBar";
import Post from "./components/Post.js";
import IconSend from "../../assets/icn_send.svg";
import IconSendDiable from "../../assets/icn_send_disable.svg";
import IconBack from "../../assets/arrow-back-outline.svg";
import IconPhoto from "../../assets/icn_csc_menu_sticker_n.svg";
import AuthContext from "../components/context/AuthContext";
import { Api } from "../api/Api.js";
import { TimeUtility } from "../utils/TimeUtility.js";
import AppContext from "../components/context/AppContext";
import { BaseURL } from "../utils/Constants";
import { Dimensions } from 'react-native';



export default function PostScreen({ navigation, route }) {
  const mounted = useRef(false);
  const flatList = useRef(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const appContext = useContext(AppContext);
  const authContext = React.useContext(AuthContext);
  const [listComment, setListComment] = useState("");
  const [countComment, setCountComment] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [DidComment, setDidComment] = useState(false);
  const [needUpdateParent, setNeedUpdateParent] = useState(false);

  const createComment = async (content) => {
    try {
      let accessToken = authContext.loginState.accessToken;
      await Api.createComment(accessToken, route.params.postId, content);
      if (mounted.current === false) {
        return;
      }
      setNeedUpdateParent(true);
      setDidComment(true);
      Keyboard.dismiss();
      appContext.displayMessage({
        message: "Đã gửi bình luận",
        type: "info",
        style: { paddingLeft: Dimensions.get("window").width / 2 - 80, paddingBottom: 8, paddingTop: 24 },
        icon: "success",
        position: "top",
        duration: 1600,
        backgroundColor: "#008bd7",
      });
      getListComment();
    } catch (err) {
      console.log(err);
      navigation.navigate("NoConnectionScreen", { message: "" });
    }
  };

  const getListComment = async () => {
    try {
      let accessToken = authContext.loginState.accessToken;
      const res = await Api.getComment(accessToken, route.params.postId);
      if (mounted.current === false) {
        return;
      }
      setIsLoaded(true);
      let comments = res.data.data;
      comments = comments.filter((comment) => {
        return comment.user;
      });
      setListComment(
        comments.map((comment) => ({
          user: comment.user.username,
          content: comment.content,
          img: BaseURL + comment.user.avatar.fileName,
          dateCreated: new Date(comment.createdAt),
          dateUpdated: new Date(comment.updatedAt),
          date: TimeUtility.getTimeStr(new Date(comment.createdAt)),
          userId: comment.user._id,
        }))
      );
      setCountComment(res.data.countComments);
    } catch (err) {
      if (err.response && err.response.status == 404) {
        console.log(err.response.data.message);
        navigation.navigate("TimeLineScreen")
        appContext.displayMessage({
          message: "Không tìm thấy bài đăng. Vui lòng tải lại.",
          type: "default",
          style: { width: 195, marginBottom: 200 },
          titleStyle: { fontSize: 14 },
          duration: 1900,
          position: "center",
          backgroundColor: "#262626",
        });
        return
      }
      console.log(err);
      navigation.navigate("NoConnectionScreen", {
        message: "Tài khoản sẽ tự động đăng nhập khi có kết nối internet",
      });
    }
  };

  useLayoutEffect(() => {
    getListComment();
  }, []);

  var UserPost = () => {
    let describe = (
      <Text style={styles.describeText}>
        Đang tải bình luận, vui lòng chờ ...
      </Text>
    );
    if (isLoaded) {
      if (countComment > 0) {
        describe = (
          <Text style={styles.describeText}>
            Có {countComment} bình luận. Bạn chỉ được xem bình luận của bạn bè
            trong danh bạ.
          </Text>
        );
      } else {
        describe = (
          <Text style={styles.describeText}>
            Hãy là người đầu tiên bình luận
          </Text>
        );
      }
    }

    return (
      <>
        <View style={styles.post}>
          <Post
            mode="comment"
            post={route.params.post}
            navigation={navigation}
            from={route.params.from}
          ></Post>
        </View>
        {describe}
      </>
    );
  };

  const goToUserPage = (userID) => {
    if (userID == authContext.loginState.userId) {
      navigation.navigate("ProfileScreen");
    } else {
      navigation.navigate("ViewProfileScreen", { userId: userID })
    }
  }

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <ListItem bottomDivider>
        <Avatar size={42} rounded source={{ uri: item.img }} onPress={() => { goToUserPage(item.userId) }} />
        <ListItem.Content>
          <TouchableOpacity onPress={() => { goToUserPage(item.userId) }}>
            <ListItem.Title style={styles.commentUser}>{item.user}</ListItem.Title>
          </TouchableOpacity>
          <ListItem.Subtitle style={styles.commentContent}>
            {item.content}
          </ListItem.Subtitle>
          <Text style={styles.commentDate}>{item.date}</Text>
        </ListItem.Content>
        <Icon
          name="heart-outline" // like: heart
          type="ionicon"
          color="#818181" // like: #f84c5d
          size={24}
        />
      </ListItem>
    </Pressable>
  );

  const PostAndComment = () => {
    return (
      <FlatList
        ref={flatList}
        keyboardShouldPersistTaps={"always"}
        onContentSizeChange={() => {
          if (DidComment) flatList.current.scrollToEnd({ animated: true });
        }}
        data={listComment}
        initialNumToRender={15}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={UserPost()}
      />
    );
  };

  var MyComment = (props) => {
    const [myComment, setMyComment] = useState("");

    return (
      <KeyboardAvoidingView
        style={styles.myComment}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={styles.sendButton}>
            <TouchableOpacity>
              <IconPhoto />
            </TouchableOpacity>
          </View>
          <View style={styles.enterCommentText}>
            <TextInput
              style={styles.enterComment}
              placeholder="Nhập bình luận"
              returnKeyType="none"
              enablesReturnKeyAutomatically={false}
              onChangeText={(text) => setMyComment(text)}
              defaultValue={myComment}
            ></TextInput>
          </View>
          <View style={styles.sendButton}>
            <TouchableOpacity
              disabled={!myComment.match(/\S/)}
              onPress={() => {
                createComment(myComment);
                setMyComment("");
              }}
            >
              {myComment.match(/\S/) ? <IconSend /> : <IconSendDiable />}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  var goBackFunc = () => {
    if (needUpdateParent) {
      if (route.params.from.includes("timeline")) {
        appContext.setNeedUpdateTimeline(true);
      }

      if (route.params.from.includes("profile")) {
        appContext.setNeedUpdateProfile(true);
      }
    }
    navigation.goBack();
  };

  return (
    <>
      <View style={styles.container}>
        <HeaderBar
          text="Bình luận"
          goBackFunc={goBackFunc}
          navigation={navigation}
        />
        <View style={styles.postAndComment}>{PostAndComment()}</View>
      </View>
      {MyComment()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  istruction: {
    backgroundColor: "#f9fafc",
    width: "100%",
    height: 40,
    paddingTop: 10,
    paddingLeft: 12,
  },
  button: {
    width: "100%",
    height: 40,
    alignSelf: "center",
    borderRadius: 20,
  },
  wrapLoginButton: {
    width: "50%",
    marginTop: "auto",
    alignSelf: "center",
    borderRadius: 20,
  },
  centerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "#f00",
    left: 20,
  },
  textFieldLable: {
    paddingTop: 3,
  },
  postAndComment: {
    flex: 1,
  },
  post: {
    borderBottomColor: "#ebebeb",
    borderBottomWidth: 1,
  },
  comment: {
    flex: 1,
  },
  footer: {
    flex: 1,
  },
  enterComment: {
    padding: 10,
    height: 50,
    backgroundColor: "#fff",
    fontSize: 18,
    marginTop: 3,
  },
  avatar: {
    flex: 2,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "bold",
  },
  commentContent: {
    paddingTop: 4,
    fontSize: 14,
    color: "black",
  },
  commentDate: {
    paddingTop: 4,
    fontSize: 13,
    color: "gray",
  },
  enterCommentText: {
    flex: 1,
  },
  sendButton: {
    alignSelf: "center",
    margin: 10,
  },
  describeText: {
    fontSize: 14,
    paddingLeft: 16,
    paddingRight: 16,
    color: "#778993",
    marginTop: 12,
    marginBottom: 12,
  },
  myComment: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e6e6e6",
  },
});
