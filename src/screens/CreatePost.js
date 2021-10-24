import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
export default function CreatePost() {
    return (
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            backgroundColor: '#ffffff',
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 10,
    
              backgroundColor: '#fafafa',
            }}
          >
            <TouchableOpacity>
              <Ionicons
                name="arrow-back"
                style={{
                  fontSize: 24,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                style={{
                  color: '#53abfb',
                  fontSize: 15,
                  fontWeight: 'bold',
                }}
              >
                ĐĂNG
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{
              padding: 20,
              marginBottom: 50,
            }}
          >
            <TextInput
              placeholder="Bạn đang nghĩ gì?"
              multiline
              style={{ fontSize: 20, marginBottom: 20 }}
            />
 
          </ScrollView>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderTopWidth: 1,
              borderTopColor: '#ccc',
            }}
          >
            <View>
              <Ionicons
                name="happy-outline"
                style={{ fontSize: 30, color: '#000' }}
              />
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
    
                alignItems: 'center',
              }}
            >
              <View style={{ marginRight: 20 }}>
                <TouchableOpacity>
                  <Ionicons
                    name="image-outline"
                    style={{ fontSize: 30, color: '#000' }}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity>
                  <Ionicons
                    name="videocam-outline"
                    style={{ fontSize: 30, color: '#000' }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
}
