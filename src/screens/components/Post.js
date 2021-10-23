import { useLinkProps } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Pressable, Text, StatusBar, View, Button } from 'react-native';
import { Avatar, Icon, Image } from "react-native-elements";
import ImageView from "react-native-image-viewing";

export default function Post() {
    const images = [
        {
            uri: "https://scontent.fhan3-1.fna.fbcdn.net/v/t1.6435-9/83664896_183120826091483_966697121426178048_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=6FkkOSn1HxsAX_5s72G&_nc_ht=scontent.fhan3-1.fna&oh=352f134b1cfd21372d65288dc232620e&oe=6197F36C",
        },
        {
            uri: "https://scontent.fhan3-1.fna.fbcdn.net/v/t1.6435-9/52578938_121091798961053_2441959323211923456_n.jpg?_nc_cat=111&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=8brvAXNHzrsAX9rIqmo&_nc_ht=scontent.fhan3-1.fna&oh=1b8845aa2bcb4e40104067dc60f7bd9d&oe=619857E2",
        },
        {
            uri: "https://scontent.fhan3-3.fna.fbcdn.net/v/t1.6435-9/52368397_121091762294390_5329755510382002176_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=GZwoO6NYPUcAX-lVfCH&tn=S-LhVHmVXF0IXquK&_nc_ht=scontent.fhan3-3.fna&oh=b43cd856bb3960dc0cfe598aa23ed947&oe=619839A5",
        },
        {
            uri: "https://scontent.fhan4-3.fna.fbcdn.net/v/t1.6435-9/35147076_653606388304254_5729101200196894720_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=dtzP9CcJUBoAX_cNvYg&_nc_ht=scontent.fhan4-3.fna&oh=10967cb3d1ab2d240d88838af25fed68&oe=6197D2B4",
        },
    ];

    const video = "";

    const [visible, setIsVisible] = useState(false);
    const [imageIndex, setImageIndex] = useState(1);

    let userName = "Nguyễn Thế Đức";
    let postContent = "Hôm nay tôi rất vui :))";
    let postTime = "30 phút trước";
    let numLike = 4;
    let numComment = 2;

    var goToUserPage = () => {
        console.log("Go to user's page!");
    }

    var showMenu = () => {
        console.log("showing menu ...");
    }

    var clickLike = () => {
        console.log("touched like ...");
    }

    var clickComment = () => {
        console.log("touched comment ...");
    }

    let statusBar = <></>
    if (visible) {
        statusBar = <StatusBar
            hidden
        />
    }

    let media = <></>
    let addition = <></>
    if (!video) {
        if (images.length > 1) {
            let additionImages = [];
            let imageHeight = (images.length <= 2) ? (400) : ((400 - 3 * (images.length - 2)) / (images.length - 1));
            for (let i = 1; i < images.length; i++) {
                additionImages.push(
                    <View key={i}>
                        <Image
                            source={[images[i]]}
                            style={{ height: imageHeight, resizeMode: 'cover'}}
                            onPress={() => { setImageIndex(i); setIsVisible(true) }}
                        />
                    </View>
                );
            }
            addition = <View style={{ flex: 1, paddingTop: 20, flexDirection: "column", left: 3, justifyContent:"space-between" }}>
                {additionImages}
            </View>

        }
        media = <>
            <ImageView
                images={images}
                imageIndex={imageIndex}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
                swipeToCloseEnabled={true}
                FooterComponent={(props) => {
                    return <View><Text style={styles.imageViewFooter}>{props.imageIndex + 1} / {images.length}</Text></View>
                }}
            />
            <View style={{ flex: 1, paddingTop: 20 }}>
                <Image
                    source={[images[0]]}
                    style={{ height: 400, resizeMode: 'cover' }}
                    onPress={() => { setImageIndex(0); setIsVisible(true) }}
                />
            </View>
            {addition}
        </>
    }

    return (
        <ScrollView>
            <View style={styles.postContainer}>
                {statusBar}
                <View style={styles.postHeader}>
                    <View style={styles.posterAvatar}>
                        <Avatar
                            size={42}
                            rounded
                            onPress={() => goToUserPage()}
                            activeOpacity={0.8}
                            source={{ uri: "https://scontent.fhan3-4.fna.fbcdn.net/v/t1.6435-9/82941062_2537534526492475_6431974749965910016_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=fR3LcuaIaT8AX-g_OEo&_nc_ht=scontent.fhan3-4.fna&oh=c607895b42fed9c264a0e2321819ebad&oe=61980AEA" }}
                        />
                    </View>
                    <View style={styles.posterInfo}>
                        <View style={{ flex: 1 }}>
                            <Pressable onPress={() => { goToUserPage() }}>
                                <Text style={{ textAlign: "right", fontSize: 16, color: "#000", fontWeight: '600', lineHeight: 28 }}>
                                    {userName}
                                </Text>
                            </Pressable>
                        </View>
                        <Text style={{ flex: 1, fontSize: 14, color: "#77797c", marginTop: 0 }}>{postTime}</Text>
                    </View>
                    <View style={styles.postMenu}>
                        <Icon
                            name='options'
                            type='simple-line-icon'
                            color="#898989"
                            size={20}
                            onPress={() => showMenu("")}
                        />
                    </View>
                </View>
                <View>
                    <Text style={styles.postContent}>{postContent}</Text>
                </View>

                <View style={styles.postMedia}>
                    {media}
                </View>
                <View style={styles.postFooter}>
                    <View style={{ flexDirection: "row", marginRight: 36 }}>
                        <Icon
                            name='heart-outline' // like: heart
                            type='ionicon'
                            color="#818181" // like: #f84c5d
                            size={32}
                            onPress={() => clickLike("")}
                        />
                        <Text style={{ marginLeft: 6, fontSize: 18, lineHeight: 34 }}>{numLike}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Icon
                            style={{ marginTop: 2 }}
                            name='comment-processing-outline'
                            type='material-community'
                            color="#818181eb"
                            size={30}
                            onPress={() => clickComment("")}
                        />
                        <Text style={{ marginLeft: 6, fontSize: 18, lineHeight: 34 }}>{numComment}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: "#fff",
        marginTop: 100
    },
    posterAvatar: {
        marginLeft: 18,
        marginTop: 16,
    },
    posterInfo: {
        paddingTop: 12,
        marginLeft: 12
    },
    postHeader: {
        flexDirection: "row",
        height: 60,
        marginBottom: 20
    },
    postContent: {
        paddingLeft: 18,
        paddingRight: 18,
        fontSize: 18,
    },
    postMedia: {
        flexDirection: "row",
        maxHeight: 500
    },
    postFooter: {
        paddingTop: 12,
        height: 60,
        textAlignVertical: 'center',
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 18,
        borderTopColor: "#ebebeb",
        borderTopWidth: 1,
        marginTop: 20
    },
    postMenu: {
        marginLeft: "auto",
        marginRight: 16,
        marginTop: 8
    },
    imageViewFooter: {
        color: "#fff",
        fontSize: 18,
        marginLeft: "auto",
        marginBottom: 4,
        marginRight: "auto",
        paddingRight: 2,
        fontWeight: "500"
    },
});