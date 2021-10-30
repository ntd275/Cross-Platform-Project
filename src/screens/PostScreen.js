import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TextInput, FlatList, TouchableOpacity, Pressable, KeyboardAvoidingView } from 'react-native';
import { Avatar, ListItem, Icon } from 'react-native-elements';
import HeaderBar from './components/HeaderBar.js'
import Post from './components/Post.js';
import IconSend from '../../assets/icn_send.svg'
import IconSendDiable from '../../assets/icn_send_disable.svg'
import IconPhoto from '../../assets/icn_csc_menu_sticker_n.svg'
import AuthContext from '../components/context/AuthContext';
import { Api } from '../api/Api.js';
import { TimeUtility } from '../utils/TimeUtility.js';

const UserPost = (props) => {
    let numComment = props.numComment;
    let describe = <Text style={styles.describeText}>Hãy là người đầu tiên bình luận</Text>
    if (numComment > 0) {
        describe = <Text style={styles.describeText}>
            Có {numComment} bình luận. Bạn chỉ được xem bình luận của bạn bè trong danh bạ.
        </Text>
    }
    return (
        <>
            <View style={styles.post}>
                <Post mode="comment"></Post>
            </View>
            {describe}
        </>
    )
}

const PostAndComment = (props) => {
    return (
        <FlatList
            data={props.listComment}
            renderItem={({ item }) => (
                <ListItem bottomDivider>
                    <Avatar
                        size="small" rounded
                        source={{ uri: item.img }} />
                    <ListItem.Content>
                        <ListItem.Title style={styles.commentUser}>
                            {item.user}
                        </ListItem.Title>
                        <ListItem.Subtitle style={styles.commentContent}>
                            {item.content}
                        </ListItem.Subtitle>
                        <Text style={styles.commentDate}>
                            {item.date + " trước"}
                        </Text>
                    </ListItem.Content>
                    <Icon
                        name='heart-outline' // like: heart
                        type='ionicon'
                        color="#818181" // like: #f84c5d
                        size={24}
                    />
                </ListItem>
            )}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={props.post}
        />
    );
}

const MyComment = (props) => {
    const [myComment, setMyComment] = useState("");

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.sendButton}>
                    <TouchableOpacity>
                        <IconPhoto />
                    </TouchableOpacity>
                </View>
                <View style={styles.enterCommentText}>

                    <TextInput style={styles.enterComment}
                        placeholder="Nhập bình luận"
                        returnKeyType="send"
                        enablesReturnKeyAutomatically
                        onChangeText={text => setMyComment(text)}
                        defaultValue={myComment}>
                    </TextInput>

                </View>
                <View style={styles.sendButton}>
                    <TouchableOpacity 
                        disabled={!myComment.match(/\S/)}
                        onPress={() => {
                            props.createCommentFunc(myComment);
                            setMyComment("");
                        }}>
                        {myComment.match(/\S/)?<IconSend />:<IconSendDiable/>}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default function PostScreen({ navigation, route }) {
    const context = React.useContext(AuthContext)
    const [listComment, setListComment] = useState("");
    const [countComment, setCountComment] = useState(0);
    const createComment = async (content) => {
        try {
            let accessToken = context.loginState.accessToken;
            const res = await Api.createComment(accessToken, route.params.postId, content);
            // console.log(res);
            getListComment();
        } catch (err) {
            console.log(err)
            navigation.navigate("NoConnectionScreen",{message: "Tài khoản sẽ tự động đăng nhập khi có kết nối internet"})
        }
    }
    const getListComment = async () => {
        try {
            let accessToken = context.loginState.accessToken;
            const res = await Api.getComment(accessToken, route.params.postId);
            let comments = res.data.data;
            // console.log(comments);
            setListComment(comments.map(
                comment => ({
                    user: comment.user.username,
                    content: comment.content,
                    img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png',
                    dateCreated: new Date(comment.createdAt),
                    dateUpdated: new Date(comment.updatedAt),
                    date: TimeUtility.getTimeStr(new Date(comment.createdAt)),
                })
            ));
            setCountComment(res.data.countComments);
        } catch (err) {
            console.log(err)
            navigation.navigate("NoConnectionScreen",{message: "Tài khoản sẽ tự động đăng nhập khi có kết nối internet"})
        }
    }

    useLayoutEffect(() => {
        getListComment();
    }, []);

    return (
        <View style={styles.container}>
            <HeaderBar text="Bình luận" navigation={navigation} />
            <View style={styles.postAndComment}>
                <PostAndComment
                    listComment={listComment}
                    post={
                        () => { return <UserPost numComment={countComment} /> }
                    } />
            </View>
            <MyComment createCommentFunc={createComment}/>
        </View>
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
        flex: 1,
    },
    post: {
        flex: 1,
        padding: 0,
        borderBottomColor: "#ebebeb",
        borderBottomWidth: 1
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
        fontSize: 13,
        fontWeight: 'bold',
    },
    commentContent: {
        fontSize: 14,
        color: 'black',
    },
    commentDate: {
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
    }
});