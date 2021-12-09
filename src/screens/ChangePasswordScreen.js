import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Pressable, Text, View, StatusBar, Button, ImageBackground, TouchableHighlight, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import IconBack from '../../assets/ic_nav_header_back.svg'
import { TextField } from 'rn-material-ui-textfield';
import { Icon } from 'react-native-elements'
import { Api } from '../api/Api';
import AuthContext from '../components/context/AuthContext';
import AppContext from '../components/context/AppContext';

const minPasswordLength = 6;
const maxPasswordLength = 10;
const ERROR_PHONENUMBER_AND_PASSWORD = "Mật khẩu không được trùng với số điện thoại";

export default function ChangePasswordScreen({ navigation }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isCurrentPasswordVisiable, setCurrentPasswordVisiable] = useState(false);
    const [isPasswordVisiable, setPasswordVisiable] = useState(false);
    const [isConfirmPasswordVisiable, setConfirmPasswordVisiable] = useState(false);
    const [isSubmitEnable, setSubmitEnable] = useState(false);
    const [isShowCurrentPasswordClear, setShowCurrentPasswordClear] = useState(false);
    const [isShowPasswordClear, setShowPasswordClear] = useState(false);
    const [isShowConfirmPasswordClear, setShowConfirmPasswordClear] = useState(false);

    const enableColor = ["#0085ff", "#05adff"];
    const disableColor = ["#c0d3e2", "#c0d3e2"];

    const [currentPasswordError, setCurrentPasswordError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [successNoti, setSuccessNoti] = useState(false);

    useEffect(()=>{
        setSubmitEnable(password !== "" && currentPassword !== "" && confirmPassword !== "" && checkNoneError());
    }, [currentPassword, password, confirmPassword, phoneNumberError, passwordError, confirmPasswordError]);

    checkNoneError = ()=>{
        return (currentPasswordError == "" && passwordError == "" && confirmPasswordError == "");
    }


    onchangeCurrentPassword = (text) => {
        setCurrentPassword(text);
        setShowCurrentPasswordClear(text !== "");
    }

    checkPasswordValid = (password) => {
        let regex  = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if(regex.test(password)){
            setPasswordError("Mật khẩu không được chứa ký tự đặc biệt")
            return false;
        }

        if(password !== "" && password.length < minPasswordLength){
            setPasswordError("Mật khẩu quá ngắn, tối thiểu " + minPasswordLength + " ký tự")
            return false;
        }
        if(password.length > maxPasswordLength){
            setPasswordError("Mật khẩu quá dài, tối đa " + maxPasswordLength +  " ký tự")
            return false;
        }

        if(passwordError !== "" && passwordError !== ERROR_PHONENUMBER_AND_PASSWORD){
            setPasswordError("");
        }
        return true;
    }

    onChangePassword = (text) => {
        setPassword(text);
        setShowPasswordClear(text !== "");

        if (confirmPassword == "" || text == "" || confirmPassword == text) {
            if (confirmPasswordError !== "") {
                setConfirmPasswordError("");
            }
        } else {
            if (confirmPassword !== text) {
                setConfirmPasswordError("Mật khẩu chưa trùng khớp");
            }
        }

        if(checkPasswordValid(text)){
            let isOk = checkPhoneNumberAndPassWordOk(text);
            if(isOk){
                if(passwordError == ERROR_PHONENUMBER_AND_PASSWORD){
                    setPasswordError("");
                }
            }else{
                if(passwordError !== ERROR_PHONENUMBER_AND_PASSWORD){
                    setPasswordError(ERROR_PHONENUMBER_AND_PASSWORD)
                }
            }
        }
    }

    onChangeConfirmPassword = (text) => {
        setConfirmPassword(text);
        setShowConfirmPasswordClear(text !== "");
        if (password == "" || text == "" || password == text) {
            if (confirmPasswordError !== "") {
                setConfirmPasswordError("");
            }
        } else {
            if (password !== text) {
                if (confirmPasswordError == "") {
                    setConfirmPasswordError("Mật khẩu chưa trùng khớp");
                }
            }
        }
    }

    checkPhoneNumberAndPassWordOk = (password) => {
        if (password == "" || appContext.phonenumber !== password) {
            return true;
        }
        return false;
    }

    let currentPasswordClearIcon = isShowCurrentPasswordClear ? <Icon
        name='close'
        type='material'
        color="#93939d"
        size={20}
        onPress={() => onchangeCurrentPassword("")}
    /> : <></>;

    let passwordClearIcon = isShowPasswordClear ? <Icon
        name='close'
        type='material'
        color="#93939d"
        size={20}
        onPress={() => onChangePassword("")}
    /> : <></>;

    let confirPasswordClearIcon = isShowConfirmPasswordClear ? <Icon
        name='close'
        type='material'
        color="#93939d"
        size={20}
        onPress={() => onChangeConfirmPassword("")}
    /> : <></>;

    const authContext = React.useContext(AuthContext);
    const appContext = React.useContext(AppContext);
    const [notification, setNotification] = React.useState(null);

    const changePassword = async () => {
        try {
            let token = authContext.loginState.accessToken;
            const res = await Api.changePassword(token, currentPassword, password);
            if (res.status == 200) {
                setSuccessNoti(true);
                setNotification("Đổi mật khẩu thành công");
                navigation.goBack();
                appContext.displayMessage({
                    message: "Đổi mật khẩu thành công",
                    type: "default",
                    style: { width: 245, marginBottom: 200 },
                    titleStyle: {fontSize: 14},
                    duration: 1900,
                    icon:"success",
                    position: "center",
                    backgroundColor: "#262626",
                });
            }
        } catch(err){
            if (err.response && err.response.status == 401) {
                console.log(err.response.data.message);
                setSuccessNoti(false);
                setNotification("Không thể xác thực đăng nhập");
                return
            } else if (err.response && err.response.status == 400) {
                console.log(err.response.data.message);
                setSuccessNoti(false);
                setNotification("Mật khẩu cũ không chính xác");
                return
            } else if (err.response && err.response.status == 404) {
                console.log(err.response.data.message);
                setSuccessNoti(false);
                setNotification("Tài khoản không hợp lệ");
                return
            }
            console.log(err)
            navigation.navigate("NoConnectionScreen",{message: "Vui lòng kiểm tra kết nối internet và thử lại"})
            return
        }
    }

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
                            <Text style={styles.title} >Đổi mật khẩu</Text>
                        </View>
                    </LinearGradient>
                    <View style={styles.istruction}>
                        <Text>Nhập thông tin để đổi mật khẩu</Text>
                    </View>
                    <View style={{ marginLeft: 18, marginRight: 18 }}>
                        <TextField
                            label='Mật khẩu cũ'
                            labelTextStyle={styles.textFieldLable}
                            fontSize={18}
                            contentInset={{ top: 5, input: 10, right: 48, label: 0 }}
                            tintColor="#5dd6ef"
                            secureTextEntry={!isCurrentPasswordVisiable}
                            value={currentPassword}
                            onChangeText={text => onchangeCurrentPassword(text)}
                            onFocus={() => { if (currentPassword !== "") setShowCurrentPasswordClear(true); }}
                            onSubmitEditing={() => setShowCurrentPasswordClear(false)}
                            onBlur={() => setShowCurrentPasswordClear(false)}
                            error={currentPasswordError}
                        />
                        <View style={{ position: "absolute", top: 25, right: 42 }}>
                            {currentPasswordClearIcon}
                        </View>
                        <View style={{ position: "absolute", top: 5, right: 0 }}>
                            <Pressable onPress={() => { setCurrentPasswordVisiable(!isCurrentPasswordVisiable) }}>
                                <Text style={{ width: 44, height: 60, textAlign: "right", fontSize: 16, color: "#93939d", fontWeight: '500', lineHeight: 60 }}>
                                    {isCurrentPasswordVisiable ? "ẨN" : "HIỆN"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={{ marginLeft: 18, marginRight: 18 }}>
                        <TextField
                            label='Mật khẩu mới'
                            labelTextStyle={styles.textFieldLable}
                            fontSize={18}
                            contentInset={{ top: 5, input: 10, right: 80, label: 0 }}
                            tintColor="#5dd6ef"
                            secureTextEntry={!isPasswordVisiable}
                            value={password}
                            onChangeText={text => onChangePassword(text)}
                            onFocus={() => { if (password !== "") setShowPasswordClear(true); }}
                            onSubmitEditing={() => setShowPasswordClear(false)}
                            onBlur={() => setShowPasswordClear(false)}
                            error={passwordError}
                        />
                        <View style={{ position: "absolute", top: 25, right: 42 }}>
                            {passwordClearIcon}
                        </View>
                        <View style={{ position: "absolute", top: 5, right: 0 }}>
                            <Pressable onPress={() => { setPasswordVisiable(!isPasswordVisiable) }}>
                                <Text style={{ width: 44, height: 60, textAlign: "right", fontSize: 16, color: "#93939d", fontWeight: '500', lineHeight: 60 }}>
                                    {isPasswordVisiable ? "ẨN" : "HIỆN"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={{ marginLeft: 18, marginRight: 18 }}>
                        <TextField
                            label='Xác nhận mật khẩu'
                            labelTextStyle={styles.textFieldLable}
                            fontSize={18}
                            contentInset={{ top: 5, input: 10, right: 80, label: 0 }}
                            tintColor="#5dd6ef"
                            secureTextEntry={!isConfirmPasswordVisiable}
                            value={confirmPassword}
                            onChangeText={text => onChangeConfirmPassword(text)}
                            onFocus={() => { if (password !== "") setShowConfirmPasswordClear(true); }}
                            onSubmitEditing={() => setShowConfirmPasswordClear(false)}
                            onBlur={() => setShowConfirmPasswordClear(false)}
                            error={confirmPasswordError}
                        />
                        <View style={{ position: "absolute", top: 25, right: 42 }}>
                            {confirPasswordClearIcon}
                        </View>
                        <View style={{ position: "absolute", top: 5, right: 0 }}>
                            <Pressable onPress={() => { setConfirmPasswordVisiable(!isConfirmPasswordVisiable) }}>
                                <Text style={{ width: 44, height: 60, textAlign: "right", fontSize: 16, color: "#93939d", fontWeight: '500', lineHeight: 60 }}>
                                    {isConfirmPasswordVisiable ? "ẨN" : "HIỆN"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                    {notification && <View>
                        <Text style={successNoti?styles.notificationSuccessfulText:styles.notificationText}>
                            {notification}
                        </Text>
                    </View>}
                    <View style={{ marginTop: 50 }}>
                        < TouchableHighlight
                            style={styles.wrapRegisterButton}
                            activeOpacity={0.8}
                            underlayColor="#3f3f3f"
                            onPress={changePassword}
                            disabled={!isSubmitEnable}
                        >
                            <LinearGradient
                                colors={isSubmitEnable ? enableColor : disableColor}
                                start={[0, 1]}
                                end={[1, 0]}
                                style={styles.button}
                            >
                                <View style={styles.centerView} >
                                    <Text style={{ color: '#fff', fontWeight: '500' }}>Đổi mật khẩu</Text>
                                </View>
                            </LinearGradient>
                        </TouchableHighlight>
                    </View>
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
    wrapRegisterButton: {
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
    textFieldLable: {
        paddingTop: 3
    },
    notificationText: {
        color: "#f00",
        left: 20,
    },
    notificationSuccessfulText: {
        color: "#0f0",
        left: 20,
    },
});
