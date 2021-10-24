import React from 'react';
import { StyleSheet, Text, View, Button, StatusBar, ImageBackground,  TouchableHighlight, TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Logo from '../../assets/logo_zalo.svg'

export default function WelcomeScreen({ navigation }){
    return(
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#00000000"
          barStyle="light-content"
          translucent={true}
        />
        <ImageBackground 
          source={require('../../assets/city_light.png')}  
          style={styles.imageBackground}
          resizeMode={'contain'}
        >
          <Logo style={styles.logo}/>
        </ImageBackground>

        < TouchableHighlight 
          style={styles.wrapLoginButton}
          activeOpacity={0.8}
          underlayColor="#3f3f3f"
          onPress={() => {navigation.navigate("LoginScreen")}}
        >
          <LinearGradient
            colors={["#0085ff", "#05adff"]}
            start={[0, 1]} 
            end={[1, 0]}
            style ={styles.button}
          >
            <View style={styles.centerView} >
              <Text style={{color:'#fff',fontWeight:'500'}}>Đăng nhập</Text>
            </View>
          </LinearGradient>
        </TouchableHighlight>

        < TouchableHighlight 
          style={styles.wrapRegisterButton}
          activeOpacity={0.8}
          underlayColor="#3f3f3f"
          onPress={() => {navigation.navigate("RegisterScreen")}}
        >
          <LinearGradient
            style ={styles.button}
            colors={["#f7f8f9", "#f2f4f7"]}
            start={[0, 1]} 
            end={[1, 0]}
          >
            <View style={styles.centerView}>
              <Text style={{fontWeight:'500'}}>Đăng ký</Text>
            </View>
          </LinearGradient>
        </TouchableHighlight>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    imageBackground: {
      width : '100%',
      height: 280,
      marginTop: 35,
    },
    logo: {
      marginTop: 190,
      alignSelf: 'center'
    },
    button: {
      width: '100%',
      height: 50,
      alignSelf: 'center',
      borderRadius: 25,
    },
    centerView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    wrapLoginButton: {
      width: '70%',
      marginTop:'auto',
      alignSelf: 'center',
      borderRadius: 25,
    },
    wrapRegisterButton:{
      width: '70%',
      marginBottom: 50, 
      marginTop: 10,
      alignSelf: 'center',
      borderRadius: 25,
    }
    
  });
  