import React, { useState } from 'react';
import { StyleSheet, Pressable, Text, View, StatusBar, Button, ImageBackground, TouchableHighlight, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import IconBack from '../../assets/ic_nav_header_back.svg'
import { TextField } from 'rn-material-ui-textfield';
import { Icon } from 'react-native-elements'

export default function LoginScreen({ navigation }) {
    fieldRef = React.createRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisiable, setPasswordVisiable] = useState(false);
    const [isLoginEnable, setLoginEnable] = useState(false);
    const [isShowUsernameClear, setShowUsernameClear] = useState(false);
    const [isShowPasswordClear, setShowPasswordClear] = useState(false);

    const enableColor = ["#0085ff", "#05adff"];
    const disableColor = ["#c0d3e2", "#c0d3e2"];

    onChangeUsername = (text) => {
        setUsername(text);
        setLoginEnable(text !== "" && password !== "");
        setShowUsernameClear(text !== "");

    }

    onChangePassword = (text) => {
        setPassword(text);
        setLoginEnable(text !== "" && username !== "");
        setShowPasswordClear(text !== "");

    }

    var usernameClearIcon = isShowUsernameClear ? <Icon
        name='close'
        type='material'
        color="#93939d"
        size={20}
        onPress={() => onChangeUsername("")}
    /> : <></>;

    var passwordClearIcon = isShowPasswordClear ? <Icon
        name='close'
        type='material'
        color="#93939d"
        size={20}
        onPress={() => onChangePassword("")}
    /> : <></>;

    return (
        <View style={styles.container}>
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
                            style={styles.iconBackWrap}
                            onPress={() => { navigation.goBack() }}
                        >
                            <IconBack style={styles.iconBack} />
                        </TouchableOpacity>
                        <Text style={styles.title} >Đăng nhập</Text>
                    </View>
                </LinearGradient>
                <View style={styles.istruction}>
                    <Text>Bạn có thể đăng nhập bằng username</Text>
                </View>
                <View style={{ marginLeft: 18, marginRight: 18 }}>
                    <TextField
                        label='Username'
                        fontSize={18}
                        contentInset={{ top: 16, input: 10, right: 48 }}
                        tintColor="#5dd6ef"
                        value={username}
                        onChangeText={text => onChangeUsername(text)}
                        onFocus={() => { if (username !== "") setShowUsernameClear(true); }}
                        onSubmitEditing={() => setShowUsernameClear(false)}
                    />
                    <View style={{ position: "absolute", top: 38, right: 15 }}>
                        {usernameClearIcon}
                    </View>
                </View>
                <View style={{ marginLeft: 18, marginRight: 18 }}>
                    <TextField
                        label='Mật khẩu'
                        fontSize={18}
                        contentInset={{ top: 10, input: 10, right: 80, label: 0 }}
                        tintColor="#5dd6ef"
                        secureTextEntry={!isPasswordVisiable}
                        value={password}
                        onChangeText={text => onChangePassword(text)}
                        onFocus={() => { if (password !== "") setShowPasswordClear(true); }}
                        onSubmitEditing={() => setShowPasswordClear(false)}
                    />
                    <View style={{ position: "absolute", top: 30, right: 42 }}>
                        {passwordClearIcon}
                    </View>
                    <View style={{ position: "absolute", top: 10, right: 0 }}>
                        <Pressable onPress={()=>{setPasswordVisiable(!isPasswordVisiable)}}>
                            <Text style={{width: 44, height:60, textAlign: "right", fontSize: 16, color: "#93939d", fontWeight: '500', lineHeight: 60 }}>
                                {isPasswordVisiable? "ẨN" : "HIỆN"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
                <View style={{ marginTop: 50 }}>
                    < TouchableHighlight
                        style={styles.wrapLoginButton}
                        activeOpacity={0.8}
                        underlayColor="#3f3f3f"
                        onPress={() => { }}
                        disabled={!isLoginEnable}
                    >
                        <LinearGradient
                            colors={isLoginEnable ? enableColor : disableColor}
                            start={[0, 1]}
                            end={[1, 0]}
                            style={styles.button}
                        >
                            <View style={styles.centerView} >
                                <Text style={{ color: '#fff', fontWeight: '500' }}>Đăng nhập</Text>
                            </View>
                        </LinearGradient>
                    </TouchableHighlight>
                </View>
            </View>
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
    istruction: {
        backgroundColor: "#f9fafc",
        width: "100%",
        height: 40,
        paddingTop: 10,
        paddingLeft: 12,
    },
    button: {
        width: '100%',
        height: 40,
        alignSelf: 'center',
        borderRadius: 20,
    },
    wrapLoginButton: {
        width: '50%',
        marginTop: 'auto',
        alignSelf: 'center',
        borderRadius: 20,
    },
    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
