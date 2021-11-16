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
import ChatContext from "../components/context/ChatContext";
import IconSearch from "../../assets/ic_searchbox.svg";
import { ListItem, Avatar } from "react-native-elements";
import IconLogout from "../../assets/ic_logout.svg";
import IconChangePassword from "../../assets/ic_icon_password_on.svg";

export default function ProfileOptionScreen({ navigation }) {
  const { loginState } = React.useContext(AuthContext);

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
            <Text style={styles.title}>{loginState.userName}</Text>
          </View>
        </LinearGradient>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View>
          <ListItem bottomDivider onPress={()=>{navigation.navigate("PersonalInformationScreen")}} underlayColor="#0085ff">
            <ListItem.Content>
              <ListItem.Title>Thông tin</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem bottomDivider onPress={() => {}} underlayColor="#0085ff">
            <ListItem.Content>
              <ListItem.Title>Cập nhật hình đại diện</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem bottomDivider onPress={() => {}} underlayColor="#0085ff">
            <ListItem.Content>
              <ListItem.Title>Cập nhật ảnh bìa</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem bottomDivider onPress={() => {}} underlayColor="#0085ff">
            <ListItem.Content>
              <ListItem.Title>Cập nhật giới thiệu bản thân</ListItem.Title>
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
});
