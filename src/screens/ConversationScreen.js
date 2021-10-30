import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, TextInput, Pressable, Text, View, StatusBar, Button, ImageBackground, TouchableHighlight, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import IconBack from '../../assets/ic_nav_header_back.svg'
import { TextField } from 'rn-material-ui-textfield';
import { Icon, Avatar } from 'react-native-elements';
import { Api } from '../api/Api'
import AuthContext from '../components/context/AuthContext';
import IconSend from '../../assets/icn_send.svg'
import IconSendDiable from '../../assets/icn_send_disable.svg'
import IconPhoto from '../../assets/icn_csc_menu_sticker_n.svg'
import IconOption from '../../assets/ic_list1_line_24.svg'
import IconContact from '../../assets/icn_csc_parsephone_contact.svg'
import IconAddFriend from '../../assets/ic_adduser_solid_24.svg'
import { color } from 'react-native-elements/dist/helpers';
import { TimeUtility } from '../utils/TimeUtility'
import { TextUtility } from '../utils/TextUtility'


const minPasswordLength = 6;
const maxPasswordLength = 10;
const ERROR_PHONENUMBER_AND_PASSWORD = "Mật khẩu không được trùng với số điện thoại";

export default function ConversationScreen({ navigation, friendInfo }) {
    let testInfo = {
        username: "Nguyễn Thế Đức",
        avatar: "https://scontent.fhan3-4.fna.fbcdn.net/v/t1.6435-9/82941062_2537534526492475_6431974749965910016_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=fR3LcuaIaT8AX-g_OEo&_nc_ht=scontent.fhan3-4.fna&oh=c607895b42fed9c264a0e2321819ebad&oe=61980AEA",
        id: "2",
        phonenumber: "0987654321"
    }
    let testListMessage = [
        {
            content: "Alo",
            reciverId: "1",
            senderId: "2",
            date: new Date(1635549188000)
        },
        {
            content: "Alo",
            reciverId: "2",
            senderId: "1",
            date: new Date(1635549647000)
        },
        {
            content: "Ông có đang rảnh không?",
            reciverId: "1",
            senderId: "2",
            date: new Date(1635549947000)
        },
        {
            content: "Tôi nhờ một chút",
            reciverId: "1",
            senderId: "2",
            date: new Date(1635549957000)
        },
        {
            content: "Sao thế?",
            reciverId: "2",
            senderId: "1",
            date: new Date(1635550127000)
        },
        {
            content: "Số điện thoại tôi là gì thế nhỉ, tôi quên rồi :((",
            reciverId: "1",
            senderId: "2",
            date: new Date(1635550247000)
        },
        {
            content: "Đây",
            reciverId: "1",
            senderId: "1",
            date: new Date(1635550307000)
        },
        {
            content: "0987654321",
            reciverId: "1",
            senderId: "1",
            date: new Date(1635550307000)
        },
        {
            content: "À trang ictsv của trường mình là gì thế nhỉ?",
            reciverId: "1",
            senderId: "2",
            date: new Date(1635615107000)
        },
        {
            content: "Đây",
            reciverId: "1",
            senderId: "1",
            date: new Date(1635618707000)
        },
        {
            content: "Link này: ctsv.hust.edu.vn, à số điện thoại ông đây chắc ông quên r: 0987654321",
            reciverId: "1",
            senderId: "1",
            date: new Date(1635618707000)
        },
    ];
    const [friend, setFriend] = useState(testInfo);
    const [messageContent, setMessageContent] = useState("");
    const [inputHeight, setInputHeight] = useState(40);
    const [messages, setMessages] = useState(testListMessage);
    const [isFriend, setIsFriend] = useState(false);
    const [showRecommend, setShowRecommend] = useState(true);
    let userId = "1";

    if (friendInfo) {
        setFriend(friendInfo);
    }

    var sendMessage = () => {
        console.log("sending ...");
    };

    var goToOption = () => {
        console.log("navigating ...");
    }
    
    var requestFriend = ()=>{
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

    var FriendAvatar = () => {
        return (
            <Avatar
                size={28}
                rounded
                onPress={() => goToUserPage(friend)}
                activeOpacity={0.8}
                source={{ uri: friend.avatar }}
            />
        );
    }

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
                {isShowTime ? HourTag(new Date(message.date)) : <></>}
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
                {isShowAvatar ? FriendAvatar() : <></>}
                <View style={messageStyle}>
                    {TextUI}
                    {isShowTime ? HourTag(new Date(message.date)) : <></>}
                </View>
            </View>
        );
    }

    var goToUserPage = (userInfo) => {
        console.log("Go to user's page!");
    }

    var RecommendFriend = ()=>{
        return(
            <View style={styles.recommendFriend}>
                <TouchableOpacity style={{flexDirection: "row", alignSelf:"center", marginTop: 11}} onPress={requestFriend}>
                    <IconAddFriend/>
                    <Text style={{fontSize: 16, marginLeft: 6, paddingTop:3}}>Kết bạn</Text>
                </TouchableOpacity>
            </View>
        );
    }


    var ListMessage = () => {
        let list = [];
        let prevDate, curDate, prevSender, curSender;
        for (let i = 0; i < messages.length; i++) {
            let isShowTime = false;
            let curMessage = messages[i];
            curSender = curMessage.senderId;
            curDate = curMessage.date;
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
                    {ListMessage()}
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
        alignContent:"center",
        backgroundColor: "#fff",
    },
});
