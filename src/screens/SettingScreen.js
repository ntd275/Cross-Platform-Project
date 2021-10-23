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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import IconBack from "../../assets/ic_nav_header_back.svg";
import { TextField } from "rn-material-ui-textfield";
import { Icon } from "react-native-elements";
import { Api } from "../api/Api";
import AuthContext from "../components/context/AuthContext";
import IconSearch from "../../assets/ic_searchbox.svg";
import { ListItem, Avatar } from "react-native-elements";
import IconLogout from "../../assets/ic_logout.svg"

export default function SettingScreen({ navigation }) {
  const {dispatch} = React.useContext(AuthContext)
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false}>
        <View>
          <StatusBar backgroundColor="blue" barStyle="light-content" />

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
              <Text style={styles.title}>Cài đặt</Text>
              <TouchableOpacity
                style={styles.iconSearchWrap}
                onPress={() => {}}
              >
                <IconSearch style={styles.iconSearch} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        <View>
          <ListItem bottomDivider onPress={logout} underlayColor="#0085ff">
            <Avatar Component={IconLogout}/>
            <ListItem.Content >
              <ListItem.Title>Đăng xuất</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6"
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
  }
});
