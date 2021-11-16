import React, { useContext, useRef, useState } from "react";
import IconImage from "../../assets/ic_photo_grd.svg";
import IconVideo from "../../assets/ic_video_solid_24.svg";
import IconAlbum from "../../assets/ic_album.svg";
import { Avatar, Image as Image2, Divider } from "react-native-elements";
import { Api } from "../api/Api";
import AuthContext from "../components/context/AuthContext";
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
    Button
} from "react-native";
import { useKeyboard } from "./components/useKeyboard";
import AppContext from "../components/context/AppContext";
import IconBack from "../../assets/ic_nav_header_back.svg";
import IconBackBlack from "../../assets/ic_nav_header_back_black.svg";
import IconOption from "../../assets/button_option_menu.svg";
import IconOptionBlack from "../../assets/button_option_menu_black.svg";
import IconEdit from "../../assets/ic_profile_edit_bio.svg";
import { Avatar as Avatar2, Actionsheet, Box } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import IconImageSolid from "../../assets/ic_photo_solidhollow_24.svg";
import IconVideoSolid from "../../assets/ic_video_solid_24_white.svg";
import RBSheet from "react-native-raw-bottom-sheet";
import ImageView from "react-native-image-viewing";
import * as ImagePicker from "expo-image-picker";
import { BaseURL, MALE, FEMALE } from "../utils/Constants";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TimeUtility } from "../utils/TimeUtility"
import HeaderBar from '../screens/components/HeaderBar'

const FULL_WIDTH = Dimensions.get("window").width;

export default function ProfileEditScreen({ navigation }) {
    const context = React.useContext(AuthContext);
    const appContext = useContext(AppContext);

    const [needReload, setNeedReload] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const getInfo = async () => {
        try {
            const accessToken = "lol " + context.loginState.accessToken;
            let user = await Api.getMe(accessToken);
            //console.log(user.data)
            appContext.setAvatar(user.data.data.avatar.fileName);
            appContext.setCoverImage(user.data.data.cover_image.fileName);
        } catch (e) {
            console.log(e);
        }
    };

    let opacity = useRef(new Animated.Value(0));

    if (needReload && !isLoading) {
        getInfo();
    }

    const keyBoardHeight = useKeyboard();
    const inputRef = useRef();
    const mode = useRef("image");
    var LoadingHeader = () => {
        return (
            <Animated.View style={{ height: opacity.current }}>
                <Image
                    source={require("../../assets/loading.gif")}
                    style={{ alignSelf: "center", marginTop: 10 }}
                />
                <Text style={styles.describeText}>
                    Đang tải dữ liệu, chờ chút thôi ...
                </Text>
            </Animated.View>
        );
    };

    const refCoverImageOption = useRef();
    const [isViewCoverImage, setIsViewCoverImage] = useState(false);

    var ListHeader = () => {
        const [name, setName] = useState(context.loginState.userName.slice());
        const [gender, setGender] = useState(MALE);
        const [dob, setDob] = useState(new Date());
        const [showDate, setShowDate] = useState(false);

        const onChangeDate = (event, selectedDate) => {
            const currentDate = selectedDate || dob;
            setShowDate(Platform.OS === 'ios');
            setDob(currentDate);
        };

        return (
            <>
                {LoadingHeader()}
                <View style={{ position: "relative" }}>
                    <Image2
                        style={{ width: FULL_WIDTH, height: 200 }}
                        source={{ uri: BaseURL + appContext.coverImage }}
                        onPress={() => refCoverImageOption.current.open()}
                    ></Image2>
                    <View style={{ alignItems: "center", backgroundColor: "#fff" }}>
                        <Text style={{ fontSize: 26, fontWeight: "500", marginTop: 50 }}>
                            {context.loginState.userName}
                        </Text>
                    </View>
                    <Pressable onPress={() => refAvatarImageOption.current.open()} style={{ position: "absolute", alignSelf: "center", top: 120 }}>
                        <Avatar2
                            size={"2xl"}
                            source={{ uri: BaseURL + appContext.avatar }}
                            style={{ borderWidth: 2, borderColor: "#fff" }}
                        ></Avatar2>
                    </Pressable>
                </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps='handled'
                    style={styles.infoForm}
                >
                    <Text style={styles.infoLabel}>Họ tên:</Text>
                    <TextInput style={styles.inputInfo}
                        placeholder="Nhập tên..."
                        value={name}
                        onChangeText={text => setName(text)}
                    />
                    <Text style={styles.infoLabel}>Giới tính:</Text>
                    <View style={styles.inputInfo}>
                        <Picker
                            selectedValue={gender}
                            onValueChange={(itemValue, itemIndex) =>
                                setGender(itemValue)
                            }>
                            <Picker.Item style={styles.inputPicker}
                                label="Nam" value={MALE} />
                            <Picker.Item style={styles.inputPicker}
                                label="Nữ" value={FEMALE} />
                        </Picker>
                    </View>
                    <Text style={styles.infoLabel}>Ngày sinh:</Text>
                    <View style={styles.inputInfo}>
                        <Pressable onPress={() => setShowDate(true)}>
                            <Text style={styles.inputPicker}>
                                {TimeUtility.dateToDDMMYYYY(dob)}
                            </Text>
                        </Pressable>
                    </View>
                    <View>
                        {showDate && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={dob}
                                mode="date"
                                display="default"
                                onChange={onChangeDate}
                            />
                        )}
                    </View>
                    <TouchableHighlight
                        style={styles.wrapButton}
                        activeOpacity={0.8}
                        underlayColor="#3f3f3f"
                    >
                        <LinearGradient
                            colors={["#0085ff", "#05adff"]}
                            start={[0, 1]}
                            end={[1, 0]}
                            style={styles.button}
                        >
                            <View style={styles.centerView} >
                                <Text style={{color: '#fff', fontWeight: '500'}}>
                                    Lưu
                                </Text>
                            </View>
                        </LinearGradient>
                    </TouchableHighlight>
                </ScrollView>
            </>
        );
    };

    const offset = useRef(new Animated.Value(0)).current;
    const opacityOnScroll = offset.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    opacityOnScroll.addListener((e) => {
        if (e.value == 1 && iconColor == "white") setIconColor("black");
        if (e.value < 1 && iconColor == "black") setIconColor("white");
    });

    const [iconColor, setIconColor] = useState("white");
    const refCallBack = useRef(() => { });

    const changeCoverPicture = async (mode) => {
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
        refCoverImageOption.current.close();
        if (!result.cancelled) {
            try {
                let res = await Api.editUser("lol " + context.loginState.accessToken, {
                    cover_image: "data:image;base64," + result.base64,
                });
                console.log(res.data.data.cover_image.fileName)
                appContext.setCoverImage(res.data.data.cover_image.fileName)
                Alert.alert("Thành công", "Đã thay đổi ảnh bìa", [{ text: "OK" }]);

            } catch (e) {
                console.log(e);
            }
        }
    };

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
                let res = await Api.editUser("lol " + context.loginState.accessToken, {
                    avatar: "data:image;base64," + result.base64,
                });
                console.log(res.data.data.avatar.fileName)
                appContext.setAvatar(res.data.data.avatar.fileName)
                Alert.alert("Thành công", "Đã thay đổi ảnh đại diện", [{ text: "OK" }]);
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* <StatusBar
                backgroundColor="#00000000"
                barStyle={iconColor == "white" ? "light-content" : "dark-content"}
                translucent={true}
            /> */}
            <View style={{zIndex: 3}}>
                <HeaderBar text="Sửa thông tin cá nhân"
                    navigation={navigation} />
            </View>
            <Animated.View
                style={{
                    position: "absolute",
                    height: 70,
                    backgroundColor: "#fff",
                    top: 0,
                    width: FULL_WIDTH,
                    opacity: opacityOnScroll,
                    zIndex: 2,
                    flexDirection: "row",
                    borderBottomColor: "#cdcdcd",
                    borderBottomWidth: 1,
                }}
            >
                <View style={{ marginTop: 25, marginLeft: 60 }}>
                    <Avatar2
                        source={{ uri: BaseURL + appContext.avatar }}
                        size="sm"
                    ></Avatar2>
                </View>

                <Text
                    style={{
                        marginTop: 28,
                        marginLeft: 10,
                        fontWeight: "500",
                        fontSize: 20,
                    }}
                >
                    {context.loginState.userName}
                </Text>
            </Animated.View>
            {/* <TouchableOpacity
                style={{ position: "absolute", top: 30, left: 10, zIndex: 2 }}
                onPress={() => navigation.goBack()}
            >
                {iconColor == "white" ? <IconBack /> : <IconBackBlack />}
            </TouchableOpacity>
            <TouchableOpacity
                style={{ position: "absolute", top: 25, right: 10, zIndex: 2 }}
                onPress={() => navigation.navigate("ProfileOptionScreen")}
            >
                {iconColor == "white" ? <IconOption /> : <IconOptionBlack />}
            </TouchableOpacity> */}
            <RBSheet
                ref={refCoverImageOption}
                closeOnDragDown={true}
                closeOnPressMask={true}
                closeOnPressBack={true}
                animationType="fade"
                height={320}
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
                            Ảnh bìa
                        </Text>
                        <Divider orientation="horizontal" />
                        <TouchableHighlight
                            style={styles.reportOption}
                            onPress={() => {
                                refCallBack.current = () => {
                                    setIsViewCoverImage(true);
                                };
                                refCoverImageOption.current.close();
                            }}
                            activeOpacity={0.99}
                            underlayColor="#989898"
                        >
                            <Text style={styles.reportOptionText}>Xem ảnh bìa</Text>
                        </TouchableHighlight>
                        <Divider orientation="horizontal" />
                        <TouchableHighlight
                            style={styles.reportOption}
                            onPress={() => {
                                changeCoverPicture("camera");
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
                                changeCoverPicture("library");
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
                        onPress={() => refCoverImageOption.current.close()}
                        activeOpacity={0.999}
                        underlayColor="#989898"
                    >
                        <Text style={{ color: "#0085ff", fontWeight: "600", fontSize: 19 }}>
                            Hủy
                        </Text>
                    </TouchableHighlight>
                </View>
            </RBSheet>
            <ImageView
                images={[{ uri: BaseURL + appContext.coverImage }]}
                imageIndex={0}
                visible={isViewCoverImage}
                onRequestClose={() => {
                    refCallBack.current = () => { };
                    setIsViewCoverImage(false);
                }}
                swipeToCloseEnabled={true}
            />
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
    infoForm: {
        padding: 20,
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
