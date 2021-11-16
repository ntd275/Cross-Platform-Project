import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Image, StyleSheet, KeyboardAvoidingView, TextInput, Pressable, Text, View, StatusBar, Button, ImageBackground, TouchableHighlight, TouchableOpacity, Keyboard } from 'react-native';
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


const BaseURL = "http://13.76.46.159:8000/files/"

function ChatInput({ scrollViewRef, isLoading, isSending, setIsSending }) {
    const context = React.useContext(AuthContext);
    const chatContext = React.useContext(ChatContext);
    const [messageContent, setMessageContent] = useState("");
    const [inputHeight, setInputHeight] = useState(40);
    var sendMessage = () => {
        if (isSending || isLoading) {
            return;
        }
        let content = messageContent
        setTimeout(() => {
            setMessageContent("");
        }, 100);

        setIsSending(true);
        chatContext.socket.emit("chatmessage", {
            token: context.loginState.accessToken,
            chatId: chatContext.curChatId ? chatContext.curChatId : null,
            receiverId: chatContext.curFriendId,
            content: content
        });
        if (!chatContext.needUpdateListChat) {

            chatContext.setNeedUpdateListChat(true);
        }

    };

    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={styles.sendButton}>
                <TouchableOpacity>
                    <IconPhoto />
                </TouchableOpacity>
            </View>
            <View style={styles.enterMessageText}>

                <TextInput style={[styles.enterMessage, { height: inputHeight }]}
                    onFocus={() => scrollViewRef.current.scrollToEnd({ animated: true })}
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
    );
}

export default function ConversationScreen({ route, navigation }) {
    const mounted = useRef(false);
    const scrollViewRef = useRef(null);


    const context = React.useContext(AuthContext);
    const chatContext = React.useContext(ChatContext);
    const friend = route.params.friend;
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState(null);
    const [friendStatus, setFriendStatus] = useState("friend");
    let userId = context.loginState.userId;

    useEffect(() => {
        mounted.current = true;
        const listener = (msg) => {
            if (mounted.current === false) {
                return;
            }
            // console.log("msg: "+ msg)
            if (msg.chatId == chatContext.curChatId || msg.receiverId == chatContext.curFriendId || msg.senderId == chatContext.curFriendId) {
                setNewMessage(msg);
            }
        }

        chatContext.socket.on("message", listener)
        return () => {
            chatContext.socket.removeListener("message", listener)
            mounted.current = false;
        };
    }, []);

    const getListMessages = async () => {

        if (isLoading) {
            return
        }
        // console.log("called")
        setIsLoading(true)
        try {
            accessToken = context.loginState.accessToken;

            const res = await Api.getMessages(accessToken, route.params.chatId);
            // console.log("called")
            let listMessages = res.data.data;
            if (mounted.current == false) {
                return;
            }
            setMessages(listMessages);

            if (firstLoad) {
                setFirstLoad(false);
            }
            setIsLoading(false)

            const res2 = await Api.getFriendStatus(accessToken, route.params.friend.id);
            if (res2.status == 200) {
                if(mounted.current == false) return;
                setFriendStatus(res2.data.data.status);
            }
        } catch (err) {
            if (err.response && err.response.status == 401) {
                console.log(err.response.data.message);
                // setNotification("Không thể nhận diện");
                // console.log(notification)
                if (mounted.current == false) {
                    return;
                }
                setIsLoading(false)
                return;
            }
            console.log(err);
            navigation.navigate("NoConnectionScreen", {
                message: "Lỗi kết nối, sẽ tự động thử lại khi có internet",
            });
        }
    }

    if (firstLoad && !isLoading) {
        if (route.params.chatId) {
            if (!route.params.isread) {
                chatContext.socket.emit("seenMessage", {
                    token: context.loginState.accessToken,
                    chatId: route.params.chatId
                });
            }
            getListMessages();
        }
    }

    if (!isLoading && newMessage) {
        let temp = messages;
        temp.push(newMessage);
        setMessages(temp);
        setNewMessage(null);
        if (isSending) {
            // Keyboard.dismiss();
            setIsSending(false);
        }
    }

    var goToOption = () => {
        // console.log("navigating ...");
        navigation.navigate("ConversationOption", { friendInfo: friend })
    }

    var requestFriend = async () => {
        try {
            accessToken = context.loginState.accessToken;

            const res = await Api.sendFriendRequest(accessToken, route.params.friend.id);
            if (res.status == 200) {
                setFriendStatus(res.data.newStatus);
            }
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
    }

    var cancelFriendRequest = async () => {
        try {
            accessToken = context.loginState.accessToken;

            const res = await Api.sendCancelFriendRequest(accessToken, route.params.friend.id);
            if (res.status == 200) {
                setFriendStatus(res.data.newStatus);
            }
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
    }

    var acceptFriendRequest = async () => {
        try {
            accessToken = context.loginState.accessToken;

            const res = await Api.sendAcceptFriendRequest(accessToken, route.params.friend.id);
            if (res.status == 200) {
                setFriendStatus(res.data.newStatus);
            }
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
    }

    var rejectFriendRequest = async () => {
        try {
            accessToken = context.loginState.accessToken;

            const res = await Api.sendRejectFriendRequest(accessToken, route.params.friend.id);
            if (res.status == 200) {
                setFriendStatus(res.data.newStatus);
            }
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
    }

    var DateTag = ({ date }) => {
        let hour = date.getHours();
        if (hour < 10) hour = '0' + hour;
        let minute = date.getMinutes();
        if (minute < 10) minute = '0' + minute;
        let dateStr = hour + ":" + minute + " " + date.toLocaleDateString();

        return (
            <View style={styles.dateTag}>
                <Text style={styles.dateString}>{dateStr}</Text>
            </View>
        );
    }


    var HourTag = ({ date }) => {
        let hour = date.getHours();
        if (hour < 10) hour = '0' + hour;
        let minute = date.getMinutes();
        if (minute < 10) minute = '0' + minute;
        let dateStr = hour + ":" + minute + " ";
        return (
            <Text style={styles.hourString}>{dateStr}</Text>
        );
    }

    var UserTag = ({ userInfo }) => {
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
                    style={{ height: 28, width: 28, borderRadius: 28, }}
                    uri={friend.avatar}
                    cacheKey={friend.avatar.split(BaseURL)[1]}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        );
    };

    var UserMessage = ({ message, isShowTime }) => {
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
            userTag = <UserTag userInfo={phoneInfo} />;
        }
        return (
            <View style={styles.userMessage}>
                {TextUI}
                {userTag}
                {isShowTime ? <HourTag date={new Date(message.time)} /> : <></>}
            </View>
        );
    }

    var FrientMessage = ({ message, isShowAvatar, isShowTime }) => {
        const [phoneInfo, setPhoneInfo] = useState(null);
        let messageStyle = [styles.friendMessage];
        if (!isShowAvatar) {
            messageStyle.push({ marginLeft: 34 });
        }
        let [phoneNumber, TextUI] = TextUtility.detectThenFormatPhoneAndURL(message.content)

        return (
            <View style={styles.friendMessageContainer}>
                {isShowAvatar ? <FriendAvatar friend={friend} /> : <></>}
                <View style={messageStyle}>
                    {TextUI}
                    {isShowTime ? <HourTag date={new Date(message.time)} /> : <></>}
                </View>
            </View>
        );
    }

    var goToUserPage = (userInfo) => {
        console.log("Go to user's page!");
    }

    var FriendStatus = () => {
        let result = <></>
        if (friendStatus === "not friend") {
            result =
                <View style={styles.recommendFriend}>
                    <TouchableOpacity style={{ flexDirection: "row", marginLeft: "auto", marginRight: "auto" }} onPress={requestFriend}>
                        <IconAddFriend />
                        <Text style={{ fontSize: 16, marginLeft: 6, paddingTop: 3 }}>Kết bạn</Text>
                    </TouchableOpacity>
                </View>
        } else if (friendStatus === "sent") {
            result =
                <View style={[styles.recommendFriend, { backgroundColor: "#f9fafc" }]}>
                    <Text style={{ fontSize: 16, marginLeft: "auto", marginRight: "auto", paddingTop: 3, opacity: 0.6 }}>Đã gửi yêu cầu kết bạn</Text>
                    <TouchableOpacity style={{ right: 16, position: "absolute", top: 13 }} onPress={cancelFriendRequest}>
                        <Text style={{ fontSize: 15, fontWeight: '400', color: "#ed4732" }}>Huỷ</Text>
                    </TouchableOpacity>
                </View>
        } else if (friendStatus === "received") {
            result =
                <View style={[styles.recommendFriend, { backgroundColor: "#f9fafc" }]}>
                    <Text style={{ fontSize: 16, marginLeft: 15, marginRight: "auto", paddingTop: 3, opacity: 0.6 }}>Bạn nhận được lời mời kết bạn</Text>
                    <TouchableOpacity style={{ marginRight: 16, top: 3 }} onPress={acceptFriendRequest} >
                        <Text style={{ fontSize: 15, fontWeight: '400', color: "#1476f8" }}>Đồng ý</Text>
                    </TouchableOpacity>
                    <View style={{ borderRightWidth: 1, right: 8, top: 3, height: 20, borderRightColor: "#d7d9da" }}></View>
                    <TouchableOpacity style={{ marginRight: 12, paddingTop: 3 }} onPress={rejectFriendRequest}>
                        <Text style={{ fontSize: 15, fontWeight: '400', color: "#ed4732" }}>Từ chối</Text>
                    </TouchableOpacity>
                </View>
        }

        return (
            <>
                {result}
            </>
        );
    }


    var NotiHeader = () => {
        if (firstLoad && isLoading) {
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
                list.push(<DateTag date={new Date(curDate)} key={"date" + i} />);
            }
            if (i == messages.length - 1 || curSender != messages[i + 1].senderId) {
                isShowTime = true;
            }
            if (curSender == userId) {
                list.push(<UserMessage key={i} message={messages[i]} isShowTime={isShowTime} />);
            } else {
                let isShowAvatar = false;
                if (!prevSender || prevSender != curSender) {
                    isShowAvatar = true;
                }
                list.push(<FrientMessage key={i} message={messages[i]} isShowAvatar={isShowAvatar} isShowTime={isShowTime} />);
            }
            prevDate = curDate;
            prevSender = curSender;
        }
        return (
            <View style={{ marginBottom: 20 }}>
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
                                onPress={() => {
                                    chatContext.outChatRoom();
                                    navigation.goBack()
                                }}
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
            <FriendStatus />
            <View flex={1}>
                <ScrollView
                    style={styles.listMessage}
                    scrollEnabled={true}
                    ref={scrollViewRef}
                    onContentSizeChange={() => {
                        setTimeout(() => {
                            if(mounted.current == false) return;
                            scrollViewRef.current.scrollToEnd({ animated: true })
                        }, 100)
                    }}

                >
                    <NotiHeader />
                    {!firstLoad && !isLoading ? <ListMessage /> : <></>}
                </ScrollView>
            </View>
            <KeyboardAvoidingView style={styles.inputContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ChatInput scrollViewRef={scrollViewRef} isLoading={isLoading} isSending={isSending} setIsSending={setIsSending} />
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
        borderBottomWidth: 1,
        borderColor: "#d7d9da",
        paddingTop: 10,
        flexDirection: "row"
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
