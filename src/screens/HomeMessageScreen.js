import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import AuthContext from '../components/context/AuthContext';

export default function HomeMessageScreen(){
    const {dispatch} = React.useContext(AuthContext)
    const logout = ()=>{
      dispatch({type:'LOGOUT'})
    }
    return(
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>MessageScreen</Text>
          <Button
            title="Logout"
            onPress={logout}
          />
      </View>
    )
}