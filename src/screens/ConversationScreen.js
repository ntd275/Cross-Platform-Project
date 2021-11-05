import React, { useState, useEffect } from 'react';
import { ScrollView, Image, StyleSheet, KeyboardAvoidingView, TextInput, Pressable, Text, View, StatusBar, Button, ImageBackground, TouchableHighlight, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import IconBack from '../../assets/ic_nav_header_back.svg'
import { TextField } from 'rn-material-ui-textfield';
import { Icon, Avatar } from 'react-native-elements';
import { Api } from '../api/Api'
import AuthContext from '../components/context/AuthContext';
import ChatContext from '../components/context/ChatContext';
import IconSend from '../../assets/icn_send.svg'
import IconSendDiable from '../../assets/icn_send_disable.svg'
import IconPhoto from '../../assets/icn_csc_menu_sticker_n.svg'
import IconOption from '../../assets/ic_list1_line_24.svg'
import IconContact from '../../assets/icn_csc_parsephone_contact.svg'
import IconAddFriend from '../../assets/ic_adduser_line_24.svg'
import { color } from 'react-native-elements/dist/helpers';
import { TimeUtility } from '../utils/TimeUtility'
import { TextUtility } from '../utils/TextUtility'
import ExpoFastImage from 'expo-fast-image';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';


export default function ConversationScreen({ route, navigation }) {
    const context = React.useContext(AuthContext);
    const chatContext = React.useContext(ChatContext);
    const [messageContent, setMessageContent] = useState("");
    const [inputHeight, setInputHeight] = useState(40);
    const friend = route.params.friend;
    var messages = [];
    const [isFriend, setIsFriend] = useState(false);
    const [showRecommend, setShowRecommend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let userId = context.loginState.userId;

    const getListMessages = async () => {
        if (isLoading) {
            return
        }
        // console.log("called")
        setIsLoading(true)
        try {
            accessToken = context.loginState.accessToken;

            const res = await Api.getMessages(accessToken, route.params.chatId);
            console.log("called")
            let listMessages = res.data.data;
            messages = listMessages;
            chatContext.setNeedGetMessages(false);
            chatContext.setCurMessages(listMessages);


            setIsLoading(false)
        } catch (err) {
            if (err.response && err.response.status == 401) {
                console.log(err.response.data.message);
                // setNotification("Không thể nhận diện");
                // console.log(notification)
                setIsLoading(false)
                return;
            }
            console.log(err);
            navigation.navigate("NoConnectionScreen", {
                message: "Lỗi kết nối, sẽ tự động thử lại khi có internet",
            });
        }
    }

    if (chatContext.needGetMessages && !isLoading) {

        if (route.params.chatId) {
            if (!route.params.isread) {
                context.loginState.socket.emit("seenMessage", {
                    token: "a " + context.loginState.accessToken,
                    chatId: route.params.chatId.chatId
                });
            }
            getListMessages();
        }
        else {
            // chatContext.setCurMessages([]);
            chatContext.setNeedGetMessages(false);
        }
    } else if (!chatContext.needGetMessages && !isLoading) {
        messages = chatContext.curMessages;
    }



    var sendMessage = () => {
        console.log("sending ...");
    };

    var goToOption = () => {
        // console.log("navigating ...");
        navigation.navigate("ConversationOption", { friendInfo: friend })
    }

    var requestFriend = () => {
        console.log("sending friend request. ...")
        setShowRecommend(false);
    }

    var DateTag = (date, key) => {
        let hour = date.getHours();
        if (hour < 10) hour = '0' + hour;
        let minute = date.getMinutes();
        if (minute < 10) minute = '0' + minute;
        let dateStr = hour + ":" + minute + " " + date.toLocaleDateString();

        return (
            <View style={styles.dateTag} key={key}>
                <Text style={styles.dateString}>{dateStr}</Text>
            </View>
        );
    }


    var HourTag = (date) => {
        let hour = date.getHours();
        if (hour < 10) hour = '0' + hour;
        let minute = date.getMinutes();
        if (minute < 10) minute = '0' + minute;
        let dateStr = hour + ":" + minute + " ";
        return (
            <Text style={styles.hourString}>{dateStr}</Text>
        );
    }

    var UserTag = (userInfo) => {
        return (
            <TouchableOpacity style={styles.userInfo} onPress={() => goToUserPage(userInfo)}>
                <Avatar
                    size={48}
                    rounded
                    activeOpacity={0.8}
                    source={{ uri: friend.avatar }}
                />
                <View>
                    <Text style={styles.username}>{userInfo.username}</Text>
                    <View style={{ marginTop: 6, marginLeft: 8, flexDirection: "row" }}>
                        <IconContact />
                        <Text style={styles.userPhone}>{userInfo.phonenumber}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    var FriendAvatar = ({ friend }) => {
        return (
            <TouchableOpacity onPress={() => goToUserPage(friend)}>
                <ExpoFastImage
                    style={{ height: 28, width: 28, borderRadius: 28 }}
                    uri={friend.avatar}
                    cacheKey={friend.userId + 'avatar' + new Date().getMinutes() + new Date().getHours() +new Date().getDay() + new Date().getMonth() + new Date().getFullYear()}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        );
    };

    var UserMessage = (key, message, isShowTime) => {
        const [phoneInfo, setPhoneInfo] = useState(null);
        let [phoneNumber, TextUI] = TextUtility.detectThenFormatPhoneAndURL(message.content)
        if (phoneNumber) {
            console.log("getting imformation about: " + phoneNumber);
            if (!phoneInfo) {
                setPhoneInfo(friend);
            }
        }
        let userTag = <></>;
        if (phoneInfo) {
            userTag = UserTag(phoneInfo);
        }
        return (
            <View key={key} style={styles.userMessage}>
                {TextUI}
                {userTag}
                {isShowTime ? HourTag(new Date(message.time)) : <></>}
            </View>
        );
    }

    var FrientMessage = (key, message, isShowAvatar, isShowTime) => {
        const [phoneInfo, setPhoneInfo] = useState(null);
        let messageStyle = [styles.friendMessage];
        if (!isShowAvatar) {
            messageStyle.push({ marginLeft: 34 });
        }
        let [phoneNumber, TextUI] = TextUtility.detectThenFormatPhoneAndURL(message.content)

        return (
            <View key={key} style={styles.friendMessageContainer}>
                {isShowAvatar ? <FriendAvatar friend={friend} /> : <></>}
                <View style={messageStyle}>
                    {TextUI}
                    {isShowTime ? HourTag(new Date(message.time)) : <></>}
                </View>
            </View>
        );
    }

    var goToUserPage = (userInfo) => {
        console.log("Go to user's page!");
    }

    var RecommendFriend = () => {
        return (
            <View style={styles.recommendFriend}>
                <TouchableOpacity style={{ flexDirection: "row", alignSelf: "center", marginTop: 11 }} onPress={requestFriend}>
                    <IconAddFriend />
                    <Text style={{ fontSize: 16, marginLeft: 6, paddingTop: 3 }}>Kết bạn</Text>
                </TouchableOpacity>
            </View>
        );
    }


    var NotiHeader = () => {
        if (chatContext.needGetMessages && isLoading) {
            return (
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.describeText}>Đang tải dữ liệu, chờ chút thôi ...</Text>
                    <Image
                        source={require("../../assets/loading.gif")}
                        style={{ alignSelf: "center" }}
                    />
                </View>
            );
        }
        if (messages && messages.length == 0) {
            return (
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.describeText}>Hãy bắt đầu cuộc trò chuyện nào!</Text>
                </View>
            );
        }

        return (
            <></>
        );
    }


    var ListMessage = () => {
        let list = [];
        let prevDate, curDate, prevSender, curSender;
        for (let i = 0; i < messages.length; i++) {
            let isShowTime = false;
            let curMessage = messages[i];
            curSender = curMessage.senderId;
            curDate = curMessage.time;
            if (!prevDate || TimeUtility.getHourDiff(prevDate, curDate) > 4) {
                list.push(DateTag(new Date(curDate), "date" + i));
            }
            if (i == messages.length - 1 || curSender != messages[i + 1].senderId) {
                isShowTime = true;
            }
            if (curSender == userId) {
                list.push(UserMessage(i, messages[i], isShowTime));
            } else {
                let isShowAvatar = false;
                if (!prevSender || prevSender != curSender) {
                    isShowAvatar = true;
                }
                list.push(FrientMessage(i, messages[i], isShowAvatar, isShowTime));
            }
            prevDate = curDate;
            prevSender = curSender;
        }
        return (
            <View style={{ marginBottom: 40 }}>
                <NotiHeader />
                {list}
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <View>
                <StatusBar
                    backgroundColor="#00000000"
                    barStyle="light-content"
                    translucent={true}
                />
                <Pressable onPress={goToOption}>
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
                            <Text style={styles.title} >{friend.username}</Text>
                            <TouchableOpacity
                                style={styles.iconOptionWrap}
                                onPress={() => { goToOption() }}
                            >
                                <IconOption style={styles.iconBack} />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </Pressable>
            </View>
            {(showRecommend && isFriend == false) ? RecommendFriend() : <></>}
            <View flex={1}>
                <ScrollView style={styles.listMessage} scrollEnabled={true}>
                    {!chatContext.needGetMessages && !isLoading ? <ListMessage /> : <></>}
                </ScrollView>
            </View>
            <KeyboardAvoidingView style={styles.inputContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.sendButton}>
                        <TouchableOpacity>
                            <IconPhoto />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.enterMessageText}>

                        <TextInput style={[styles.enterMessage, { height: inputHeight }]}
                            selectionColor="#2f9afd"
                            text
                            keyboardType="default"
                            placeholderTextColor={"#aeb6bb"}
                            multiline={true}
                            placeholder="Tin nhắn"
                            returnKeyType="none"
                            enablesReturnKeyAutomatically={false}
                            onChangeText={text => setMessageContent(text)}
                            onContentSizeChange={(event) => {
                                let height = event.nativeEvent.contentSize.height + 8;
                                if (height > 70) {
                                    height = 70;
                                }
                                if (height < 40) {
                                    height = 40;
                                }
                                setInputHeight(height);
                            }}
                            defaultValue={messageContent}>
                        </TextInput>

                    </View>
                    <View style={styles.sendButton}>
                        <TouchableOpacity disabled={!messageContent.match(/\S/)} onPress={sendMessage}>
                            {messageContent.match(/\S/) ? <IconSend /> : <IconSendDiable />}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e2e8f1',
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
    },
    iconOptionWrap: {
        marginRight: 6,
        marginLeft: "auto",
        width: 40,
        marginTop: -2
    },
    title: {
        marginTop: 30,
        marginLeft: 12,
        marginRight: 'auto',
        color: '#fff',
        fontSize: 18,
    },
    listMessage: {

    },
    enterMessage: {
        padding: 6,
        backgroundColor: "#fff",
        fontSize: 18,
        lineHeight: 21,
        paddingTop: 4,
        textAlignVertical: 'center',
        marginBottom: 6,
        marginTop: 14
    },
    enterMessageText: {
        flex: 1,
    },
    sendButton: {
        alignSelf: 'center',
        margin: 10,
    },
    inputContainer: {
        backgroundColor: "#fff",
    },
    dateTag: {
        height: 20,
        width: 160,
        borderRadius: 30,
        marginTop: 16,
        marginBottom: 8,
        backgroundColor: "#b5babf",
        alignSelf: "center",
    },
    dateString: {
        color: "#fff",
        fontSize: 12,
        alignSelf: "center",
        textAlignVertical: 'center',
        paddingTop: 3,
    },
    hourString: {
        color: "#a3a3a3",
        fontSize: 12,
        paddingBottom: 10,
        paddingLeft: 10
    },
    userMessage: {
        marginTop: 8,
        backgroundColor: "#cff0fe",
        borderWidth: 1,
        borderColor: "#b8ceda",
        borderRadius: 10,
        minHeight: 45,
        maxWidth: "80%",
        marginLeft: "auto",
        marginRight: 12,
        minWidth: 86,
    },
    friendMessageContainer: {
        marginTop: 8,
        marginLeft: 12,
        flexDirection: "row"
    },
    friendMessage: {
        backgroundColor: "#fefefe",
        borderWidth: 1,
        borderColor: "#d7d9da",
        borderRadius: 10,
        minHeight: 45,
        maxWidth: "80%",
        marginLeft: 6,
        minWidth: 86,
    },
    userInfo: {
        flexDirection: "row",
        marginLeft: 10,
        marginRight: 12,
        marginTop: 14,
        marginBottom: 8,
        minHeight: 60,
        minWidth: 220,
    },
    username: {
        fontSize: 17,
        fontWeight: "500",
        marginLeft: 8
    },
    userPhone: {
        color: "#8694a0",
        fontSize: 15,
        marginLeft: 8,
    },
    recommendFriend: {
        width: "100%",
        height: 45,
        alignContent: "center",
        backgroundColor: "#fff",
    },
    describeText: {
        fontSize: 14,
        paddingLeft: 16,
        paddingRight: 16,
        color: "#778993",
        marginTop: 12,
        marginBottom: 12,
        textAlign: "center"
    },
});
