import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  Pressable,
  Text,
  View,
  StatusBar,
  Button,
  ImageBackground,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import IconBack from "../../assets/ic_nav_header_back.svg";
import { TextField } from "rn-material-ui-textfield";
import { Icon } from "react-native-elements";
import { Api } from "../api/Api";
import AuthContext from "../components/context/AuthContext";
import ChatContext from "../components/context/ChatContext";
import IconSearch from "../../assets/ic_searchbox.svg";
import { ListItem, Avatar } from "react-native-elements";
import IconLogout from "../../assets/ic_logout.svg";
import IconChangePassword from "../../assets/ic_icon_password_on.svg";
import Modal from "react-native-modal";
import AppContext from "../components/context/AppContext";

export default function ViewProfileOptionScreen({ navigation, route }) {
  const [menuDeleteVisible, setMenuDeleteVisible] = useState(false);
  const authContext = useContext(AuthContext);
  const appContext = useContext(AppContext);
  const removeFriend = async () => {
    try {
      accessToken = authContext.loginState.accessToken;
      const res = await Api.setRemoveFriend(accessToken, route.params.id);
      console.log(res.data);
      appContext.setNeedUpdateViewProfileScreen(true);
      appContext.displayMessage({
        message: "Đã xóa bạn thành công",
        type: "info",
        style: {
          paddingLeft: Dimensions.get("window").width / 2 - 80,
          paddingBottom: 8,
          paddingTop: 24,
        },
        icon: "success",
        position: "top",
        duration: 1600,
        backgroundColor: "#008bd7",
      });
      navigation.goBack();
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

  const block = async () => {
    let hide = !appContext.blockedDiary.includes(route.params.id);
    try {
      let accessToken = authContext.loginState.accessToken;
      const res = await Api.setBlockDiary(
        accessToken,
        route.params.id,
        hide
      );
      if (res.status == 200) {
        appContext.displayMessage({
          message: hide ? "Chặn thành công" : "Bỏ chặn thành công",
          type: "default",
          style: { width: 195, marginBottom: 200 },
          titleStyle: { fontSize: 14 },
          duration: 1900,
          icon: "success",
          position: "center",
          backgroundColor: "#262626",
        });
        appContext.setBlockedDiary(res.data.data.blocked_diary);
      }
      appContext.setNeedUpdateTimeline(true);
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status == 400) {
        console.log(err.response.data.message);
        appContext.displayMessage({
          message: err.response.data.message,
          type: "default",
          style: { width: 195, marginBottom: 200 },
          titleStyle: { fontSize: 14 },
          duration: 1900,
          position: "center",
          backgroundColor: "#262626",
        });
        return;
      }
      props.navigation.navigate("NoConnectionScreen", { message: "" });
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <StatusBar
          backgroundColor="#00000000"
          barStyle="light-content"
          translucent={true}
        />

        <LinearGradient
          colors={["#0085ff", "#05adff"]}
          start={[0, 1]}
          end={[1, 0]}
          style={styles.header}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <TouchableOpacity
              style={styles.iconBackWrap}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <IconBack style={styles.iconBack} />
            </TouchableOpacity>
            <Text style={styles.title}>{route.params.userName}</Text>
          </View>
        </LinearGradient>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View>
          <ListItem
            bottomDivider
            onPress={() => {
              block();
            }}
            underlayColor="#0085ff"
          >
            <ListItem.Content>
              <ListItem.Title>
                {appContext.blockedDiary.includes(route.params.id)
                  ? "Bỏ ẩn nhật ký người này"
                  : "Ẩn nhật ký người này"}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          {route.params.friendStatus == "friend" && (
            <ListItem
              bottomDivider
              onPress={() => {
                setMenuDeleteVisible(true);
              }}
              underlayColor="#0085ff"
            >
              <ListItem.Content>
                <ListItem.Title style={{ color: "#ff2222" }}>
                  Xóa bạn
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          )}
        </View>
      </ScrollView>
      <Modal
        isVisible={menuDeleteVisible}
        onBackdropPress={() => {
          setMenuDeleteVisible(false);
        }}
        style={{ width: 292, alignSelf: "center" }}
        animationIn="fadeInUp"
        animationOut="fadeOutDownBig"
      >
        <View style={styles.menuStyle}>
          <Text style={styles.menuDesription}>
            Xóa bạn với {route.params.userName}?
          </Text>
          <View style={styles.menuBottom}>
            <TouchableOpacity
              flex={1}
              style={styles.menuCancelBtn}
              onPress={() => {
                setMenuDeleteVisible(false);
              }}
            >
              <Text style={styles.textCancel}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              flex={1}
              style={styles.menuAcceptBtn}
              onPress={() => {
                removeFriend();
              }}
            >
              <Text style={styles.textAccept}>Xoá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  header: {
    width: "100%",
    color: "#fff",
    height: 62,
  },
  iconBack: {
    marginTop: 30,
    left: 10,
  },
  iconBackWrap: {
    width: 40,
    position: "absolute",
  },
  title: {
    marginTop: 30,
    marginLeft: "auto",
    marginRight: "auto",
    color: "#fff",
    fontSize: 18,
  },
  iconSearchWrap: {
    width: 32,
    position: "absolute",
    right: 0,
  },
  iconSearch: {
    marginTop: 32,
  },
  menuOption: {
    flexDirection: "row",
    paddingLeft: 14,
    paddingRight: 0,
    marginTop: 2,
  },
  inMenuOption: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
    paddingTop: 3,
  },
  menuStyle: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingTop: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },

  menuDesription: {
    textAlign: "center",
    fontSize: 14,
    paddingTop: 8,
    paddingBottom: 16,
    fontWeight: "400",
    paddingLeft: 12,
    paddingRight: 12,
  },
  menuBottom: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#dadada",
  },
  menuCancelBtn: {
    height: 40,
    width: "50%",
    borderRightColor: "#dadada",
    borderRightWidth: 1,
  },
  menuAcceptBtn: {
    height: 40,
    width: "50%",
  },
  textCancel: {
    fontSize: 17,
    textAlign: "center",
    marginTop: "auto",
    marginBottom: "auto",
    fontWeight: "500",
    color: "#1476f8",
  },
  textAccept: {
    fontSize: 17,
    textAlign: "center",
    marginTop: "auto",
    marginBottom: "auto",
    fontWeight: "400",
    color: "#ed4732",
  },
});
