import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Pressable
} from 'react-native';

import IconHeaderClose from '../../assets/icn_header_close.svg'
import IconFriend from '../../assets/ic_friend.svg'
import IconSendDiable from '../../assets/icn_send_disable.svg'
import IconSend from '../../assets/icn_send.svg'
import IconSticker from '../../assets/icn_csc_menu_sticker_n.svg'
import IconPhoto from '../../assets/ic_photo_n.svg'
import IconVideo from '../../assets/icn_video.svg'

export default function CreatePost() {
  const refInput = useRef()

  const [canSend, setCanSend] = useState(false);
  const [postText, setPostText] = useState("");
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    setCanSend(checkCanSend());
  }, [postText]);
  var checkCanSend = () => {
    return postText !== "";
  }

  var onChangeText = (text) => {
    setPostText(text);
  }

  var requestSend = ()=>{
    if(!isSent){
      setIsSent(true);
      console.log("sending....")
    }
  }
  
  var exitScreen= ()=>{
    console.log("exiting ...")
  }

  let iconSend;
  if (canSend) {
    iconSend = <TouchableOpacity style={styles.iconSendWrap} onPress={requestSend}>
    <IconSend />
  </TouchableOpacity>
  } else {
    iconSend = <TouchableOpacity style={styles.iconSendWrap}>
      <IconSendDiable />
    </TouchableOpacity>
  }

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#00000000"
        barStyle="dark-content"
        translucent={true}
      />
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconClose} onPress={exitScreen}>
          <IconHeaderClose />
        </TouchableOpacity>
        <View style={styles.modeContainer}>
          <View style={styles.mode}>
            <IconFriend style={{ marginTop: 2 }} />
            <Text style={styles.textMode}>Tất cả bạn bè</Text>
          </View>
          <Text style={{ color: '#909090' }}>Xem bởi bạn bè trên Zalo</Text>

        </View>
        {iconSend}
      </View>
      <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.input} contentContainerStyle={{ flex: 1 }}>
          <TextInput
            style={styles.textInput}
            placeholder="Bạn đang nghĩ gì?"
            placeholderTextColor="#929292"
            multiline={true}
            ref={refInput}
            onChangeText={text => onChangeText(text)}
            value={postText}
          >
          </TextInput>
          <Pressable style={{ flex: 1 }} onPress={() => { refInput.current.focus() }}></Pressable>
        </ScrollView>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.iconSticker}>
            <IconSticker />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconPhoto}>
            <IconPhoto />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconVideo}>
            <IconVideo />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: "#fafafa",
    height: 62,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row'
  },
  iconClose: {
    marginTop: 28,
    left: 10,
  },
  modeContainer: {
    marginTop: 20,
    marginLeft: 25,
  },
  mode: {
    flexDirection: 'row',
  },
  textMode: {
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 5,
  },
  iconSendWrap: {
    marginTop: 28,
    marginLeft: 'auto',
    marginRight: 10
  },
  content: {
    flex: 1,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  textInput: {
    marginTop: 20,
    fontSize: 18,
  },
  bottomBar: {
    height: 45,
    backgroundColor: '#fafafa',
    flexDirection: 'row'
  },
  iconSticker: {
    marginTop: 5,
    marginLeft: 5,
  },
  iconPhoto: {
    marginTop: 10,
    marginLeft: 'auto',
  },
  iconVideo: {
    marginRight: 20,
    marginTop: 10,
    marginLeft: 30
  }
});