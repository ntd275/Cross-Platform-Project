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



export default function App({navigation}) {
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

//   const list1 = [
//     {
//       name: "Sơn Tùng MTP",
//       img: "https://2sao.vietnamnetjsc.vn/images/2021/07/08/16/13/st.jpg",
//     },
//     {
//       name: "Leo Messi",
//       img: "https://scontent.fhan14-1.fna.fbcdn.net/v/t1.6435-9/199385759_345470910277839_3988273979229903886_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=39BV_AnzYYgAX9HpGbf&_nc_ht=scontent.fhan14-1.fna&oh=202d27ef0fca02697c202aacd2c143e7&oe=61B3900F"
//     },
//     {
//       name: "Cristiano Ronaldo",
//       img: "https://scontent.fhan14-1.fna.fbcdn.net/v/t1.6435-9/190108336_322648402555040_2100790391455013605_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=kXE0CTYzxPQAX9RZvZH&_nc_ht=scontent.fhan14-1.fna&oh=c5f2c24981e64650af49d1d6c965f433&oe=61B3ED00"
//     },
//     {
//       name: "Trấn Thành",
//       img: "https://scontent.fhan14-1.fna.fbcdn.net/v/t1.6435-9/180917342_344584213698521_5308351421019265373_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=MhIQQu9YOUsAX-DttgX&_nc_ht=scontent.fhan14-1.fna&oh=74638f0ef922c05a1fd5476256b6d97e&oe=61B60A21"
//     },
//     {
//       name: "Neymar Jr",
//       img: "https://scontent.fhan14-1.fna.fbcdn.net/v/t1.6435-9/157299641_264410915245410_632132461500072208_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=fJuLuDqZkpcAX-rzHT4&_nc_ht=scontent.fhan14-1.fna&oh=cf1898caee079102c344bd0fc66a5c90&oe=61B4DF6C"
//     },
//     {
//       name: "Ngọc Trinh",
//       img: "https://scontent.fhan14-1.fna.fbcdn.net/v/t1.6435-9/80806552_1802048246592648_5426944641696006144_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=ZoY3FDwVMFgAX_3xogw&_nc_oc=AQlQ9NoqYcARZl2x95KI2psmAPZs-vcLWDCF8CVqu3ifgcP9GxZM8g7-AQkKQGcK-QbtanvLi74ykV4NznNmVPf5&_nc_ht=scontent.fhan14-1.fna&oh=cf8c39e7fc855beb3b9f75ab79c6d08c&oe=61B23952"
//     },
//     {
//       name: "Độ Mixi",
//       img: "https://scontent.fhan14-2.fna.fbcdn.net/v/t1.6435-9/151296956_2198779476922608_9064820515933100826_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=174925&_nc_ohc=TzrZGvBVkBkAX_IeMqu&tn=d5LeRVdLTryOw5MC&_nc_ht=scontent.fhan14-2.fna&oh=438b541d1007f515e7cf69a82218b728&oe=61B4FBE2"
//     },
//     {
//       name: "La Phu",
//       img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png"
//     },

//   ]

//   const list2 = [
//     {
//       name: "Nguyễn Thế Tường",
//       img: "https://scontent.fhan3-2.fna.fbcdn.net/v/t39.30808-6/241413022_125192916590605_6458598303746510986_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=9WNM9OkJqmsAX-1l5yF&_nc_ht=scontent.fhan3-2.fna&oh=0253efd8cbe179f11b4a3f73cad66186&oe=6197F515",
//     },
//     {
//       name: "Thủy Quân",
//       img: "https://scontent.fhan3-3.fna.fbcdn.net/v/t39.30808-6/257268411_125828893180209_3382620192621732002_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=HNolMZ_rlCMAX_tPMMt&_nc_ht=scontent.fhan3-3.fna&oh=0add518a881fa6c0b2d3522bca9fcab8&oe=6197856F"
//     },
//     {
//       name: "Tlinh",
//       img: "https://scontent.fhan4-3.fna.fbcdn.net/v/t1.6435-1/p320x320/159867274_113114454174570_5891848019290317339_n.jpg?_nc_cat=103&ccb=1-5&_nc_sid=7206a8&_nc_ohc=zIUtXA__lmwAX9l-sWc&tn=d5LeRVdLTryOw5MC&_nc_ht=scontent.fhan4-3.fna&oh=bdb478f0a2e807dfbfe52e8cccba40e6&oe=61B7E7BE"
//     },
//     {
//       name: "Nhâm Hoàng Kah",
//       img: "https://scontent.fhan3-5.fna.fbcdn.net/v/t1.6435-9/110094262_111070337356179_6141206220175576581_n.jpg?_nc_cat=110&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=3RwbkJ2bTiIAX9yDgGJ&_nc_ht=scontent.fhan3-5.fna&oh=d98b3f602a2da696c89081441f1d09ce&oe=61B9D66E"
//     },
//     {
//       name: "Bác Môn",
//       img: "https://scontent.fhan3-3.fna.fbcdn.net/v/t1.6435-1/s320x320/161210699_102388895276850_5562154680033495070_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=7206a8&_nc_ohc=cIPHIqzehiwAX8HX1ld&_nc_ht=scontent.fhan3-3.fna&oh=06bc7399bf6011f44237f2da2d3fb015&oe=61B6DBCC"
//     },
//     {
//       name: "Ngọc Anh",
//       img: "https://scontent.fhan3-5.fna.fbcdn.net/v/t39.30808-6/241182521_400257455052760_2825545721688670223_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=nhOTFLQO-4EAX8DeL9W&_nc_ht=scontent.fhan3-5.fna&oh=c2632077a6ba2bdfe7aef0a7eb18c795&oe=61975977"
//     },
//     {
//       name: "Ngô Trang",
//       img: "https://scontent.fhan4-3.fna.fbcdn.net/v/t1.6435-1/c0.107.320.320a/p320x320/162192495_179876320609187_4096475874471244693_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=7206a8&_nc_ohc=cIcsbF1g600AX_Rp2I7&_nc_ht=scontent.fhan4-3.fna&oh=8c443f383b730aae8575a4991f7e8315&oe=61B8ECA7"
//     },
//     {
//       name: "Long",
//       img: "https://scontent.fhan3-4.fna.fbcdn.net/v/t39.30808-1/p320x320/242189980_581501463285447_5502115508154574854_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=7206a8&_nc_ohc=2OrmMmms9E8AX-O5hbP&tn=d5LeRVdLTryOw5MC&_nc_ht=scontent.fhan3-4.fna&oh=ea0c4c6e8759ab0f2eac3e8c54588280&oe=61973783"
//     },
//     {
//       name: "TITAN",
//       img: "https://scontent.fhan3-5.fna.fbcdn.net/v/t1.6435-1/p320x320/202205921_1888584467977661_6537798788753969703_n.jpg?_nc_cat=110&ccb=1-5&_nc_sid=7206a8&_nc_ohc=8Cf0pUQhr3cAX8irKQn&_nc_oc=AQlAECnRgxpFF_iDtcOqOe07c2N5wBg5clOAwkGqyhHUXuXYJ3zvsnAVF-vY-Rnw84k&_nc_ht=scontent.fhan3-5.fna&oh=e3e3c9b935a4b45cddeac1aa4e2e3b3e&oe=61B894E0"
//     },
//   ]





  const FriendSent = (props) => {
    return (
      <View
        style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 15 , marginTop: 10, backgroundColor:"white"}}
        onPress={() => {}}
        activeOpacity={0.99999}
        underlayColor="#05adff22"
      >
        <View style={{ flexDirection: "row"}}>
          <Avatar  size="lg" source={{ uri:props.img }} />
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
        <View style = {{flexDirection: 'row'}}>
        <Text style = {{fontSize: 10,borderWidth:0.2,borderRadius: 5, marginTop: 0, padding:10, marginLeft:75}}>Xin chào, tôi là {props.name}</Text>
        </View>
        <View style = {{flexDirection: 'row', }}>
            <TouchableOpacity style = {{borderWidth:0,flexDirection: 'row', borderRadius: 40, padding: 5, marginTop:5,marginLeft:75, backgroundColor: "#3399ff"}}>
              <Text style = {{fontSize:10,color:'white', width: 70, textAlign:'center',fontWeight:'bold'}}>ĐỒNG Ý</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {{borderWidth:0,flexDirection: 'row', borderRadius: 40, padding: 5, marginTop:5,marginLeft:20, backgroundColor:'#e6e6e6'}}>
              <Text style = {{fontSize:10,color:'black', width: 80, textAlign:'center',fontWeight:'bold'}}>TỪ CHỐI</Text>
            </TouchableOpacity>
        </View>
        {/* <Text style = {{borderWidth:1,borderRadius: 5, marginTop: 5, paddingLeft: 10}}>Xin chào tôi là {props.name}</Text> */}
 
      </View>
    );
  };

  const FriendReceived= (props) => {
    return (
      <View
        style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 15 , marginTop: 10, backgroundColor:"white"}}
        onPress={() => {}}
        activeOpacity={0.99999}
        underlayColor="#05adff22"
      >
        <View style={{ flexDirection: "row"}}>
          <Avatar  size="lg" source={{ uri:props.img }} />
    
          <Text
            style={{
              alignSelf: "center",
              marginLeft: 15,
              fontSize: 12,
            
              marginTop:-30
              
            }}
          >
            {props.name}
          </Text>

        </View>
        
        <View style = {{flexDirection: 'row'}}>
        <Text style = {{marginTop:-30,fontSize: 12, marginLeft:80, color:"#a6a6a6"}}>Muốn kết bạn</Text>
        <TouchableOpacity style = {{flexDirection: 'row', borderRadius: 40, borderWidth:0,marginTop:-30,marginBottom:10, padding: 5,marginLeft:40, backgroundColor:'#e6e6e6'}}>
              <Text style = {{fontSize:10,color:'black', width: 80, textAlign:'center',fontWeight:'bold'}}>THU HỒI</Text>
            </TouchableOpacity>
        </View>

        {/* <Text style = {{borderWidth:1,borderRadius: 5, marginTop: 5, paddingLeft: 10}}>Xin chào tôi là {props.name}</Text> */}
        {/* padding: 0, marginTop:-50,marginLeft:35 */}
 
      </View>
    );
  };





  let tmp = [];
  for (let i = 0; i < ListS.length; i++) {
    tmp.push(<FriendReceived key={i} name={ListS[i].receiver.username} img={BaseURL+ListS[i].receiver.avatar.fileName} />);
  }
  let tmp1 = [];
  for (let i = 0; i < ListR.length; i++) {
    tmp1.push(<FriendSent key={i} name={ListR[i].sender.username} img={BaseURL+ListR[i].sender.avatar.fileName} />);
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
    style = {{backgroundColor: '#e6e6e6'}}
    >
    {tmp1}
  </ScrollView>
  );
}
const Tab = createMaterialTopTabNavigator();
function MyTabs (){
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
        options={{ tabBarLabel: 'ĐÃ NHẬN ' + ListR.length}}
        
        
      />
      <Tab.Screen
        name="ListSent"
        component={ListSent}
        options={{ tabBarLabel: 'ĐÃ GỬI ' + ListS.length}}
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
          <View style={{marginLeft : 'auto',marginRight: 15, marginTop:2 }}>
            <SettingIcon style={{height: 28, width: 28}}/>
          </View>
        </View>
      </LinearGradient>
      </View>
      <MyTabs/>
    </NavigationContainer>


  );
}
const styles = StyleSheet.create({
  input:{
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
