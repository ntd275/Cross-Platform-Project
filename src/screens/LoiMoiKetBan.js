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



export default function App({ navigation }) {
  const context = React.useContext(AuthContext);
  const [ListS, setListS] = useState([]);
  const [ListR, setListR] = useState([]);
  const getListS = async () => {
    try {
      const accessToken = context.loginState.accessToken;
      let List = await Api.getListFriendsRequest(accessToken);
      // console.log(friends.data.data.friends);
      // console.log(typeof friends.data.data.friends);
      setListS(Object.values(List.data.data.sentList));
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
      let response = await Api.sendAcceptFriendRequest(accessToken, id);
      if (response.data.success) {
        const newListR = ListR.filter(el => el.sender._id !== id);
        setListR([...newListR]);
      } else {
        console.log(e);
        navigation.navigate("", {
          message: "Kết bạn không thành công",
        });
      }
      // console.log(friends.data.data.friends);
      // console.log(typeof friends.data.data.friends);
      // setListR(Object.values(List.data.data.receivedList));
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
      let response = await Api.sendRejectFriendRequest(accessToken, id);
      if (response.data.success) {
        const newListR = ListR.filter(el => el.sender._id !== id);
        setListR([...newListR]);
      } else {
        console.log(e);
        navigation.navigate("", {
          message: "Hủy kết bạn không thành công",
        });
      }
      // console.log(friends.data.data.friends);
      // console.log(typeof friends.data.data.friends);
      // setListR(Object.values(List.data.data.receivedList));
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
      let response = await Api.sendCancelFriendRequest(accessToken, id);
      if (response.data.success) {
        const newListS = ListS.filter(el => el.receiver._id !== id);
        setListS([...newListS]);
      } else {
        console.log(e);
        navigation.navigate("", {
          message: "Hủy kết bạn không thành công",
        });
      }
      // console.log(friends.data.data.friends);
      // console.log(typeof friends.data.data.friends);
      // setListR(Object.values(List.data.data.receivedList));
    } catch (e) {
      console.log(e);
      navigation.navigate("NoConnectionScreen", {
        message: "Vui lòng kiểm tra kết nối internet và thử lại",
      });
    }
  }



  const getListR = async () => {
    try {
      const accessToken = context.loginState.accessToken;
      let List = await Api.getListFriendsRequest(accessToken);
      // console.log(friends.data.data.friends);
      // console.log(typeof friends.data.data.friends);
      setListR(Object.values(List.data.data.receivedList));
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
    return (
      <View
        style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 15, marginTop: 10, backgroundColor: "white" }}
        onPress={() => { }}
        activeOpacity={0.99999}
        underlayColor="#05adff22"
      >
        <View style={{ flexDirection: "row" }}>
          <Avatar size="lg" source={{ uri: props.img }} />
          <Text
            style={{
              alignSelf: "center",
              marginLeft: 15,
              fontSize: 15,
              fontWeight: 'bold',

            }}
          >
            {props.name}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 10, borderWidth: 0.2, borderRadius: 5, marginTop: 0, padding: 10, marginLeft: 75 }}>Xin chào, tôi là {props.name}</Text>
        </View>
        <View style={{ flexDirection: 'row', }}>
          <TouchableOpacity style={{ borderWidth: 0, flexDirection: 'row', borderRadius: 40, padding: 5, marginTop: 5, marginLeft: 75, backgroundColor: "#3399ff" }} onPress={() => { handleAgreeRequest(props.id) }}>
            <Text style={{ fontSize: 10, color: 'white', width: 70, textAlign: 'center', fontWeight: 'bold' }}>ĐỒNG Ý</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ borderWidth: 0, flexDirection: 'row', borderRadius: 40, padding: 5, marginTop: 5, marginLeft: 20, backgroundColor: '#e6e6e6' }} onPress={() => { handleRejectRequest(props.id) }}>
            <Text style={{ fontSize: 10, color: 'black', width: 80, textAlign: 'center', fontWeight: 'bold' }}>TỪ CHỐI</Text>
          </TouchableOpacity>
        </View>
        {/* <Text style = {{borderWidth:1,borderRadius: 5, marginTop: 5, paddingLeft: 10}}>Xin chào tôi là {props.name}</Text> */}

      </View>
    );
  };

  const FriendReceived = (props) => {
    return (
      <View
        style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 15, marginTop: 10, backgroundColor: "white" }}
        onPress={() => { }}
        activeOpacity={0.99999}
        underlayColor="#05adff22"
      >
        <View style={{ flexDirection: "row" }}>
          <Avatar size="lg" source={{ uri: props.img }} />

          <Text
            style={{
              alignSelf: "center",
              marginLeft: 15,
              fontSize: 12,

              marginTop: -30

            }}
          >
            {props.name}
          </Text>

        </View>

        <View style={{ flexDirection: 'row' }}>
          <Text style={{ marginTop: -30, fontSize: 12, marginLeft: 80, color: "#a6a6a6" }}>Muốn kết bạn</Text>
          <TouchableOpacity style={{ flexDirection: 'row', borderRadius: 40, borderWidth: 0, marginTop: -30, marginBottom: 10, padding: 5, marginLeft: 40, backgroundColor: '#e6e6e6' }} onPress={() => { handleCancelRequest(props.id) }}>
            <Text style={{ fontSize: 10, color: 'black', width: 80, textAlign: 'center', fontWeight: 'bold' }}>THU HỒI</Text>
          </TouchableOpacity>
        </View>

        {/* <Text style = {{borderWidth:1,borderRadius: 5, marginTop: 5, paddingLeft: 10}}>Xin chào tôi là {props.name}</Text> */}
        {/* padding: 0, marginTop:-50,marginLeft:35 */}

      </View>
    );
  };





  let tmp = [];
  for (let i = 0; i < ListS.length; i++) {
    tmp.push(<FriendReceived key={i} name={ListS[i].receiver.username} img={BaseURL + ListS[i].receiver.avatar.fileName} />);
  }
  let tmp1 = [];
  for (let i = 0; i < ListR.length; i++) {
    tmp1.push(<FriendSent key={i} name={ListR[i].sender.username} img={BaseURL + ListR[i].sender.avatar.fileName} />);
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
        style={{ backgroundColor: '#e6e6e6' }}
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
          options={{ tabBarLabel: 'ĐÃ NHẬN ' + ListR.length }}


        />
        <Tab.Screen
          name="ListSent"
          component={ListSent}
          options={{ tabBarLabel: 'ĐÃ GỬI ' + ListS.length }}
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
          <View style={{ flexDirection: "row", marginTop: 28 }}>
            <TouchableOpacity>
              <View style={{ flex: 1 }}>
                <IconSearch style={styles.iconSearch} />
              </View>
            </TouchableOpacity>

            <View style={{ flex: 6 }}>
              <TextInput
                style={styles.input}
                placeholder="Tìm bạn bè, tin nhắn..."
                placeholderTextColor="#fff"
              ></TextInput>
            </View>
            <View style={{ marginLeft: 'auto', marginRight: 15, marginTop: 2 }}>
              <SettingIcon style={{ height: 28, width: 28 }} />
            </View>
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
