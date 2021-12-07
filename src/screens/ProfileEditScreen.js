import React, { useContext, useRef, useState, useEffect } from "react";
import IconImage from "../../assets/ic_photo_grd.svg";
import IconVideo from "../../assets/ic_video_solid_24.svg";
import IconAlbum from "../../assets/ic_album.svg";
import { Avatar, Image as Image2, Divider } from "react-native-elements";
import { Api } from "../api/Api";
import AuthContext from "../components/context/AuthContext";
import { Icon } from 'react-native-elements'
import { TextField } from 'rn-material-ui-textfield';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    TouchableHighlight,
    Pressable,
    FlatList,
    Animated,
    Easing,
    Dimensions,
    StatusBar,
    Alert,
    Button,
    Keyboard
} from "react-native";
import { useKeyboard } from "./components/useKeyboard";
import AppContext from "../components/context/AppContext";
import IconBack from "../../assets/ic_nav_header_back.svg";
import IconBackBlack from "../../assets/ic_nav_header_back_black.svg";
import IconOption from "../../assets/button_option_menu.svg";
import IconOptionBlack from "../../assets/button_option_menu_black.svg";
import IconEdit from "../../assets/ic_edit_solid_24.svg";
import IconCamera from "../../assets/ic_24_camera.svg";
import IconCheck from "../../assets/check.svg";
import IconUnCheck from "../../assets/uncheck.svg";
import { Avatar as Avatar2, Actionsheet, Box } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import RBSheet from "react-native-raw-bottom-sheet";
import ImageView from "react-native-image-viewing";
import * as ImagePicker from "expo-image-picker";
import { BaseURL, MALE, FEMALE, NO_GENDER } from "../utils/Constants";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TimeUtility } from "../utils/TimeUtility"
import HeaderBar from '../screens/components/HeaderBar'
import { opacity } from "styled-system";

const FULL_WIDTH = Dimensions.get("window").width;

export default function ProfileEditScreen({ navigation }) {
    const context = React.useContext(AuthContext);
    const appContext = useContext(AppContext);

    const [needReload, setNeedReload] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [currAvatar, setCurrAvatar] = useState({ uri: BaseURL + appContext.avatar });
    const [needChangeAvatar, setNeedChangeAvatar] = useState(false);

    const getInfo = async () => {
        try {
            const accessToken = context.loginState.accessToken;
            let user = await Api.getMe(accessToken);
            // console.log(user.data)
            appContext.setAvatar(user.data.data.avatar.fileName);
            appContext.setCoverImage(user.data.data.cover_image.fileName);
        } catch (e) {
            console.log(e);
        }
    };

    if (needReload && !isLoading) {
        getInfo();
    }

    const keyBoardHeight = useKeyboard();
    const inputRef = useRef();
    const mode = useRef("image");


    var ListHeader = () => {
        const [name, setName] = useState(null);
        const [gender, setGender] = useState(null);
        const [dob, setDob] = useState(null);

        const [isShowFullNameClear, setShowFullNameClear] = useState(false);
        const [isUpdateEnable, setUpdateEnable] = useState(false);
        const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
        const [hasModify, setHasModify] = useState(false);

        const showDatePicker = () => {
            setDatePickerVisibility(true);
        };

        const hideDatePicker = () => {
            setDatePickerVisibility(false);
        };

        const handleConfirmDatePicker = (date) => {
            setDob(date);
            if (!hasModify) {
                setHasModify(true);
            }
            hideDatePicker();
        };


        const onchangeFullName = (text) => {
            if (!hasModify) {
                setHasModify(true);
            }
            setName(text);
            setShowFullNameClear(text !== "");
        }

        const checkNeedUpdate = () => {
            if (needChangeAvatar) {
                return true;
            }

            if (!hasModify) {
                return false;
            }

            if ((gender !== "male" && gender !== "female") || !dob) {
                return false;
            }

            if (name == context.loginState.userName && gender == appContext.gender && dob.toLocaleDateString() == new Date(appContext.birthday).toLocaleDateString()) {
                return false;
            }

            return true;
        }

        useEffect(() => {
            setUpdateEnable(name !== "" && checkNeedUpdate());
        }, [name, gender, dob]);

        let fullNameClearIcon = isShowFullNameClear ? <Icon
            name='close'
            type='material'
            color="#93939d"
            size={20}
            onPress={() => onchangeFullName("")}
        /> : <></>;


        useEffect(() => {
            setName(context.loginState.userName);
            setGender(appContext.gender);
            setDob(new Date(appContext.birthday));
        }, []);

        const saveUser = async () => {
            try {
                if (name) {
                    let body = {
                        username: name,
                        gender: gender,
                        birthday: dob,
                    }
                    if(needChangeAvatar){
                        body.avatar = "data:image;base64," + currAvatar.base64;
                    }

                    let res = await Api.editUser("lol " + context.loginState.accessToken, body);
                    // console.log(res.data.data);
                    setName(res.data.data.username);
                    setGender(res.data.data.gender);
                    setDob(new Date(res.data.data.birthday));
                    context.dispatch({ type: 'CHANGEUSERNAME', username: res.data.data.username });
                    appContext.setGender(res.data.data.gender);
                    appContext.setBirthday(res.data.data.birthday);
                    appContext.setUserName(res.data.data.username )
                    if(needChangeAvatar){
                        appContext.setAvatar(res.data.data.avatar.fileName)
                    }
                    navigation.goBack();
                    appContext.displayMessage({
                        message: "Đã cập nhật thông tin",
                        type: "default",
                        style: { width: 215, marginBottom: 120 },
                        titleStyle: { fontSize: 14 },
                        duration: 1000,
                        icon: "success",
                        position: "center",
                        backgroundColor: "#262626",
                    });
                    // Alert.alert("Thành công", "Đã cập nhật thông tin", [{ text: "OK" }]);
                } else {
                    appContext.displayMessage({
                        message: "Vui lòng nhập đầy đủ họ tên",
                        type: "default",
                        style: { width: 195, marginBottom: 200 },
                        titleStyle: { fontSize: 14 },
                        duration: 1900,
                        position: "center",
                        backgroundColor: "#262626",
                    });
                    // Alert.alert("Thất bại", "Vui lòng nhập đầy đủ họ tên", [{ text: "OK" }]);
                }
            } catch (err) {
                console.log(err)
                navigation.navigate("NoConnectionScreen", { message: "Vui lòng kiểm tra kết nối internet và thử lại" })
                return
            }
        };

        const onChangeDate = (event, selectedDate) => {
            const currentDate = selectedDate || dob;
            setShowDate(Platform.OS === 'ios');
            setDob(currentDate);
        };

        let inputHeaderStyle = { fontSize: 12, color: "#a0a0a0" };
        let inputHeaderSelectedStyle = { fontSize: 12, color: "#66d9e9" };
        const enableColor = ["#0085ff", "#05adff"];
        const disableColor = ["#c0d3e2", "#c0d3e2"];

        return (
            <>
                <View style={styles.inputContainer}>
                    <View style={{ width: 100, marginTop: 12 }}>
                        <Pressable
                            onPress={() => {
                                Keyboard.dismiss();
                                refAvatarImageOption.current.open()
                            }}
                            style={{ position: "absolute", alignSelf: "center" }}>
                            <Avatar
                                size={86}
                                source={currAvatar}
                                rounded
                            ></Avatar>
                            <IconCamera style={{ position: "absolute", bottom: -8, right: 3 }} />
                        </Pressable>
                    </View>
                    <View flex={1} style={{ marginLeft: 8, marginTop: 4, marginLeft: 12 }}>
                        <View style={{ marginLeft: 4, marginRight: 8 }}>
                            <TextField
                                label='Tên đầy đủ'
                                labelTextStyle={styles.textFieldLable}
                                fontSize={18}
                                contentInset={{ top: 5, input: 10, right: 54 }}
                                tintColor="#5dd6ef"
                                value={name}
                                onChangeText={text => onchangeFullName(text)}
                                onFocus={() => { if (name !== "") setShowFullNameClear(true); }}
                                onSubmitEditing={() => setShowFullNameClear(false)}
                                onBlur={() => setShowFullNameClear(false)}
                            />
                            <View style={{ position: "absolute", top: 26, right: 0 }}>
                                <View style={{ flexDirection: "row" }}>
                                    {fullNameClearIcon}
                                    <IconEdit style={{ marginTop: 2, marginLeft: 6 }} />
                                </View>

                            </View>
                        </View>
                        <View style={{ marginLeft: 4, marginRight: 8, flexDirection: "row", height: 48 }}>
                            <TouchableOpacity style={{ flexDirection: "row", alignSelf: "center" }}
                                onPress={() => {
                                    if (gender !== "male") {
                                        if (!hasModify) {
                                            setHasModify(true);
                                        }
                                        setGender("male");
                                    }
                                }}
                            >
                                {gender == "male" ? <IconCheck /> : <IconUnCheck />}
                                <Text style={{ fontSize: 18, marginLeft: gender == "male" ? 5 : 7, alignSelf: "center" }}>Nam</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ flexDirection: "row", alignSelf: "center", marginLeft: 54 }}
                                onPress={() => {
                                    if (gender !== "female") {
                                        if (!hasModify) {
                                            setHasModify(true);
                                        }
                                        setGender("female");
                                    }
                                }}
                            >
                                {gender == "female" ? <IconCheck /> : <IconUnCheck />}
                                <Text style={{ fontSize: 18, marginLeft: gender == "female" ? 5 : 7, alignSelf: "center" }}>Nữ</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: "#cfd0cf", marginBottom: 12 }}></View>
                        <View style={{ marginLeft: 4, marginRight: 8 }}>

                            <Text style={isDatePickerVisible ? inputHeaderSelectedStyle : inputHeaderStyle}>Ngày sinh</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    Keyboard.dismiss();
                                    setDatePickerVisibility(true);
                                }}
                                style={{ flexDirection: "row" }}
                            >

                                <Text style={{ fontSize: 18, paddingTop: 3, paddingBottom: 10 }}>
                                    {dob ? TimeUtility.dateToDDMMYYYY(dob) : "Chưa có"}
                                </Text>
                                <View style={{ top: 4, right: 0, marginLeft: "auto" }}>
                                    <View style={{ flexDirection: "row" }}>
                                        <IconEdit style={{ marginTop: 2, marginLeft: 6 }} />
                                    </View>

                                </View>
                            </TouchableOpacity>

                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirmDatePicker}
                                onCancel={hideDatePicker}
                                date={dob ? dob : new Date()}
                                confirmTextIOS="Chọn"
                                cancelTextIOS="Huỷ"
                            />
                        </View>

                    </View>
                </View>
                <TouchableHighlight
                    style={styles.wrapButton}
                    activeOpacity={0.8}
                    underlayColor="#3f3f3f"
                    onPress={() => saveUser()}
                    disabled={!isUpdateEnable}
                >

                    <LinearGradient
                        colors={isUpdateEnable ? enableColor : disableColor}
                        start={[0, 1]}
                        end={[1, 0]}
                        style={styles.button
                        }
                    >
                        <View style={styles.centerView} >
                            <Text style={{ color: '#fff', fontWeight: '500' }}>Cập nhật</Text>
                        </View>
                    </LinearGradient>
                </TouchableHighlight>
            </>
        );
    };

    const [iconColor, setIconColor] = useState("white");
    const refCallBack = useRef(() => { });
    const refAvatarImageOption = useRef();

    const changeAvatarPicture = async (mode) => {
        let result;
        if (mode == "camera") {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.5,
                base64: true,
                allowsEditing: true,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                base64: true,
                allowsEditing: true,
            });
        }
        refAvatarImageOption.current.close();
        if (!result.cancelled) {
            try {
                setCurrAvatar(result);
                setNeedChangeAvatar(true);
                // let res = await Api.editUser("lol " + context.loginState.accessToken, {
                //     avatar: "data:image;base64," + result.base64,
                // });
                // console.log(res.data.data.avatar.fileName)
                // appContext.setAvatar(res.data.data.avatar.fileName)
                // Alert.alert("Thành công", "Đã thay đổi ảnh đại diện", [{ text: "OK" }]);
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false}>
                {/* <StatusBar
                backgroundColor="#00000000"
                barStyle={iconColor == "white" ? "light-content" : "dark-content"}
                translucent={true}
            /> */}
                <View style={{ zIndex: 3 }}>
                    <HeaderBar text="Thông tin cá nhân"
                        navigation={navigation} />
                </View>
                <RBSheet
                    ref={refAvatarImageOption}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    closeOnPressBack={true}
                    animationType="fade"
                    height={280}
                    closeDuration={0}
                    onClose={() => refCallBack.current()}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "rgba(0,0,0,0.28)",
                            width: "100%",
                        },
                        container: {
                            marginBottom: 10,
                            width: "95%",
                            alignSelf: "center",
                            backgroundColor: "rgba(255,255,255,0)",
                        },
                        draggableIcon: {
                            opacity: 0,
                        },
                    }}
                >
                    <View
                        style={{
                            justifyContent: "center",
                            flexDirection: "column",
                            height: "100%",
                            width: "100%",
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "rgba(240,240,240,1)",
                                borderTopLeftRadius: 15,
                                borderTopEndRadius: 15,
                                borderBottomRightRadius: 15,
                                borderBottomStartRadius: 15,
                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "400",
                                    color: "#767676",
                                    textAlign: "center",
                                    marginTop: 15,
                                    marginBottom: 10,
                                }}
                            >
                                Ảnh đại diện
                            </Text>
                            <Divider orientation="horizontal" />
                            <TouchableHighlight
                                style={styles.reportOption}
                                onPress={() => {
                                    changeAvatarPicture("camera");
                                }}
                                activeOpacity={0.99}
                                underlayColor="#989898"
                            >
                                <Text style={styles.reportOptionText}>Chụp ảnh mới</Text>
                            </TouchableHighlight>
                            <Divider orientation="horizontal" />
                            <TouchableHighlight
                                style={styles.reportOption}
                                onPress={() => {
                                    changeAvatarPicture("library");
                                }}
                                activeOpacity={0.99}
                                underlayColor="#989898"
                            >
                                <Text style={styles.reportOptionText}>Chọn ảnh từ thư viện</Text>
                            </TouchableHighlight>
                        </View>
                        <TouchableHighlight
                            style={{
                                backgroundColor: "#fff",
                                borderTopLeftRadius: 15,
                                borderTopEndRadius: 15,
                                borderBottomRightRadius: 15,
                                borderBottomStartRadius: 15,
                                justifyContent: "center",
                                alignItems: "center",
                                height: 60,
                                marginTop: 10,
                                marginBottom: 10,
                            }}
                            onPress={() => refAvatarImageOption.current.close()}
                            activeOpacity={0.999}
                            underlayColor="#989898"
                        >
                            <Text style={{ color: "#0085ff", fontWeight: "600", fontSize: 19 }}>
                                Hủy
                            </Text>
                        </TouchableHighlight>
                    </View>
                </RBSheet>
                <ListHeader />
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f6f6f6",
        minHeight: "100%",
        flexDirection: "column",
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
    story: {
        backgroundColor: "#fff",
    },
    createPostArea: {
        backgroundColor: "white",
        marginTop: 10,
        flexDirection: "row",
    },
    avatar: {
        marginLeft: 18,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 9,
    },

    storyImage: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        width: 75,
        height: 100,
        borderRadius: 10,
        borderColor: "#dedede",
        borderWidth: 2,
    },
    mediaArea: {
        flexDirection: "row",
        marginTop: 0,
        backgroundColor: "white",
        height: 43,
    },
    mediaPost: {
        flex: 1,
        flexDirection: "row",
        borderColor: "#dedede",
        borderWidth: 0.5,
        alignItems: "center",
    },
    iconNotice: {
        width: 24,
        height: 24,
        color: "white",
        marginLeft: "auto",
        marginRight: 8,
        marginTop: 2,
    },
    iconNewPost: {
        width: 24,
        height: 24,
        color: "black",
        marginLeft: "auto",
        marginRight: 12,
        marginTop: 2,
    },
    iconBack: {
        width: 20,
        height: 20,
        color: "white",
    },
    iconSearch: {
        width: 24,
        height: 24,
        color: "white",
        marginLeft: 10,
        marginTop: 2,
    },
    iconImage: {
        width: 20,
        height: 20,
        color: "green",
        marginLeft: "auto",
    },
    iconVideo: {
        width: 20,
        height: 20,
        color: "red",
        marginLeft: "auto",
    },
    iconAlbum: {
        width: 20,
        height: 20,
        color: "blue",
        marginLeft: "auto",
    },
    describeText: {
        fontSize: 14,
        paddingLeft: 16,
        paddingRight: 16,
        color: "#778993",
        marginTop: 12,
        marginBottom: 12,
        textAlign: "center",
    },
    reportOption: {
        alignItems: "center",
        justifyContent: "center",
        height: 55,
    },
    reportOptionText: {
        color: "#0085ff",
        fontSize: 20,
        fontWeight: "400",
    },
    infoLabel: {
        fontSize: 20,
    },
    inputInfo: {
        fontSize: 16,
        borderRadius: 5,
        borderWidth: 2,
        padding: 5,
        borderColor: "#ebebeb"
    },
    inputPicker: {
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 40,
        alignSelf: 'center',
        borderRadius: 20,
    },
    wrapButton: {
        width: '50%',
        marginTop: 20,
        alignSelf: 'center',
        borderRadius: 20,
    },
    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        flexDirection: "row",
        paddingLeft: 6,
        paddingRight: 12,
        marginTop: 16,
        backgroundColor: "#fff",
        paddingBottom: 4,
    },
    textFieldLable: {
        paddingTop: 3
    },
});
