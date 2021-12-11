// import * as React from 'react';
// import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  TextInput,
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
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import IconBack from "../../assets/ic_nav_header_back.svg";
import { TextField } from "rn-material-ui-textfield";
import { Icon } from "react-native-elements";
import { Api } from "../api/Api";
import AuthContext from "../components/context/AuthContext";
import SettingIcon from "../../assets/setting.svg";
import IconSearch from "../../assets/ic_searchbox.svg";
import Loimoiketban from "../../assets/loimoiketban.svg";
import Danhba from "../../assets/danhba.svg";
import { useLinkProps } from "@react-navigation/native";
import { ListItem } from "react-native-elements";
import VideoIcon from "../../assets/ic_video_line_24.svg";
import CallIcon from "../../assets/ic_call_line_24.svg";
import { Avatar } from "native-base";
import { flex, flexDirection } from 'styled-system';
import { BaseURL } from "../utils/Constants";
import AppContext from "../components/context/AppContext";
import { useIsFocused } from "@react-navigation/native";



export default function FriendRequests({ navigation }) {
  const context = React.useContext(AuthContext);
  const appContext = React.useContext(AppContext);
  const isFocused = useIsFocused();
  const [ListS, setListS] = useState([]);
  const [ListR, setListR] = useState([]);
  const [isLoadS, setIsLoadS] = useState(false);
  const [isLoadR, setIsLoadR] = useState(false);
  const [editFriendRequestsInfo, setEditFriendRequestsInfo] = useState(null);

  useEffect(() => {
    if (appContext.editFriendRequestsInfo) {
      setEditFriendRequestsInfo(appContext.editFriendRequestsInfo);
      appContext.setEditFriendRequestsInfo(null);
    }
  }, [appContext.editFriendRequestsInfo])

  if (isLoadS && isLoadR && editFriendRequestsInfo && isFocused) {
    const newListR = ListR;
    const newListS = ListS;
    let req = editFriendRequestsInfo;
    setEditFriendRequestsInfo(null);
    if (req.type == 'received') {
      if (req.status == '0') {
        let temp = ListR[req.index];
        temp.status = '0';
        let tmp = temp.sender;
        temp.sender = temp.receiver;
        temp.receiver = tmp;
        newListR.splice(req.index, 1);
        setListR([...newListR]);

        newListS.push(temp);
        setListS([...newListS]);
      } else {
        if (req.status == '2') {
          req.status = '0';
        }
        newListR[req.index].status = req.status;
        setListR([...newListR]);
      }

    } else {
      if (req.status == '2') {
        let temp = ListS[req.index];
        temp.status = '0';
        let tmp = temp.sender;
        temp.sender = temp.receiver;
        temp.receiver = tmp;
        newListS.splice(req.index, 1);
        setListS([...newListS]);

        newListR.push(temp);
        setListR([...newListR]);
      } else {
        newListS[req.index].status = req.status;
        setListS([...newListS]);
      }
    }

  }

  const getListS = async () => {
    try {
      const accessToken = context.loginState.accessToken;
      let List = await Api.getListFriendsRequest(accessToken);
      // console.log(friends.data.data.friends);
      // console.log(typeof friends.data.data.friends);
      setListS(List.data.data.sentList);
      setIsLoadS(true);
    } catch (e) {
      console.log(e);
      navigation.navigate("NoConnectionScreen", {
        message: "Vui lòng kiểm tra kết nối internet và thử lại",
      });
    }
  };
  useLayoutEffect(() => {
    getListS();
  }, []);


  const handleAgreeRequest = async (id) => {
    try {
      const accessToken = context.loginState.accessToken;
      let res = await Api.sendAcceptFriendRequest(accessToken, id);
      appContext.setNeedUpdateContact(true);
      if (res.data.newStatus == "friend") {
        const newListR = ListR;
        for (let i = 0; i < newListR.length; i++) {
          if (newListR[i].sender._id == id) {
            newListR[i].status = '1';
            break;
          }
        }
        setListR([...newListR]);
      } else {
        const newListR = ListR.filter(el => el.receiver._id !== id);
        setListR([...newListR]);
      }
    } catch (e) {
      console.log(e);
      navigation.navigate("NoConnectionScreen", {
        message: "Vui lòng kiểm tra kết nối internet và thử lại",
      });
    }
  }

  const handleRejectRequest = async (id) => {
    try {
      const accessToken = context.loginState.accessToken;
      let res = await Api.sendRejectFriendRequest(accessToken, id);
      if (res.data.newStatus == "not friend") {
        const newListR = ListR;
        for (let i = 0; i < newListR.length; i++) {
          if (newListR[i].sender._id == id) {
            newListR[i].status = '3';
            break;
          }
        }
        setListR([...newListR]);
      } else {
        const newListR = ListR.filter(el => el.receiver._id !== id);
        setListR([...newListR]);
      }
    } catch (e) {
      console.log(e);
      navigation.navigate("NoConnectionScreen", {
        message: "Vui lòng kiểm tra kết nối internet và thử lại",
      });
    }
  }

  const handleCancelRequest = async (id) => {

    try {
      const accessToken = context.loginState.accessToken;
      let res = await Api.sendCancelFriendRequest(accessToken, id);
      if (res.data.newStatus == "not friend") {
        const newListS = ListS;
        for (let i = 0; i < newListS.length; i++) {
          if (newListS[i].receiver._id == id) {
            newListS[i].status = '3';
            break;
          }
        }
        setListS([...newListS]);
      } else {
        const newListS = ListS.filter(el => el.receiver._id !== id);
        setListS([...newListS]);
      }
    } catch (e) {
      console.log(e);
      navigation.navigate("NoConnectionScreen", {
        message: "Vui lòng kiểm tra kết nối internet và thử lại",
      });
    }
  }


  const handleResentRequest = async (id) => {

    try {
      const accessToken = context.loginState.accessToken;
      let res = await Api.sendFriendRequest(accessToken, id);
      if (res.data.newStatus == "sent") {
        const newListS = ListS;
        for (let i = 0; i < newListS.length; i++) {
          if (newListS[i].receiver._id == id) {
            newListS[i].status = '0';
            break;
          }
        }
        setListS([...newListS]);
      } else {
        const newListS = ListS.filter(el => el.receiver._id !== id);
        setListS([...newListS]);
      }
    } catch (e) {
      console.log(e);
      navigation.navigate("NoConnectionScreen", {
        message: "Vui lòng kiểm tra kết nối internet và thử lại",
      });
    }
  }


  const handleSentRequestFromReceived = async (id) => {

    try {
      const accessToken = context.loginState.accessToken;
      let res = await Api.sendFriendRequest(accessToken, id);
      if (res.data.newStatus == "sent") {
        const newListS = ListS;
        for (let i = 0; i < ListR.length; i++) {
          if (ListR[i].sender._id == id) {
            let temp = ListR[i];
            let tmp = temp.sender;
            temp.sender = temp.receiver;
            temp.receiver = tmp;
            temp.status = "0"
            newListS.push(temp);
            break;
          }
        }
        setListS([...newListS]);
        const newListR = ListR.filter(el => el.receiver._id !== id);
        setListR([...newListR]);
      } else if (res.data.newStatus == "received") {
        const newListR = ListR;
        for (let i = 0; i < newListR.length; i++) {
          if (newListR[i].sender._id == id) {
            newListR[i].status = '0';
            break;
          }
        }
        setListR([...newListR]);
      } else if (res.data.newStatus == "friend") {
        const newListR = ListR;
        for (let i = 0; i < newListR.length; i++) {
          if (newListR[i].sender._id == id) {
            newListR[i].status = '1';
            break;
          }
        }
        setListR([...newListR]);
      }
    } catch (e) {
      console.log(e);
      navigation.navigate("NoConnectionScreen", {
        message: "Vui lòng kiểm tra kết nối internet và thử lại",
      });
    }
  }

  const goToUserPage = (id, type, index) => {
    navigation.navigate("ViewProfileScreen", { userId: id, from: 'friend_requests', type: type, index: index })
  }

  const getListR = async () => {
    try {
      const accessToken = context.loginState.accessToken;
      let List = await Api.getListFriendsRequest(accessToken);
      // console.log(friends.data.data.friends);
      // console.log(typeof friends.data.data.friends);
      setListR(List.data.data.receivedList);
      setIsLoadR(true);
    } catch (e) {
      console.log(e);
      navigation.navigate("NoConnectionScreen", {
        message: "Vui lòng kiểm tra kết nối internet và thử lại",
      });
    }
  };
  useLayoutEffect(() => {
    getListR();
  }, []);

  const FriendSent = (props) => {
    if (props.status == '0') {
      return (
        <View
          style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 15, marginTop: 10, backgroundColor: "white" }}
          onPress={() => { }}
          activeOpacity={0.99999}
          underlayColor="#05adff22"
        >
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => { goToUserPage(props.id, "received", props.index) }}>
              <Avatar size="lg" source={{ uri: props.img }} />
            </TouchableOpacity>
            <View flex={1}>
              <TouchableOpacity onPress={() => { goToUserPage(props.id, "received", props.index) }}>
                <Text
                  style={{
                    marginLeft: 15,
                    fontSize: 18,
                    marginTop: 6,
                    fontWeight: '500'
                  }}
                >
                  {props.name}
                </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', width: '100%', marginTop: 10, marginBottom: 4, paddingLeft: 14, paddingRight: 24 }}>
                <Text style={{ borderColor: "#dce1e4", fontSize: 15, minHeight: 60, width: '100%', borderWidth: 1, borderRadius: 5, marginTop: 0, padding: 10, paddingRight: 22 }}>
                  Xin chào, mình là {props.name}. Kết bạn với mình nhé!
                </Text>
              </View>
              <View style={{ flexDirection: 'row', }}>
                <TouchableHighlight
                  style={{
                    width: 104,
                    marginTop: 9,
                    borderRadius: 15,
                    marginLeft: 12,
                    height: 30
                  }}
                  activeOpacity={0.8}
                  underlayColor="#3f3f3f"
                  onPress={() => {
                    handleAgreeRequest(props.id)
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
                      <Text style={{ color: "#fff", fontWeight: "500", fontSize: 15 }}>
                        Đồng ý
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableHighlight>
                <TouchableOpacity style={{ flexDirection: 'row', height: 30, marginRight: 16, borderRadius: 40, marginTop: 9, padding: 5, marginLeft: 14, backgroundColor: '#e6e6e6' }} onPress={() => { handleRejectRequest(props.id) }}>
                  <Text style={{ fontSize: 15, color: 'black', width: 94, textAlign: 'center', alignSelf: "center", fontWeight: "500" }}>Từ chối</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    } else if (props.status == '3') {
      return (
        <View
          style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 15, marginTop: 10, backgroundColor: "white" }}
          onPress={() => { }}
          activeOpacity={0.99999}
          underlayColor="#05adff22"
        >
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => { goToUserPage(props.id, "received", props.index) }}>
              <Avatar size="lg" source={{ uri: props.img }} />
            </TouchableOpacity>
            <View flex={1}>
              <TouchableOpacity onPress={() => { goToUserPage(props.id, "received", props.index) }}>
                <Text
                  style={{
                    marginLeft: 15,
                    fontSize: 18,
                    marginTop: 6,
                    fontWeight: '500'
                  }}
                >
                  {props.name}
                </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 12, marginLeft: 16, marginTop: 12, color: "#a6a6a6" }}>Đã từ chối lời mời kết bạn</Text>

              </View>

            </View>
            <TouchableHighlight
              style={{
                width: 90,
                marginTop: 9,
                borderRadius: 15,
                marginLeft: "auto",
                marginRight: 16,
                height: 30
              }}
              activeOpacity={0.8}
              underlayColor="#3f3f3f"
              onPress={() => {
                handleSentRequestFromReceived(props.id)
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
                  <Text style={{ color: "#fff", fontWeight: "500", fontSize: 13 }}>
                    Kết bạn
                  </Text>
                </View>
              </LinearGradient>
            </TouchableHighlight>
          </View>
        </View>
      )
    }
    else if (props.status == '1') {
      return (
        <View
          style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 15, marginTop: 10, backgroundColor: "white" }}
          onPress={() => { }}
          activeOpacity={0.99999}
          underlayColor="#05adff22"
        >
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => { goToUserPage(props.id, "received", props.index) }}>
              <Avatar size="lg" source={{ uri: props.img }} />
            </TouchableOpacity>
            <View flex={1}>
              <TouchableOpacity onPress={() => { goToUserPage(props.id, "received", props.index) }}>
                <Text
                  style={{
                    marginLeft: 15,
                    fontSize: 18,
                    marginTop: 6,
                    fontWeight: '500'
                  }}
                >
                  {props.name}
                </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 15, marginLeft: 16, marginTop: 12, color: "#a6a6a6" }}>Hai người đã trở thành bạn bè</Text>
              </View>

            </View>
          </View>
        </View>
      )
    }



  };

  const FriendReceived = (props) => {
    let button;
    let describe = "";
    if (props.status == "0") {
      button = <TouchableOpacity style={{ flexDirection: 'row', height: 30, marginRight: 16, borderRadius: 40, marginTop: 9, padding: 5, marginLeft: "auto", backgroundColor: '#e6e6e6' }} onPress={() => { handleCancelRequest(props.id) }}>
        <Text style={{ fontSize: 12, color: 'black', width: 80, textAlign: 'center', alignSelf: "center", fontWeight: "500" }}>Thu hồi</Text>
      </TouchableOpacity>
      describe = "Đã gửi lời mời kết bạn"
    } else if (props.status == "3") {
      button = <TouchableHighlight
        style={{
          width: 90,
          marginTop: 9,
          borderRadius: 15,
          marginLeft: "auto",
          marginRight: 16,
          height: 30
        }}
        activeOpacity={0.8}
        underlayColor="#3f3f3f"
        onPress={() => {
          handleResentRequest(props.id)
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
            <Text style={{ color: "#fff", fontWeight: "500", fontSize: 13 }}>
              Kết bạn
            </Text>
          </View>
        </LinearGradient>
      </TouchableHighlight>
      describe = "Đã huỷ lời mời kết bạn"
    }
    return (
      <View
        style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 15, marginTop: 10, backgroundColor: "white" }}
        onPress={() => { }}
        activeOpacity={0.99999}
        underlayColor="#05adff22"
      >
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => { goToUserPage(props.id, "sent", props.index) }}>
            <Avatar size="lg" source={{ uri: props.img }} />
          </TouchableOpacity>
          <View flex={1}>
            <TouchableOpacity onPress={() => { goToUserPage(props.id, "sent", props.index) }}>
              <Text
                style={{
                  marginLeft: 15,
                  fontSize: 18,
                  marginTop: 6,
                  fontWeight: '500'
                }}
              >
                {props.name}
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 12, marginLeft: 16, marginTop: 12, color: "#a6a6a6" }}>{describe}</Text>
            </View>

          </View>
          {button}
        </View>



        {/* <Text style = {{borderWidth:1,borderRadius: 5, marginTop: 5, paddingLeft: 10}}>Xin chào tôi là {props.name}</Text> */}
        {/* padding: 0, marginTop:-50,marginLeft:35 */}

      </View>
    );
  };





  let tmp = [];
  for (let i = 0; i < ListS.length; i++) {
    tmp.push(<FriendReceived key={i} index={i} name={ListS[i].receiver.username} img={BaseURL + ListS[i].receiver.avatar.fileName} id={ListS[i].receiver._id} status={ListS[i].status} />);
  }
  let tmp1 = [];
  for (let i = 0; i < ListR.length; i++) {
    tmp1.push(<FriendSent key={i} index={i} name={ListR[i].sender.username} img={BaseURL + ListR[i].sender.avatar.fileName} id={ListR[i].sender._id} status={ListR[i].status} />);
  }
  function ListSent() {
    return (

      // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      //   <Text>{list1.length}</Text>
      // </View>
      <ScrollView>
        {tmp}
      </ScrollView>
    );
  }

  function ListReceived() {
    return (
      <ScrollView
      // style={{ backgroundColor: '#ffff' }}
      >
        {tmp1}
      </ScrollView>
    );
  }
  const Tab = createMaterialTopTabNavigator();
  function MyTabs() {
    return (
      <Tab.Navigator
        initialRouteName="ListReceived"
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: 'white' },
        }}
      >
        <Tab.Screen
          name="ListReceived"
          component={ListReceived}
          options={{ tabBarLabel: 'ĐÃ NHẬN  ' + ListR.length }}

        />
        <Tab.Screen
          name="ListSent"
          component={ListSent}
          options={{ tabBarLabel: 'ĐÃ GỬI  ' + ListS.length }}
        />

      </Tab.Navigator>
    );
  }


  return (
    <NavigationContainer independent={true}>
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
              onPress={() => { navigation.goBack() }}
            >
              <IconBack style={styles.iconBack} />
            </TouchableOpacity>
            <Text style={styles.title} >Lời mời kết bạn</Text>
          </View>
        </LinearGradient>
      </View>
      <MyTabs />
    </NavigationContainer>


  );
}
const styles = StyleSheet.create({
  input: {
    marginLeft: 10,
  },
  header: {
    width: '100%',
    color: "#fff",
    height: 62,
  },
  iconBack: {
    marginTop: 30,
    left: 10,
  },
  iconBackWrap: {
    width: 40,
    position: "absolute"
  },
  title: {
    marginTop: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#fff',
    fontSize: 18,
  },
  part1: {
    borderBottomWidth: 2,
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    marginBottom: 2,
    paddingBottom: 4,
    borderBottomWidth: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    color: "#fff",
    height: 62,
  },
  chucai: {
    marginLeft: 20,
  },
  Loimoiketban: {
    marginTop: 32,
    marginLeft: 10,
    // fill: green
  },
  iconSearch: {
    marginTop: 4,
    marginLeft: 15,
    // paddingRight: 5,
    // marginRight:10,
  },
  searchWrap: {
    position: "absolute",
    left: 12,
  },
  placeHold: {
    marginTop: 32,
    marginLeft: 25,
    color: "#fff",
    fontSize: 14,
  },
  iconSettingWrap: {
    width: 35,
    position: "absolute",
    right: 0,
  },
  iconSetting: {
    marginTop: 17,
    marginRight: 50,
    marginEnd: 5,
    marginLeft: -30,
  },
});
