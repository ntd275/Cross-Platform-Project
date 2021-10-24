import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostScreen from '../PostScreen';

const MessageStack = createNativeStackNavigator();

export default function TimelineStackScreen(){
    return(
        <MessageStack.Navigator
            screenOptions={{
            headerShown: false
        }}
        >
            <MessageStack.Screen name="PostScreen" component={PostScreen} />
        </MessageStack.Navigator>
    )
}
