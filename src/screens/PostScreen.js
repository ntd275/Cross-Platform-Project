import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { StyleSheet, StatusBar, LinearGradient, Text, View, Button, ScrollView, TextInput, FlatList, TouchableOpacity, Pressable, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Avatar, ListItem, Icon } from 'react-native-elements';
import HeaderBar from '../screens/components/HeaderBar'
import Post from './components/Post.js';
import IconSend from '../../assets/icn_send.svg'
import IconSendDiable from '../../assets/icn_send_disable.svg'
import IconBack from "../../assets/arrow-back-outline.svg";
import IconPhoto from '../../assets/icn_csc_menu_sticker_n.svg'
import AuthContext from '../components/context/AuthContext';
import { Api } from '../api/Api.js';
import { TimeUtility } from '../utils/TimeUtility.js';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";

const BaseURL = 'http://13.76.46.159:8000/files/';
const renderItem = ({ item }) => (
    <Pressable onPress={() => { Keyboard.dismiss() }}>
        <ListItem bottomDivider>
            <Avatar
                size={42} rounded
                source={{ uri: item.img }} />
            <ListItem.Content>
                <ListItem.Title style={styles.commentUser}>
                    {item.user}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.commentContent}>
                    {item.content}
                </ListItem.Subtitle>
                <Text style={styles.commentDate}>
                    {item.date}
                </Text>
            </ListItem.Content>
            <Icon
                name='heart-outline' // like: heart
                type='ionicon'
                color="#818181" // like: #f84c5d
                size={24}
            />
        </ListItem>
    </Pressable>
);

export default function PostScreen({ navigation, route }) {
    const mounted = useRef(false);
    const flatList = useRef(null);

    useEffect(() => {
        mounted.current = true;

        return () => { mounted.current = false; };
    }, []);
    const context = React.useContext(AuthContext);
    const [listComment, setListComment] = useState("");
    const [countComment, setCountComment] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [DidComment, setDidComment] = useState(false);
    const [needUpdateParent, setNeedUpdateParent] = useState(false);
    const createComment = async (content) => {
        try {
            let accessToken = context.loginState.accessToken;
            const res = await Api.createComment(accessToken, route.params.postId, content);
            if (mounted.current === false) {
                return;
            }
            setNeedUpdateParent(true);
            setDidComment(true);
            Keyboard.dismiss();
            showMessage({
                message: "Đã gửi bình luận",
                type: "info",
                style: { marginLeft: "auto" },
                // backgroundColor: "#0092fa",
            });
            getListComment();
        } catch (err) {
            console.log(err)
            navigation.navigate("NoConnectionScreen", { message: "" })
        }
    }
    const getListComment = async () => {
        try {
            let accessToken = context.loginState.accessToken;
            const res = await Api.getComment(accessToken, route.params.postId);
            if (mounted.current === false) {
                return;
            }
            setIsLoaded(true);
            let comments = res.data.data;
            // console.log(comments);
            setListComment(comments.map(
                comment => ({
                    user: comment.user.username,
                    content: comment.content,
                    img: BaseURL + comment.user.avatar.fileName,
                    dateCreated: new Date(comment.createdAt),
                    dateUpdated: new Date(comment.updatedAt),
                    date: TimeUtility.getTimeStr(new Date(comment.createdAt)),
                    userId: comment.user._id,
                })
            ));
            setCountComment(res.data.countComments);
        } catch (err) {
            console.log(err)
            navigation.navigate("NoConnectionScreen", { message: "Tài khoản sẽ tự động đăng nhập khi có kết nối internet" })
        }
    }

    useLayoutEffect(() => {
        getListComment();
    }, []);

    var UserPost = () => {
        let describe = <Text style={styles.describeText}>Đang tải bình luận, vui lòng chờ ...</Text>
        if (isLoaded) {
            if (countComment > 0) {
                describe = <Text style={styles.describeText}>
                    Có {countComment} bình luận. Bạn chỉ được xem bình luận của bạn bè trong danh bạ.
                </Text>
            } else {
                describe = <Text style={styles.describeText}>Hãy là người đầu tiên bình luận</Text>
            }
        }

        return (
            <>
                <View style={styles.post}>
                    <Post mode="comment" post={route.params.post} navigation={route.params.navigation}></Post>
                </View>
                {describe}
            </>
        )
    }

    const PostAndComment = () => {
        return (

            <FlatList
                ref={flatList}
                keyboardShouldPersistTaps={'always'}
                onContentSizeChange={() => { if (DidComment) flatList.current.scrollToEnd({ animated: true }) }}
                data={listComment}
                initialNumToRender={15}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={UserPost()}
            />

        );
    }

    var MyComment = (props) => {
        const [myComment, setMyComment] = useState("");

        return (
            <KeyboardAvoidingView style={styles.myComment} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.sendButton}>
                        <TouchableOpacity>
                            <IconPhoto />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.enterCommentText}>

                        <TextInput style={styles.enterComment}
                            placeholder="Nhập bình luận"
                            returnKeyType="none"
                            enablesReturnKeyAutomatically={false}
                            onChangeText={text => setMyComment(text)}
                            defaultValue={myComment}>
                        </TextInput>

                    </View>
                    <View style={styles.sendButton}>
                        <TouchableOpacity
                            disabled={!myComment.match(/\S/)}
                            onPress={() => {
                                createComment(myComment);
                                setMyComment("");
                            }}>
                            {myComment.match(/\S/) ? <IconSend /> : <IconSendDiable />}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        )
    }

    var goBackFunc = () => {
        if (needUpdateParent) {
            route.params.updateFunc();
        }
        navigation.goBack();
    }

    return (
        <>
            <FlashMessage position="top" titleStyle={{ fontSize: 16, marginLeft: 12, marginTop: 1 }} icon="success" />
            <View style={styles.container} >
                <HeaderBar text="Bình luận" goBackFunc={goBackFunc} navigation={navigation} />
                <View style={styles.postAndComment}>
                    {PostAndComment()}
                </View>

            </View>
            {MyComment()}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        color: "#f00",
        left: 20,
    },
    textFieldLable: {
        paddingTop: 3
    },
    postAndComment: {
        flex: 1
    },
    post: {
        borderBottomColor: "#ebebeb",
        borderBottomWidth: 1,
    },
    comment: {
        flex: 1,
    },
    footer: {
        flex: 1,
    },
    enterComment: {
        padding: 10,
        height: 50,
        backgroundColor: "#fff",
        fontSize: 18,
        marginTop: 3
    },
    avatar: {
        flex: 2,
    },
    commentUser: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    commentContent: {
        paddingTop: 4,
        fontSize: 14,
        color: 'black',
    },
    commentDate: {
        paddingTop: 4,
        fontSize: 13,
        color: 'gray',
    },
    enterCommentText: {
        flex: 1,
    },
    sendButton: {
        alignSelf: 'center',
        margin: 10,
    },
    describeText: {
        fontSize: 14,
        paddingLeft: 16,
        paddingRight: 16,
        color: "#778993",
        marginTop: 12,
        marginBottom: 12
    },
    myComment: {
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e6e6e6"
    }
});