import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TextInput, FlatList } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from './components/HeaderBar.js'

const Post = (props) => {
    return( 
        <View style={styles.post}>
            <Text>
                This is a post{"\n"}
                This is a post{"\n"}
                This is a post
            </Text>
        </View>
    )
}

const PostAndComment = (props) => {
    return (
        <FlatList
            data={[
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png' },
                { user: 'Devin', content: 'Hello, this is a comment', img: 'https://www.iptc.org/wp-content/uploads/2018/05/avatar-anonymous-300x300.png' },
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
                    </ListItem.Content>
                </ListItem>
            )}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={props.post}
        />
    );
}

export default function PostScreen({ navigation }) {
    const [myComment, setMyComment] = useState("");

    return (
        <View style={styles.container}>
            <HeaderBar text="Bình luận" navigation={navigation} />
            <View style={styles.postAndComment}>
                <PostAndComment 
                    post={
                        () => {return <Post/>}
                    }/>
            </View>
            <View>
                <TextInput style={styles.enterComment}
                           placeholder="Nhập bình luận"
                           returnKeyType="send"
                           enablesReturnKeyAutomatically>
                </TextInput>
            </View>
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
        padding: 20,
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
    }
});