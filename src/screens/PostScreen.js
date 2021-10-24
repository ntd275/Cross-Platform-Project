import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TextInput, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { Avatar, ListItem, Icon } from 'react-native-elements';
import HeaderBar from './components/HeaderBar.js'
import Post from './components/Post.js';
import IconSend from '../../assets/ic_send.svg'
import IconPhoto from '../../assets/ic_photo_o.svg'

const UserPost = (props) => {
    return( 
        <View style={styles.post}>
            <Post></Post>
        </View>
    )
}

const PostAndComment = (props) => {
    return (
        <FlatList
            data={[
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png', date: '2 ngày' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png', date: '2 ngày' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png', date: '2 ngày' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png', date: '2 ngày' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png', date: '2 ngày' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png', date: '2 ngày' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png', date: '2 ngày' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png', date: '2 ngày' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png', date: '2 ngày' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png', date: '2 ngày' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png', date: '2 ngày' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png', date: '2 ngày' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png', date: '2 ngày' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png', date: '2 ngày' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png', date: '2 ngày' },
            ]}
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

const MyComment = () => {
    const [myComment, setMyComment] = useState("");
    const disableSendButtonOpacity = 0.2;

    return (
        <View style={{flexDirection:'row'}}>
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
            <View style={[styles.sendButton, 
                          {opacity: myComment.match(/\S/)?1:disableSendButtonOpacity}]}>
                <TouchableOpacity disabled={!myComment.match(/\S/)}>
                    <IconSend />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default function PostScreen({ navigation }) {

    return (
        <View style={styles.container}>
            <HeaderBar text="Bình luận" navigation={navigation} />
            <View style={styles.postAndComment}>
                <PostAndComment 
                    post={
                        () => {return <UserPost/>}
                    }/>
            </View>
            <MyComment/>
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
        backgroundColor: "#f9fafc",
        fontSize: 18,
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
});