import React from 'react';
import { StyleSheet, Text, View, Button, ImageBackground,  TouchableHighlight, TouchableOpacity} from 'react-native';
import Logo from '../../assets/logo_zalo_small.svg'
import NoConnection from '../../assets/no-connection.svg'

export default function NoConnectionScreen({route, navigation }){
    const message = route.params
    return(
      <View style={styles.container}>
        <Logo style={styles.logo}/>
        <NoConnection style={styles.noConnection} />
        <Text style={styles.warning}>Không có kết nối internet.</Text>
        <Text style={styles.text}>Vui lòng kiểm tra lại đường truyền</Text>
        <Text style={styles.text}>{message}</Text>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    logo: {
      marginTop: 100,
      alignSelf: 'center'
    },
    noConnection: {
        alignSelf: 'center',
        marginTop:150,
    },
    warning: {
      marginTop: 20, 
      color: '#ff0000',
      alignSelf: 'center',
      fontWeight: '500',
    },
    text:{
      alignSelf: 'center',
    }
  });
  