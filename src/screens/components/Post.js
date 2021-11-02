import { useLinkProps } from "@react-navigation/native";
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  Pressable,
  Text,
  TextInput,
  StatusBar,
  View,
  Button,
  TouchableHighlight,
  Keyboard,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableHighlightBase,
  Dimensions,
} from "react-native";
import {
  Avatar,
  Icon,
  Image,
  Divider,
  Overlay,
  ButtonGroup,
} from "react-native-elements";
import ImageView from "react-native-image-viewing";
import { Video, AVPlaybackStatus } from "expo-av";
import RBSheet from "react-native-raw-bottom-sheet";
import IconMenuDelete from "../../../assets/ic_bottom_sheet_menu_delete.svg";
import IconMenuReport from "../../../assets/ic_bottom_sheet_menu_report.svg";
import IconMenuBan from "../../../assets/ic_bottom_sheet_menu_ban.svg";
import IconMenuHide from "../../../assets/ic_hide_social.svg";
import IconComment from "../../../assets/ico_comment.svg";
import IconUnLike from "../../../assets/ic_unlike.svg";
import IconLike from "../../../assets/ic_like.svg";
import IconSend from "../../../assets/icn_send_black.svg";
import * as myConst from "../../utils/Constants";
import { Api } from "../../api/Api";
import AuthContext from "../../components/context/AuthContext";
import { TextUtility } from "../../utils/TextUtility";
import { TimeUtility } from "../../utils/TimeUtility";

const BaseURL = "http://13.76.46.159:8000/files/";

const ReportDetails = (props) => {
  const [details, setDetails] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const context = React.useContext(AuthContext);

  var onSendReport = async () => {
    try {
      let accessToken = context.loginState.accessToken;
      const res = await Api.createReport(
        accessToken,
        props.postId,
        props.subject,
        details
      );
      // console.log(res);
    } catch (err) {
      console.log(err);
      props.navigation.navigate("NoConnectionScreen", { message: "" });
    }
    setSent(true);
  };

  return (
    <View
      style={{
        justifyContent: "center",
        flexDirection: "column",
        height: 320,
        marginTop: -20,
      }}
    >
      <Text style={styles.enterReportTitle}>
        Lý do chi tiết báo xấu (tùy chọn):
      </Text>
      <TextInput
        style={styles.enterReport}
        placeholder="Nhập lý do báo xấu"
        returnKeyType="send"
        enablesReturnKeyAutomatically
        defaultValue={details}
        onChangeText={(text) => setDetails(text)}
        multiline={true}
      ></TextInput>
      <View style={styles.sendReportButton}>
        {sent ? (
          <Text style={styles.sentAlert}>Đã gửi báo cáo thành công</Text>
        ) : (
          <TouchableNativeFeedback onPress={onSendReport}>
            <IconSend />
          </TouchableNativeFeedback>
        )}
      </View>
    </View>
  );
};

export default function Post(props) {
  const video = React.useRef(null);
  const refRBSheet = React.useRef(null);
  const refRBSheetReport = React.useRef(null);
  const refRBSheetReportDetails = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [reportReason, setReportReason] = React.useState(myConst.REPORT_KHAC);
  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(1);
  const [images, setImages] = useState(props.post.images);
  const [videos, setVideos] = useState(props.post.videos);
  const [numLike, setNumLike] = useState(props.post.like.length);
  const [isLike, setIsLike] = useState(props.post.isLike);
  const [postTime, setPostTime] = useState(new Date(props.post.createdAt));
  let userName = props.post.author.username;
  let numComment = props.post.countComments;

  var goToUserPage = () => {
    setIsLike(false);
    console.log("Go to user's page!");
  };

  var showMenu = () => {
    console.log("showing menu ...");
    refRBSheet.current.open();
  };

  var clickLike = () => {
    console.log("touched like ...");
  };

  var clickComment = () => {
    console.log("touched comment ...");
  };

  let iconLikeStatus = isLike ? IconLike : IconUnLike;

  let statusBar = <></>;
  if (visible) {
    statusBar = <StatusBar hidden />;
  }

  let renderImages = [];
  for (let i = 0; i < images.length; i++) {
    renderImages.push({ uri: BaseURL + images[i].fileName });
  }
  console.log();

  let media = <></>;
  let addition = <></>;

  if (videos.length == 0) {
    if (renderImages.length > 0) {
      if (renderImages.length > 1) {
        let additionImages = [];
        let imageHeight =
          renderImages.length <= 2
            ? 400
            : (400 - 3 * (renderImages.length - 2)) / (renderImages.length - 1);
        for (let i = 1; i < renderImages.length; i++) {
          additionImages.push(
            <View key={i}>
              <Image
                source={[renderImages[i]]}
                style={{ height: imageHeight, resizeMode: "cover" }}
                onPress={() => {
                  setImageIndex(i);
                  setIsVisible(true);
                }}
              />
            </View>
          );
        }
        addition = (
          <View
            style={{
              flex: 1,
              paddingTop: 20,
              flexDirection: "column",
              left: 3,
              justifyContent: "space-between",
            }}
          >
            {additionImages}
          </View>
        );
      }
      media = (
        <>
          <ImageView
            images={renderImages}
            imageIndex={imageIndex}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
            swipeToCloseEnabled={true}
            FooterComponent={(props) => {
              return (
                <View>
                  <Text style={styles.imageViewFooter}>
                    {props.imageIndex + 1} / {renderImages.length}
                  </Text>
                </View>
              );
            }}
          />
          <View style={{ flex: 1, paddingTop: 20 }}>
            <Image
              source={[renderImages[0]]}
              style={{ height: 400, resizeMode: "cover" }}
              onPress={() => {
                setImageIndex(0);
                setIsVisible(true);
              }}
            />
          </View>
          {addition}
        </>
      );
    }
  } else {
    media = (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: BaseURL + videos[0].fileName,
          }}
          useNativeControls={true}
          resizeMode="contain"
          isLooping={true}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      </View>
    );
  }

  var navigateToCommentScreen = () => {
    Keyboard.dismiss();
    if (props.mode !== "comment") {
      if (videos.length > 0) video.current.pauseAsync();
      props.navigation.navigate("PostScreen", {
        postId: props.post._id,
        post: props.post,
        navigation: props.navigation,
        updateFunc: props.updateFunc,
      });
    }
  };

  var onPressDelete = () => {
    console.log("pressed Delete");
    // refRBSheet.current.close();
  };
  var onPressHide = () => {
    console.log("pressed Hide");
  };

  var onPressBlock = () => {
    console.log("pressed Block");
  };

  let refCallBack = useRef(() => {});

  var onPressReport = () => {
    refCallBack.current = () => {
      refRBSheetReport.current.open();
    };
    refRBSheet.current.close();
    console.log("pressed Report");
  };

  const context = useContext(AuthContext);

  const sendReport = (reason, details) => {
    let accessToken = "lol " + context.loginState.accessToken;
    // Api.createReport(
    //     accessToken,
    //     props.postId,
    //     props.subject,
    //     details
    // ).then((res)=> {

    // });
  };
  const [reportKhac, setReportKhac] = useState({ show: false, content: "" });
  let shoundReportKhacOpen = useRef(false);
  var onPressReportReason = (reason) => {
    refRBSheetReport.current.close();
    if (reason != myConst.REPORT_KHAC) {
      sendReport(reason);
    } else {
      shoundReportKhacOpen.current = true;
    }
  };

  const OpenReportKhac = () => {
    if (shoundReportKhacOpen.current) {
      setReportKhac({ show: true, content: "" });
    }
  };

  var renderPostContent = () => {
    let [phone, TextUI] = TextUtility.detectThenFormatPhoneAndURL(
      props.post.described
    );
    return TextUI;
  };

  return (
    <View style={styles.postContainer}>
      {statusBar}
      <Pressable onPress={navigateToCommentScreen}>
        <View>
          <View style={styles.postHeader}>
            <View style={styles.posterAvatar}>
              <Avatar
                size={42}
                rounded
                onPress={() => goToUserPage()}
                activeOpacity={0.8}
                source={{ uri: BaseURL + props.post.author.avatar.fileName }}
              />
            </View>
            <View style={styles.posterInfo}>
              <View style={{ flex: 1 }}>
                <Pressable
                  onPress={() => {
                    goToUserPage();
                  }}
                >
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 16,
                      color: "#000",
                      fontWeight: "600",
                      lineHeight: 28,
                    }}
                  >
                    {userName}
                  </Text>
                </Pressable>
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: "#77797c",
                  marginTop: 0,
                }}
              >
                {TimeUtility.getTimeStr(postTime)}
              </Text>
            </View>
            <View style={styles.postMenu}>
              <Icon
                name="options"
                type="simple-line-icon"
                color="#898989"
                size={20}
                onPress={() => showMenu("")}
              />
            </View>
          </View>
          <View style={styles.postContent}>{renderPostContent()}</View>
        </View>
      </Pressable>

      <View style={styles.postMedia}>{media}</View>
      <Pressable onPress={navigateToCommentScreen}>
        <View style={styles.postFooter}>
          <View style={{ flexDirection: "row", marginRight: 36 }}>
            <Pressable
              style={{ marginTop: 4 }}
              onPress={() => clickComment("")}
            >
              {iconLikeStatus}
            </Pressable>
            <Text style={{ marginLeft: 9, fontSize: 18, lineHeight: 34 }}>
              {numLike}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              display: props.mode == "comment" ? "none" : null,
            }}
          >
            <Pressable
              style={{ marginTop: 4 }}
              onPress={navigateToCommentScreen}
            >
              {IconComment}
            </Pressable>
            <Text style={{ marginLeft: 10, fontSize: 18, lineHeight: 34 }}>
              {numComment}
            </Text>
          </View>
        </View>
      </Pressable>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        onClose={() => refCallBack.current()}
        animationType="fade"
        height={320}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.28)",
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopEndRadius: 20,
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
            height: 320,
            marginTop: -20,
          }}
        >
          <Pressable
            style={[styles.menuOption, { height: 72 }]}
            onPress={onPressDelete}
          >
            <IconMenuDelete
              flex={1}
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
            <View flex={10} style={styles.inMenuOption}>
              <Text
                style={{ fontSize: 16, fontWeight: "400", marginBottom: 4 }}
              >
                Xoá bài đăng
              </Text>
              <Text style={{ fontSize: 14, color: "#9ea1a6" }}>
                Bài đăng này sẽ ẩn khỏi nhật ký
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.menuOption, { height: 90 }]}
            onPress={onPressHide}
          >
            <IconMenuHide
              flex={1}
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
            <View flex={10} style={styles.inMenuOption}>
              <Text
                style={{ fontSize: 16, fontWeight: "400", marginBottom: 4 }}
              >
                Ẩn nhật ký của {userName}
              </Text>
              <Text style={{ fontSize: 14, color: "#9ea1a6" }}>
                Toàn bộ bài đăng và khoảnh khắc của người này sẽ bị ẩn đi
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.menuOption, { height: 90 }]}
            onPress={onPressBlock}
          >
            <IconMenuBan
              flex={1}
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
            <View flex={10} style={styles.inMenuOption}>
              <Text
                style={{ fontSize: 16, fontWeight: "400", marginBottom: 4 }}
              >
                Chặn {userName} xem nhật ký của tôi
              </Text>
              <Text style={{ fontSize: 14, color: "#9ea1a6" }}>
                Người này sẽ không thấy toàn bộ bài đăng và khoảnh khắc của bạn
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.menuOption, { height: 68 }]}
            onPress={onPressReport}
          >
            <IconMenuReport
              flex={1}
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
            <View flex={10} style={styles.reportMenuOption}>
              <Text style={{ fontSize: 16, fontWeight: "400" }}>Báo xấu</Text>
            </View>
          </Pressable>
        </View>
      </RBSheet>

      <RBSheet
        ref={refRBSheetReport}
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        animationType="fade"
        height={420}
        onClose={() => {
          refCallBack.current = () => {};
          OpenReportKhac();
        }}
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
              backgroundColor: "rgba(220,220,220,1)",
              borderTopLeftRadius: 15,
              borderTopEndRadius: 15,
              borderBottomRightRadius: 15,
              borderBottomStartRadius: 15,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#767676",
                textAlign: "center",
                marginTop: 15,
              }}
            >
              Xác nhận
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#767676",
                textAlign: "center",
                marginTop: 15,
                marginBottom: 20,
              }}
            >
              Bạn muốn báo xấu hoạt động này?
            </Text>
            <Divider orientation="horizontal" />
            <TouchableHighlight
              style={styles.reportOption}
              onPress={() => {
                onPressReportReason(myConst.REPORT_NHAYCAM);
              }}
              activeOpacity={0.99}
              underlayColor="#989898"
            >
              <Text style={styles.reportOptionText}>Nội dung nhạy cảm</Text>
            </TouchableHighlight>
            <Divider orientation="horizontal" />
            <TouchableHighlight
              style={styles.reportOption}
              onPress={() => {
                onPressReportReason(myConst.REPORT_LAMPHIEN);
              }}
              activeOpacity={0.99}
              underlayColor="#989898"
            >
              <Text style={styles.reportOptionText}>Làm phiền</Text>
            </TouchableHighlight>
            <Divider orientation="horizontal" />
            <TouchableHighlight
              style={styles.reportOption}
              onPress={() => {
                onPressReportReason(myConst.REPORT_LUADAO);
              }}
              activeOpacity={0.99}
              underlayColor="#989898"
            >
              <Text style={styles.reportOptionText}>Lừa đảo</Text>
            </TouchableHighlight>
            <Divider orientation="horizontal" />
            <TouchableHighlight
              style={styles.reportOption}
              onPress={() => {
                onPressReportReason(myConst.REPORT_KHAC);
              }}
              activeOpacity={0.99}
              underlayColor="#989898"
            >
              <Text style={styles.reportOptionText}>Lý do khác</Text>
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
            onPress={() => refRBSheetReport.current.close()}
            activeOpacity={0.999}
            underlayColor="#989898"
          >
            <Text style={{ color: "#0085ff", fontWeight: "600", fontSize: 19 }}>
              Hủy
            </Text>
          </TouchableHighlight>
        </View>
      </RBSheet>
      <Overlay
        isVisible={reportKhac.show}
        overlayStyle={{
          borderTopLeftRadius: 15,
          borderTopEndRadius: 15,
          borderBottomRightRadius: 15,
          borderBottomStartRadius: 15,
          height: 220,
          width: (Dimensions.get("window").width / 10) * 9,
          backgroundColor: "#fff",
          alignSelf: "center",
          top: -100,
          padding: 0
        }}
      >
        <View style={{flex:1, width:'100%'}}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "400",
              lineHeight: 20,
              marginBottom: 10,
              marginTop : 10
            }}
          >
            Báo xấu
          </Text>
          <Divider orientation="horizontal" />
          <TextInput
            style={{height: 135, padding:10}}
            placeholder="Nhập lý do báo xấu"
            returnKeyType="send"
            enablesReturnKeyAutomatically
            multiline={true}
            autoFocus
          />
          <View style={{ flexDirection: "row", flex:1, width:'100%' }}>
            <TouchableHighlight
              onPress={() => {setReportKhac({ show: false, content: "" }), shoundReportKhacOpen.current=false}}
              activeOpacity={0.999}
              underlayColor="#dedede"
              style= {{flex:1, borderTopWidth:1, height: 45, alignItems:'center', justifyContent:'center', borderColor: '#dedede'}}
            >
              <Text style={{textAlign:'center', fontSize:16}}>Hủy</Text>
            </TouchableHighlight>
            <TouchableHighlight 
                style= {{flex:1, borderLeftWidth: 1, borderTopWidth:1, height: 45, alignItems:'center', justifyContent:'center',borderColor: '#dedede'}}
                activeOpacity={0.999}
                underlayColor="#dedede"
                onPress={()=>{shoundReportKhacOpen.current=false;sendReport(myConst.REPORT_KHAC,reportKhac.content);setReportKhac({ show: false, content: reportKhac.content })}}
            >
              <Text style={{textAlign:'center',color: '#0085ff', fontWeight:'500', fontSize:16}}>Đồng ý</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: "#fff",
    marginTop: 0,
  },
  posterAvatar: {
    marginLeft: 18,
    marginTop: 16,
  },
  posterInfo: {
    paddingTop: 12,
    marginLeft: 12,
  },
  postHeader: {
    flexDirection: "row",
    height: 60,
    marginBottom: 20,
  },
  postContent: {
    paddingLeft: 8,
    paddingRight: 6,
    fontSize: 18,
    marginTop: -10,
    marginBottom: -11,
  },
  postMedia: {
    flexDirection: "row",
    maxHeight: 500,
  },
  postFooter: {
    paddingTop: 8,
    height: 50,
    textAlignVertical: "center",
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 18,
    borderTopColor: "#ebebeb",
    borderTopWidth: 1,
    marginTop: 20,
  },
  postMenu: {
    marginLeft: "auto",
    marginRight: 16,
    marginTop: 8,
  },
  imageViewFooter: {
    color: "#fff",
    fontSize: 18,
    marginLeft: "auto",
    marginBottom: 4,
    marginRight: "auto",
    paddingRight: 2,
    fontWeight: "500",
  },
  video: {
    alignSelf: "center",
    width: "100%",
    height: 400,
  },
  menuOption: {
    flexDirection: "row",
    paddingLeft: 14,
    paddingRight: 18,
  },
  inMenuOption: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#adb1b7",
  },
  reportMenuOption: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 12,
  },
  enterReportTitle: {
    fontSize: 24,
    margin: 10,
    fontWeight: "bold",
  },
  enterReport: {
    padding: 10,
    height: 50,
    backgroundColor: "#fff",
    fontSize: 18,
    margin: 10,
    borderColor: "gray",
    borderRadius: 2,
    borderWidth: 2,
    flex: 1,
  },
  sendReportButton: {
    alignSelf: "center",
    margin: 10,
  },
  sentAlert: {
    marginBottom: 10,
    color: "green",
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
