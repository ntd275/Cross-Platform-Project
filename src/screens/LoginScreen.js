import React, { useState } from 'react';
import { StyleSheet, Pressable, Text, View, StatusBar, Button, ImageBackground, TouchableHighlight, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import IconBack from '../../assets/ic_nav_header_back.svg'
import { TextField } from 'rn-material-ui-textfield';
import { Icon } from 'react-native-elements';
import {Api} from '../api/Api'
import AuthContext from '../components/context/AuthContext';

export default function LoginScreen({ navigation }) {
    fieldRef = React.createRef();

    const [phonenumber, setPhonenumber] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisiable, setPasswordVisiable] = useState(false);
    const [isLoginEnable, setLoginEnable] = useState(false);
    const [isShowPhonenumberClear, setShowPhonenumberClear] = useState(false);
    const [isShowPasswordClear, setShowPasswordClear] = useState(false);

    const enableColor = ["#0085ff", "#05adff"];
    const disableColor = ["#c0d3e2", "#c0d3e2"];

    onchangePhonenumber = (text) => {
        setPhonenumber(text);
        setLoginEnable(text !== "" && password !== "");
        setShowPhonenumberClear(text !== "");

    }

    onChangePassword = (text) => {
        setPassword(text);
        setLoginEnable(text !== "" && phonenumber !== "");
        setShowPasswordClear(text !== "");

    }

    var phonenumberClearIcon = isShowPhonenumberClear ? <Icon
        name='close'
        type='material'
        color="#93939d"
        size={20}
        onPress={() => onchangePhonenumber("")}
    /> : <></>;

    var passwordClearIcon = isShowPasswordClear ? <Icon
        name='close'
        type='material'
        color="#93939d"
        size={20}
        onPress={() => onChangePassword("")}
    /> : <></>;

    const context = React.useContext(AuthContext)
    const [notification, setNotification] = React.useState(null)

    const login = async () => {
        try {
            const res = await Api.login(phonenumber,password)
            context.dispatch({type: 'LOGIN', accessToken: res.data.token, username: res.data.username})
            setNotification(null)
        } catch (err) {
            if (err.response && err.response.status == 400){
                console.log(err.response.data.message)
                setNotification("Số điện thoại hoặc mật khẩu không chính xác")
                return
            }
            console.log(err)
        }
    }

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
                    <Text>Bạn có thể đăng nhập bằng số điện thoại</Text>
                </View>
                <View style={{ marginLeft: 18, marginRight: 18 }}>
                    <TextField
                        label='Số điện thoại'
                        labelTextStyle={styles.textFieldLable }
                        fontSize={18}
                        contentInset={{ top: 16, input: 10, right: 48 }}
                        tintColor="#5dd6ef"
                        value={phonenumber}
                        onChangeText={text => onchangePhonenumber(text)}
                        onFocus={() => { if (phonenumber !== "") setShowPhonenumberClear(true); }}
                        onSubmitEditing={() => setShowPhonenumberClear(false)}
                        keyboardType="number-pad"
                    />
                    <View style={{ position: "absolute", top: 38, right: 15 }}>
                        {phonenumberClearIcon}
                    </View>
                </View>
                <View style={{ marginLeft: 18, marginRight: 18 }}>
                    <TextField
                        label='Mật khẩu'
                        labelTextStyle={styles.textFieldLable}
                        fontSize={18}
                        contentInset={{ top: 10, input: 10, right: 80}}
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
                {notification && <View>
                    <Text style={styles.notificationText}>{notification}</Text>
                </View>}
                <View style={{ marginTop: 30 }}>
                    < TouchableHighlight
                        style={styles.wrapLoginButton}
                        activeOpacity={0.8}
                        underlayColor="#3f3f3f"
                        onPress={login}
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
    notificationText: {
        color : "#f00",
        left: 20,
    },
    textFieldLable: {
        paddingTop: 3
    }
});
