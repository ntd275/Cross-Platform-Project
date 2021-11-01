import React, { useState, useEffect } from "react";
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
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import IconBack from "../../assets/ic_nav_header_back.svg";
import { TextField } from "rn-material-ui-textfield";
import { Icon } from "react-native-elements";
import { Api } from "../api/Api";
import AuthContext from "../components/context/AuthContext";
import SettingIcon from "../../assets/addfr.svg";
import IconSearch from "../../assets/ic_searchbox.svg";
import Loimoiketban from "../../assets/loimoiketban.svg";
import Danhba from "../../assets/danhba.svg";
import { useLinkProps } from "@react-navigation/native";
import { Avatar, ListItem } from "react-native-elements";
import VideoIcon from "../../assets/ic_video_line_24.svg";
import CallIcon from "../../assets/ic_call_line_24.svg";

const Friend = (props) => {
  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <TouchableOpacity
        style={{
          width: 270,
          flexDirection: "row",
          paddingLeft: 15,
          paddingTop: 10,
          paddingBottom: 10,
          paddingRight: 10,
        }}
      >
        <Avatar size="small" rounded source={{ uri: props.img }} />
        <Text
          style={{
            width: 230,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          {props.name}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          marginLeft: 0,
          marginTop: 7,
        }}
      >
        <TouchableOpacity>
          <CallIcon
            style={{
              marginTop: 12,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <VideoIcon
            style={{
              marginTop: 12,
              marginLeft: 15,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
//////////////////
const ListFr = (props) => {
  if (props.listFr.length == 0) {
    return (
      <Text
        style={{
          marginBottom: 10,
          marginLeft: 63,
        }}
      >
        (Không có)
      </Text>
    );
  }
  let tmp = [];
  data = props.listFr;
  for(let i = 0; i<data.length; i++){
    tmp.push(<Friend key = {i} name={data[i].name} img={data[i].img} />)
  }

  return (
    // <FlatList
    //   data={props.listFr}
    //   renderItem={({ item }) => <Friend name={item.name} img={item.img} />}
    //   keyExtractor={(item, index) => index.toString()}
    // />
    <ScrollView>{tmp}</ScrollView>
  );
};

const ListFr1 = (props) => {
  if (props.listFr.length == 0) {
    return <View></View>;
  }
  let tmp = [];
  data = props.listFr;
  for(let i = 0; i<data.length; i++){
    tmp.push(<Friend key = {i} name={data[i].name} img={data[i].img} />)
  }


  return (
    <View>
      <Text style={{ marginLeft: 20 }}>{props.chucai}</Text>
      <ScrollView key={(item, index) => index.toString()}>{tmp}</ScrollView>
      {/* <FlatList
        data={props.listFr}
        renderItem={({ item }) => <Friend name={item.name} img={item.img} />}
        keyExtractor={(item, index) => index.toString()}
      /> */}
    </View>
  );
};

const ChuCai = (props) => {
  if (props.listFr.length == 0) {
    return;
  }
  return (
    <View>
      <Text>{props.chucai}</Text>
      <ListFr listFr={props.listFr} />
    </View>
  );
};

const ListDanhBa = (props) => {
  let myArr = props.listFr;

  if (myArr.length == 0) {
    return (
      <Text
        style={{
          marginBottom: 10,
          marginLeft: 63,
        }}
      >
        (Không có)
      </Text>
    );
  }
  function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
    str = str.replace(/\u02C6|\u0306|\u031B/g, "");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
  }

  myArr.forEach(function (val, index) {
    val.name = val.name.trim();
  });
  myArr.sort((a, b) => +(a.name > b.name) || -(a.name < b.name));
  let a = [];
  let b = [];
  let c = [];
  let d = [];
  let e = [];
  let f = [];
  let g = [];
  let h = [];
  let ii = [];
  let j = [];
  let k = [];
  let l = [];
  let m = [];
  let n = [];
  let o = [];
  let p = [];
  let q = [];
  let r = [];
  let s = [];
  let t = [];
  let u = [];
  let v = [];
  let w = [];
  let x = [];
  let y = [];
  let z = [];
  let other = [];

  for (var i = 0; i < myArr.length; i++) {
    let tmp = removeVietnameseTones(myArr[i].name.toLowerCase())[0];
    if (tmp == "a") {
      a.push(myArr[i]);
      continue;
    }
    if (tmp == "b") {
      b.push(myArr[i]);
      continue;
    }
    if (tmp == "c") {
      c.push(myArr[i]);
      continue;
    }
    if (tmp == "d") {
      d.push(myArr[i]);
      continue;
    }
    if (tmp == "e") {
      e.push(myArr[i]);
      continue;
    }
    if (tmp == "f") {
      f.push(myArr[i]);
      continue;
    }
    if (tmp == "g") {
      g.push(myArr[i]);
      continue;
    }
    if (tmp == "h") {
      h.push(myArr[i]);
      continue;
    }
    if (tmp == "i") {
      ii.push(myArr[i]);
      continue;
    }
    if (tmp == "j") {
      j.push(myArr[i]);
      continue;
    }
    if (tmp == "k") {
      k.push(myArr[i]);
      continue;
    }
    if (tmp == "l") {
      l.push(myArr[i]);
      continue;
    }
    if (tmp == "m") {
      m.push(myArr[i]);
      continue;
    }
    if (tmp == "n") {
      n.push(myArr[i]);
      continue;
    }
    if (tmp == "o") {
      o.push(myArr[i]);
      continue;
    }
    if (tmp == "p") {
      p.push(myArr[i]);
      continue;
    }
    if (tmp == "q") {
      q.push(myArr[i]);
      continue;
    }
    if (tmp == "r") {
      r.push(myArr[i]);
      continue;
    }
    if (tmp == "s") {
      s.push(myArr[i]);
      continue;
    }
    if (tmp === "t") {
      t.push(myArr[i]);
      continue;
    }
    if (tmp == "u") {
      u.push(myArr[i]);
      continue;
    }
    if (tmp == "v") {
      v.push(myArr[i]);
      continue;
    }
    if (tmp == "w") {
      w.push(myArr[i]);
      continue;
    }
    if (tmp == "x") {
      x.push(myArr[i]);
      continue;
    }
    if (tmp == "y") {
      y.push(myArr[i]);
      continue;
    }
    if (tmp == "z") {
      z.push(myArr[i]);
      continue;
    }
    other.push(myArr[i]);
  }
  return (
    <View>
      <View>
        <ListFr1 chucai="A" listFr={a} />
        <ListFr1 chucai="B" listFr={b} />
        <ListFr1 chucai="C" listFr={c} />
        <ListFr1 chucai="D" listFr={d} />
        <ListFr1 chucai="E" listFr={e} />
        <ListFr1 chucai="F" listFr={f} />
        <ListFr1 chucai="G" listFr={g} />
        <ListFr1 chucai="H" listFr={h} />
        <ListFr1 chucai="I" listFr={ii} />
        <ListFr1 chucai="J" listFr={j} />
        <ListFr1 chucai="K" listFr={k} />
        <ListFr1 chucai="L" listFr={l} />
        <ListFr1 chucai="M" listFr={m} />
        <ListFr1 chucai="N" listFr={n} />
        <ListFr1 chucai="O" listFr={o} />
        <ListFr1 chucai="P" listFr={p} />
        <ListFr1 chucai="Q" listFr={q} />
        <ListFr1 chucai="R" listFr={r} />
        <ListFr1 chucai="S" listFr={s} />
        <ListFr1 chucai="T" listFr={t} />
        <ListFr1 chucai="U" listFr={u} />
        <ListFr1 chucai="W" listFr={w} />
        <ListFr1 chucai="X" listFr={x} />
        <ListFr1 chucai="Y" listFr={y} />
        <ListFr1 chucai="Z" listFr={z} />
        <ListFr1 chucai="Other" listFr={other} />
      </View>
    </View>
  );
};

export default function HomeContactScreen({ navigation }) {
  test = [
    {
      name: "Nguyen Van Nam",
      img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
    },
    {
      name: "Xuân Hạ Thu Đông",
      img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
    },
  ];
  listFriend = [
    {
      name: "Phan ",
      img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
    },
    {
      name: "tùng Dương",
      img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
    },
    {
      name: "qê Na",
      img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
    },
    {
      name: "Thùy Trang",
      img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
    },
    {
      name: "Thùy Trang",
      img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
    },
    {
      name: "Tùng Dương",
      img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
    },
    {
      name: "Lê Na",
      img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
    },
    {
      name: "Thùy Trang",
      img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
    },
    {
      name: "**Thùy Trang",
      img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
    },
    {
      name: "Tùng Dương",
      img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
    },
    {
      name: "Lê Na",
      img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
    },
    {
      name: "La Phu",
      img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
    },

    {
      name: "Ta Trang",
      img: "https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png",
    },
  ];
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
              activeOpacity={1}
              style={styles.searchWrap}
              onPress={() => {}}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <IconSearch style={styles.iconSearch} />
                <Text style={styles.placeHold}>Tìm bạn bè, tin nhắn...</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconSettingWrap} onPress={() => {}}>
              <SettingIcon style={styles.iconSetting} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
      <ScrollView >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            borderBottomWidth: 0.5,
            borderBottomColor: "lightgray",
          }}
        >
          <TouchableOpacity>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 13,
                paddingTop: 10,
                paddingLeft: 19,
                paddingBottom: 10,
              }}
            >
              DANH BẠ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 13,
                paddingTop: 10,
                paddingLeft: 36,
                paddingBottom: 10,
              }}
            >
              OFFICIAL ACCOUNT
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 13,
                paddingTop: 10,
                paddingLeft: 36,
                paddingBottom: 10,
              }}
            >
              NHÓM
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.part1}>
          <TouchableOpacity style={{ flex: 1, flexDirection: "row" }}>
            <Loimoiketban
              style={{
                fill: "#05adff",
                paddingLeft: 40,
                marginLeft: 20,
                marginTop: 4,
              }}
            />
            <Text
              style={{
                fontSize: 15,
                paddingLeft: 5,
                marginLeft: 10,
                marginTop: 17,
              }}
            >
              Lời mời kết bạn
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 1, flexDirection: "row" }}>
            <Danhba
              style={{
                fill: "green",
                paddingLeft: 40,
                marginLeft: 17,
                marginTop: 10,
              }}
            />
            <Text
              style={{
                fontSize: 15,
                paddingLeft: 0,
                marginLeft: 10,
                marginTop: 25,
              }}
            >
              Bạn từ danh bạ máy
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View
          style={{
            borderBottomColor: "lightgray",
            borderBottomWidth: 10,
          }}
        >
          <Text
            style={{
              paddingLeft: 15,
              fontWeight: "bold",
            }}
          >
            Bạn bè mới truy cập
          </Text>
          <View>
            <ListFr listFr={test} />
          </View>
        </View> */}
        <View>
          <Text
            style={{
              paddingLeft: 15,
              fontWeight: "bold",
            }}
          >
            Tất cả danh bạ
          </Text>
          <ListDanhBa listFr={listFriend} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 32,
    marginLeft: 10,
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
