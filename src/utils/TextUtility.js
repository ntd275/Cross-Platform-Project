import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Linking, TouchableOpacity } from 'react-native'

export const TextUtility = {
    splitLink: (text) => {
        let urlExpression = /((?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?)/gi;
        let urlRegex = new RegExp(urlExpression);
        return text.split(urlRegex);
    },
    splitPhoneNumber: (text) => {
        let phoneExpression = /(0[^146][0-9]{8})/g;
        let phoneRegex = new RegExp(phoneExpression);
        let list = text.split(phoneRegex);
        for (let i = 0; i < list.length; i++) {
            if (list[i] == '') {
                list[i] = ' '
            }
        }
        return list;
    },

    replaceStringWithIcon: (str) => {
        let patterns = Object.keys(StringToEmoji);
        for(let i = 0; i< patterns.length; i++){
            let re = new RegExp("^"+patterns[i] + "$|" +  "^" + patterns[i] + " |" + " " + patterns[i] + "$|" + " " +  patterns[i]+ " ", "gi");
            str = str.replace(re, (match)=>{
                let icon = StringToEmoji[patterns[i]]
                if(match.startsWith(" ")){
                    icon = " " + icon;
                }
                if(match.endsWith(" ")){
                    icon += " "
                }
                
                return icon;
            });
        }
    
        return str
    },

    detectThenFormatPhoneAndURLAndIcon: (text) => {
        let urlExpression = /((?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?)/gi;
        let urlRegex = new RegExp(urlExpression);
        let phoneExpression = /(0[937852][0-9]{8})/g;
        let phoneRegex = new RegExp(phoneExpression);

        //detect phonenumber and link
        let phoneNumber = '';
        let result = <></>;
        let listURL = TextUtility.splitLink(text);
        let list = [];
        let listTextUI = [];

        for (let i = 0; i < listURL.length; i++) {
            if (urlRegex.test(listURL[i])) {
                list.push(listURL[i]);
            } else {
                let subList = TextUtility.splitPhoneNumber(listURL[i]);
                list = list.concat(subList);
            }
        }

        //format result
        for (let i = 0; i < list.length; i++) {
            if (list[i] == '') {
                continue;
            }
            if (urlRegex.test(list[i])) {
                listTextUI.push(
                    <Text key={i} style={styles.url} onPress={() => {
                        let link = list[i];
                        if (!link.startsWith("http://") && !link.startsWith("https://")) {
                            link = "https://" + link;
                        }
                        Linking.openURL(link);
                    }}>
                        {list[i]}
                    </Text>
                )
            } else if (phoneRegex.test(list[i])) {
                phoneNumber = list[i];
                listTextUI.push(
                    <Text key={i} style={styles.phone}>
                        {list[i]}
                    </Text>
                )
            } else {
                listTextUI.push(
                    <Text key={i} style={styles.messageText}>{TextUtility.replaceStringWithIcon(list[i])}</Text>
                )
            }
        }
        result = <Text style={styles.textWrapper}>
            {listTextUI}
        </Text>

        return [phoneNumber, result];
    }
};


const styles = StyleSheet.create({
    url: {
        color: "#0068ff",
        textDecorationLine: 'underline',
        fontSize: 17,
        lineHeight: 21,
        textAlignVertical: "top",
        margin: "auto"
    },
    phone: {
        color: "#0068ff",
        textDecorationLine: 'underline',
        fontSize: 17,
        lineHeight: 21,
    },
    messageText: {
        fontSize: 17,
        lineHeight: 21,
    },
    textWrapper: {
        flexDirection: "row",
        paddingLeft: 10,
        paddingRight: 12,
        paddingTop: 10,
        paddingBottom: 12,
    }
})
const StringToEmoji = {
    ":\\-\\)": "🙂",
    ":\\)": "🙂",
    ":\\]": "🙂",
    "=\\)": "😄",
    "\\^_\\^": "😄",
    ":\\-\\(": "☹️",
    ":\\(": "☹️",
    ":\\[": "☹️",
    "=\\(": "☹️",
    ":\\-P": "😛",
    ":P": "😛",
    "=P": "😛",
    ":\\-D": "😀",
    ":D": "😀",
    "=D": "😀",
    ":-O": "😮",
    ":O": "😮",
    ":o": "😮",
    ":-o": "😮",
    ";-\\)": "😉",
    ";\\)": "😉",
    "8-\\)": "😎",
    "8\\)": "😎",
    "B-\\)": "😎",
    "B\\)": "😎",
    ">:\\(": "😡",
    ">:\\-\\(": "😡",
    ">:O": "😡",
    ">:\\-O": "😡",
    ":\\/": "😕",
    ":\\-\\\/": "😕",
    ":\\\\": "😕",
    ":\\-\\\\": "😕",
    ":'\\(": "😥",
    ":’\\(": "😥",
    "=3:\\)": "😈",
    "3:-\\)": "😈",
    "=O:\\)": "😇",
    "O:\\-\\)": "😇",
    "=:\\-\\*": "😗",
    ":\\*": "😗",
    "<3": "❤️",
    "\\-_\\-": "😑",
}