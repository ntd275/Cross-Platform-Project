import React from 'react';
import { StyleSheet, Text, View, Button, ImageBackground,  TouchableHighlight, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import IconBack from '../../assets/ic_nav_header_back.svg'

export default function LoginScreen({navigation}){
    return(
      <View style={styles.container}>
        <View>
            <LinearGradient
            colors={["#0085ff", "#05adff"]}
            start={[0, 1]} 
            end={[1, 0]}
            style ={styles.header}
            >
                <View style={{flex:1,flexDirection: "row"}}>
                    <TouchableOpacity
                        style={styles.iconBackWrap} 
                        onPress={()=>{navigation.goBack()}}
                    >
                        <IconBack style={styles.iconBack}/>
                    </TouchableOpacity>
                    <Text style={styles.title} >Đăng nhập</Text>
                </View>  
            </LinearGradient>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
        width: '100%',
        height: 68,
    },
    iconBack: {
        marginTop: 30,
        left: 10,
    },
    iconBackWrap:{
        width:40
    },
    title: {
      marginTop: 30,
      marginLeft: 'auto',
      marginRight: 'auto',
      color:'#fff',
      fontSize: 20,
    },
  });
  