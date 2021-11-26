import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, StyleSheet, Pressable, Text, View, StatusBar, ImageBackground, TouchableHighlight, TouchableOpacity, PointPropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import IconBack from '../../assets/ic_nav_header_back.svg'
import { TextField } from 'rn-material-ui-textfield';
import { Icon, Avatar } from 'react-native-elements';
import { Api } from '../api/Api'
import Modal from "react-native-modal";
import AuthContext from '../components/context/AuthContext';
import ChatContext from '../components/context/ChatContext';
import AppContext from '../components/context/AppContext';
import IconMenuDelete from '../../assets/ic_bottom_sheet_menu_delete.svg'
import IconMenuUser from '../../assets/ic_user_line_24.svg'
import IconMenuBan from '../../assets/ic_ban_line_24.svg'
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { Dimensions } from 'react-native';


export default function ConversationOptionScreen({ route, navigation }) {
    const [friend, setFriend] = useState(route.params.friendInfo);
    const [menuDeleteVisible, setMenuDeleteVisible] = useState(false);
    const [menuBlockVisible, setMenuBlockVisible] = useState(false);
    const context = React.useContext(AuthContext);
    const chatContext = React.useContext(ChatContext);
    const appContext = useContext(AppContext);
    var goToUserPage = () => {
        if(chatContext.needUpdateListChat){
            chatContext.setForceUpdateChat(true);
        }
        navigation.navigate("ViewProfileScreen", { userId: chatContext.curFriendId })

    }

    var confirmDeleteConverSation = async () => {
        if (chatContext.curChatId) {
            try {
                accessToken = context.loginState.accessToken;

                const res = await Api.deleteChat(accessToken, chatContext.curChatId);
                // console.log("called")
                chatContext.setListUnseens([]);
                chatContext.setNeedUpdateListChat(true);


                // console.log("conversation deleted");
                chatContext.outChatRoom();
                navigation.pop(2);
                appContext.displayMessage({
                    message: "Đã xoá cuộc trò chuyện",
                    type: "info",
                    style: { paddingLeft: Dimensions.get("window").width / 2 - 106, paddingBottom: 8, paddingTop: 24 },
                    icon: "success",
                    position: "top",
                    duration: 2000,
                    backgroundColor: "#008bd7",
                });
            } catch (err) {
                if (err.response && err.response.status == 401) {
                    console.log(err.response.data.message);
                    // setNotification("Không thể nhận diện");
                    // console.log(notification)
                    return;
                }
                console.log(err);
                navigation.navigate("NoConnectionScreen", {
                    message: "Lỗi kết nối, sẽ tự động thử lại khi có internet",
                });
            }
        } else {
            console.log("conversation deleted");
            chatContext.outChatRoom();
            navigation.pop(2);
            appContext.displayMessage({
                message: "Đã xoá cuộc trò chuyện",
                type: "info",
                style: { paddingLeft: Dimensions.get("window").width / 2 - 106, paddingBottom: 8, paddingTop: 24 },
                icon: "success",
                position: "top",
                duration: 2000,
                backgroundColor: "#008bd7",
                autoHide: false
            });
        }
    }


    var confirmBlock = async () => {
        closeMenuBlock();
        setTimeout(() => {
            chatContext.socket.emit("blockers", {
                token: context.loginState.accessToken,
                chatId: chatContext.curChatId ? chatContext.curChatId : null,
                receiverId: chatContext.curFriendId,
                type: "block"
            });
        }, 125)
    }

    var unBlock = async () => {
        chatContext.socket.emit("blockers", {
            token: context.loginState.accessToken,
            chatId: chatContext.curChatId ? chatContext.curChatId : null,
            receiverId: chatContext.curFriendId,
            type: "unblock"
        });
    }

    var closeMenuDelete = () => {
        setMenuDeleteVisible(false);
    }

    var openMenuDelete = () => {
        setMenuDeleteVisible(true);
    }

    var closeMenuBlock = () => {
        setMenuBlockVisible(false);
    }

    var openMenuBlock = () => {
        setMenuBlockVisible(true);
    }



    let blockOption;
    if (!chatContext.curBlockers || chatContext.curBlockers.length == 0 ||
        (chatContext.curBlockers.length > 0 && chatContext.curBlockers.indexOf(context.loginState.userId) == -1)) {
        blockOption = <TouchableOpacity style={[styles.menuOption, { height: 60 }]} onPress={openMenuBlock}>
            <IconMenuBan flex={1} style={{ marginTop: "auto", marginBottom: "auto" }} />
            <View flex={10} style={styles.inMenuOption}>
                <Text style={{ fontSize: 16, fontWeight: '400' }}>Chặn tin nhắn</Text>
            </View>
        </TouchableOpacity>

    } else {
        blockOption = <TouchableOpacity style={[styles.menuOption, { height: 60 }]} onPress={unBlock}>
            <IconMenuBan flex={1} style={{ marginTop: "auto", marginBottom: "auto" }} />
            <View flex={10} style={styles.inMenuOption}>
                <Text style={{ fontSize: 16, fontWeight: '400' }}>Bỏ chặn tin nhắn</Text>
            </View>
        </TouchableOpacity>
    }

    return (
        <View style={styles.container}>
            <View>
                <FlashMessage position="center" icon="success" />
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
                <ScrollView scrollEnabled={true}>
                    <View style={styles.userContainer}>
                        <Avatar
                            size={100}
                            rounded
                            activeOpacity={0.8}
                            source={{ uri: friend.avatar }}
                            onPress={goToUserPage}
                        />
                        <TouchableOpacity style={{ marginTop: 18 }} onPress={goToUserPage}>
                            <Text style={styles.username}>{friend.username}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.userOption}>

                        <TouchableOpacity style={[styles.menuOption, { height: 60 }]} onPress={goToUserPage}>
                            <IconMenuUser flex={1} style={{ marginTop: "auto", marginBottom: "auto" }} />
                            <View flex={10} style={styles.inMenuOption}>
                                <Text style={{ fontSize: 16, fontWeight: '400' }}>Trang cá nhân</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.menuOption, { height: 60 }]} onPress={openMenuDelete}>
                            <IconMenuDelete flex={1} style={{ marginTop: "auto", marginBottom: "auto" }} />
                            <View flex={10} style={styles.inMenuOption}>
                                <Text style={{ fontSize: 16, fontWeight: '400' }}>Xoá lịch sử cuộc trò chuyện</Text>
                            </View>
                        </TouchableOpacity>
                        {blockOption}
                    </View>
                </ScrollView>
                <Modal
                    isVisible={menuDeleteVisible}
                    onBackdropPress={closeMenuDelete}
                    style={{ width: 292, alignSelf: "center" }}
                    animationIn="fadeInUp"
                    animationOut="fadeOutDownBig"
                >
                    <View style={styles.menuStyle}>
                        <Text style={styles.menuTitle}>Xoá trò chuyện?</Text>
                        <Text style={styles.menuDesription}>Bạn sẽ không thể xem lại nội dung của trò chuyện này</Text>
                        <View style={styles.menuBottom}>
                            <TouchableOpacity flex={1} style={styles.menuCancelBtn} onPress={closeMenuDelete} >
                                <Text style={styles.textCancel}>Không xoá</Text>
                            </TouchableOpacity>
                            <TouchableOpacity flex={1} style={styles.menuAcceptBtn} onPress={confirmDeleteConverSation}>
                                <Text style={styles.textAccept}>Xoá</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    isVisible={menuBlockVisible}
                    onBackdropPress={closeMenuBlock}
                    style={{ width: 292, alignSelf: "center" }}
                    animationIn="fadeInUp"
                    animationOut="fadeOutDownBig"
                >
                    <View style={styles.menuStyle}>
                        <Text style={styles.menuTitle}>Chặn người này?</Text>
                        <Text style={styles.menuDesription}>Bạn sẽ không thể nhắn tin với người này nữa người này nữa</Text>
                        <View style={styles.menuBottom}>
                            <TouchableOpacity flex={1} style={styles.menuCancelBtn} onPress={closeMenuBlock} >
                                <Text style={styles.textCancel}>Không chặn</Text>
                            </TouchableOpacity>
                            <TouchableOpacity flex={1} style={styles.menuAcceptBtn} onPress={confirmBlock}>
                                <Text style={styles.textAccept}>Chặn</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f6f6f6",
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
    userContainer: {
        backgroundColor: "#fff",
        height: 186,
        alignItems: "center",
        paddingTop: 18
    },
    username: {
        fontSize: 18,
        fontWeight: "500"
    },
    userOption: {
        backgroundColor: "#fff",
        flexDirection: "column",
        height: 460,
        marginTop: 10,
    },
    menuOption: {
        flexDirection: "row",
        paddingLeft: 14,
        paddingRight: 0,
        marginTop: 2,
    },
    inMenuOption: {
        flexDirection: "column",
        justifyContent: "center",
        marginLeft: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingTop: 3
    },
    menuStyle: {
        flexDirection: "column",
        minHeight: 151,
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingTop: 20,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
    },

    menuDesription: {
        textAlign: "center",
        fontSize: 14,
        paddingTop: 8,
        paddingBottom: 16,
        fontWeight: "400",
        paddingLeft: 12,
        paddingRight: 12
    },
    menuBottom: {
        height: 40,
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#dadada"
    },
    menuCancelBtn: {
        height: 50,
        width: '50%',
        borderRightColor: "#dadada",
        borderRightWidth: 1
    },
    menuAcceptBtn: {
        height: 50,
        width: '50%'
    },
    textCancel: {
        fontSize: 17,
        textAlign: 'center',
        paddingTop: 12,
        fontWeight: '400',
        color: "#1476f8",
    },
    textAccept: {
        fontSize: 17,
        textAlign: 'center',
        paddingTop: 12,
        fontWeight: '400',
        color: "#ed4732",
    },
});
