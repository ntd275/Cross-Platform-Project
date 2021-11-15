import React, { useState, useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import IconBack from "../../assets/ic_nav_header_back.svg";
import AuthContext from "../components/context/AuthContext";
import { ListItem, Avatar } from "react-native-elements";

export default function ProfileOptionScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false}>
                <View>
                    <StatusBar backgroundColor="#00000000" barStyle="light-content" translucent={true} />

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
                        </View>
                    </LinearGradient>
                </View>
                <View>
                    <ListItem bottomDivider underlayColor="#0085ff"
                              onPress={() => navigation.navigate("ProfileEditScreen")}>
                        <ListItem.Content >
                            <ListItem.Title>Thông tin cá nhân</ListItem.Title>
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
    },
});
