import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Pressable, Text, View, StatusBar, Button, ImageBackground, TouchableHighlight, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import IconBack from '../../assets/ic_nav_header_back.svg'
import { TextField } from 'rn-material-ui-textfield';
import { Icon } from 'react-native-elements';
import { Api } from '../api/Api'
import AuthContext from '../components/context/AuthContext';
import SettingIcon from '../../assets/setting.svg'
import IconSearch from '../../assets/ic_searchbox.svg'

export default function HomeProfileScreen({ navigation }) {

    return (
        <View style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false}>
                <View>
                    <StatusBar
                        backgroundColor="blue"
                        barStyle="light-content"
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
                            <TouchableOpacity
                                style={styles.iconSettingWrap}
                                onPress={() => { navigation.navigate("SettingScreen") }}
                            >
                                <SettingIcon style={styles.iconSetting} />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        width: '100%',
        color: "#fff",
        height: 62,
    },
    iconSearch: {
        marginTop: 32,
    },
    searchWrap: {
        position: "absolute",
        left: 12,
    },
    placeHold: {
        marginTop: 30,
        marginLeft: 30,
        color: '#fff',
        fontSize: 16,
    },
    iconSettingWrap: {
        width: 35,
        position: "absolute",
        right: 0,
    },
    iconSetting: {
        marginTop: 28,
    }
});
