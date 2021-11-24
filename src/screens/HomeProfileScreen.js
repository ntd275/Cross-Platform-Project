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
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import IconBack from "../../assets/ic_nav_header_back.svg";
import { TextField } from "rn-material-ui-textfield";
import { Icon } from "react-native-elements";
import { Api } from "../api/Api";
import AuthContext from "../components/context/AuthContext";
import SettingIcon from "../../assets/setting.svg";
import IconSearch from "../../assets/ic_searchbox.svg";
import { Avatar } from "native-base";
import { BaseURL } from "../utils/Constants";
import AppContext from "../components/context/AppContext";
import { AvatarNativeBaseCache } from "./components/ImageCache";

export default function HomeProfileScreen({ navigation }) {
  const appContext = useContext(AppContext);
  const authContext = useContext(AuthContext);
  const [search, setSearch] = useState("");

  return (
    <View>
      <StatusBar
        backgroundColor="#00000000"
        barStyle="light-content"
        translucent={true}
      />
      <View>
        <LinearGradient
          colors={["#0085ff", "#05adff"]}
          start={[0, 1]}
          end={[1, 0]}
          style={styles.header}
        >
          <View style={{ flexDirection: "row", marginTop: 28 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SearchScreen");
              }}
            >
              <View style={{ flex: 1 }}>
                <IconSearch style={styles.iconSearch} />
              </View>
            </TouchableOpacity>

            <View style={{ flex: 6 }}>
              <TextInput
                style={styles.input}
                value={search}
                onTouchStart={() => {
                  navigation.navigate("SearchScreen");
                }}
                placeholder="Tìm bạn bè, tin nhắn, ..."
                placeholderTextColor="#fff"
              ></TextInput>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SettingScreen");
                }}
              >
                <SettingIcon style={styles.iconSetting} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
      <ScrollView>
        <Pressable
          style={{
            backgroundColor: "#fff",
            flexDirection: "row",
            height: 80,
            alignItems: "center",
            paddingLeft: 20,
          }}
          onPress={() => {
            navigation.navigate("ProfileScreen");
          }}
        >
          <AvatarNativeBaseCache
            source={{ uri: BaseURL + appContext.avatar }}
            size={"lg"}
          />
          <View style={{ marginLeft: 20 }}>
            <Text style={{ fontSize: 18 }}>
              {authContext.loginState.userName}
            </Text>
            <Text style={{ color: "#767676", marginTop: 5, fontSize: 16 }}>
              Xem trang cá nhân
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
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
  iconSearch: {
    width: 24,
    height: 24,
    color: "white",
    marginLeft: 10,
    marginTop: 2,
  },
  searchWrap: {
    position: "absolute",
    left: 12,
  },
  placeHold: {
    marginTop: 30,
    marginLeft: 30,
    color: "#fff",
    fontSize: 16,
  },
  iconSettingWrap: {
    width: 35,
    position: "absolute",
    right: 0,
  },
  iconSetting: {
    width: 24,
    height: 24,
    color: "black",
    marginLeft: "auto",
    marginRight: 12,
    marginTop: 2,
  },
});
