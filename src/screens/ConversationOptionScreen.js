import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Pressable, Text, View, StatusBar, Button, ImageBackground, TouchableHighlight, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import IconBack from '../../assets/ic_nav_header_back.svg'
import { TextField } from 'rn-material-ui-textfield';
import { Icon } from 'react-native-elements';
import { Api } from '../api/Api'
import AuthContext from '../components/context/AuthContext';


const minPasswordLength = 6;
const maxPasswordLength = 10;
const ERROR_PHONENUMBER_AND_PASSWORD = "Mật khẩu không được trùng với số điện thoại";

export default function ConversationOptionScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false}>
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
                            <Text style={styles.title} >Tuỳ Chọn</Text>
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
});
