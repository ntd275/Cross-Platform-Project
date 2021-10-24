import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Pressable, Text, View, StatusBar, Button, ImageBackground, TouchableHighlight, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import IconBack from '../../assets/ic_nav_header_back.svg'
import { TextField } from 'rn-material-ui-textfield';
import { Icon } from 'react-native-elements'
import { Api } from '../api/Api';
import AuthContext from '../components/context/AuthContext';

const minPasswordLength = 6;
const maxPasswordLength = 10;
const ERROR_PHONENUMBER_AND_PASSWORD = "Mật khẩu không được trùng với số điện thoại";

export default function RegisterScreen({ navigation }) {
    const [phonenumber, setPhonenumber] = useState("");
    const [fullname, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVisiable, setPasswordVisiable] = useState(false);
    const [isConfirmPasswordVisiable, setConfirmPasswordVisiable] = useState(false);
    const [isRegisterEnable, setRegisterEnable] = useState(false);
    const [isShowPhonenumberClear, setShowPhonenumberClear] = useState(false);
    const [isShowFullNameClear, setShowFullNameClear] = useState(false);
    const [isShowPasswordClear, setShowPasswordClear] = useState(false);
    const [isShowConfirmPasswordClear, setShowConfirmPasswordClear] = useState(false);

 

    const enableColor = ["#0085ff", "#05adff"];
    const disableColor = ["#c0d3e2", "#c0d3e2"];

    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");

    useEffect(()=>{
        setRegisterEnable(password !== "" && phonenumber !== "" && fullname !== "" && confirmPassword !== "" && checkNoneError());
    }, [phonenumber, fullname, password, confirmPassword, phoneNumberError, passwordError, confirmPasswordError]);

    checkNoneError = ()=>{
        return (phoneNumberError == "" && passwordError == "" && confirmPasswordError == "");
    }

    onchangePhonenumber = (text) => {
        setPhonenumber(text);
        setShowPhonenumberClear(text !== "");

        if(checkPhoneNumberValid(text)){
            if(phoneNumberError !== ""){
                setPhoneNumberError("");
            }
        }else{
            if(phoneNumberError == ""){
                setPhoneNumberError("Số điện thoại chưa đúng định dạng");
            }
        }

        if(checkPhoneNumberAndPassWordOk(text, password)){
            if(passwordError == ERROR_PHONENUMBER_AND_PASSWORD){
                setPasswordError("");
            }
        }else{
            if(passwordError == ""){
                setPasswordError(ERROR_PHONENUMBER_AND_PASSWORD);
            }
        }
      
    }


    onchangeFullName = (text) => {
        setFullName(text);
        setShowFullNameClear(text !== "");
    }

    checkPasswordValid = (password)=>{
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

    checkPhoneNumberValid = (phonenumber)=>{
        let regex = /(^(09|03|07|08|05|02)([0-9]{8}$))/g;
        if(phonenumber == "" || regex.test(phonenumber)){
            return true;
        }
        return false;
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
            let isOk = checkPhoneNumberAndPassWordOk(phonenumber, text);
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

    checkPhoneNumberAndPassWordOk = (phonenumber, password) => {
        if (phonenumber == "" || password == "" || phonenumber !== password) {
            return true;
        }
        return false;
    }
    let phonenumberClearIcon = isShowPhonenumberClear ? <Icon
        name='close'
        type='material'
        color="#93939d"
        size={20}
        onPress={() => onchangePhonenumber("")}
    /> : <></>;

    let fullNameClearIcon = isShowFullNameClear ? <Icon
        name='close'
        type='material'
        color="#93939d"
        size={20}
        onPress={() => onchangeFullName("")}
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

    const authContext = React.useContext(AuthContext)
    const [notification, setNotification] = React.useState(null)

    const register = async () => {
        try {
            const res = await Api.register(phonenumber,password,fullname)
            authContext.dispatch({type: 'LOGIN',accessToken: res.data.token, username: res.data.data.username})
        } catch(err){
            if (err.response && err.response.status == 400) {
                console.log(err.response.data.message)
                setNotification("Số điện thoại đăng ký đã tồn tại")
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
                            <Text style={styles.title} >Tạo tài khoản</Text>
                        </View>
                    </LinearGradient>
                    <View style={styles.istruction}>
                        <Text>Nhập thông tin của bạn để tạo tài khoản mới</Text>
                    </View>
                    <View style={{ marginLeft: 18, marginRight: 18 }}>
                        <TextField
                            label='Số điện thoại'
                            labelTextStyle={styles.textFieldLable}
                            fontSize={18}
                            contentInset={{ top: 16, input: 10, right: 48 }}
                            tintColor="#5dd6ef"
                            value={phonenumber}
                            onChangeText={text => onchangePhonenumber(text)}
                            onFocus={() => { if (phonenumber !== "") setShowPhonenumberClear(true); }}
                            onSubmitEditing={() => setShowPhonenumberClear(false)}
                            onBlur={() => setShowPhonenumberClear(false)}
                            keyboardType="number-pad"
                            error={phoneNumberError}
                        />
                        <View style={{ position: "absolute", top: 38, right: 15 }}>
                            {phonenumberClearIcon}
                        </View>
                    </View>
                    <View style={{ marginLeft: 18, marginRight: 18 }}>
                        <TextField
                            label='Tên đầy đủ'
                            labelTextStyle={styles.textFieldLable}
                            fontSize={18}
                            contentInset={{ top: 5, input: 10, right: 48 }}
                            tintColor="#5dd6ef"
                            value={fullname}
                            onChangeText={text => onchangeFullName(text)}
                            onFocus={() => { if (fullname !== "") setShowFullNameClear(true); }}
                            onSubmitEditing={() => setShowFullNameClear(false)}
                            onBlur={() => setShowFullNameClear(false)}
                        />
                        <View style={{ position: "absolute", top: 33, right: 15 }}>
                            {fullNameClearIcon}
                        </View>
                    </View>
                    <View style={{ marginLeft: 18, marginRight: 18 }}>
                        <TextField
                            label='Mật khẩu'
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
                        <Text style={styles.notificationText}>{notification}</Text>
                    </View>}
                    <View style={{ marginTop: 50 }}>
                        < TouchableHighlight
                            style={styles.wrapRegisterButton}
                            activeOpacity={0.8}
                            underlayColor="#3f3f3f"
                            onPress={register}
                            disabled={!isRegisterEnable}
                        >
                            <LinearGradient
                                colors={isRegisterEnable ? enableColor : disableColor}
                                start={[0, 1]}
                                end={[1, 0]}
                                style={styles.button}
                            >
                                <View style={styles.centerView} >
                                    <Text style={{ color: '#fff', fontWeight: '500' }}>Đăng ký</Text>
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
});
