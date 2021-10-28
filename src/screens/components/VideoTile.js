import React from 'react';
import {
  Dimensions,
  ImageBackground,
  TouchableHighlight,
  View,
  Text
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library'
import IconCamera from '../../../assets/ic_video.svg'
const {width} = Dimensions.get('window');

class VideoTile extends React.PureComponent {
  openCamera = async ()=>{
    let photo = await ImagePicker.launchCameraAsync(
      {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        presentationStyle: 	6,
        quality: 1,
      }
    )
    if(!photo.cancelled){
      const asset = await MediaLibrary.createAssetAsync(photo.uri)
      this.props.selectImage(asset)
    }
  }

  render() {
    const { index, item, preView,numColumns} = this.props;
    if (!item) return null;
    if (index == 0){
      return(
    <TouchableHighlight
        style={{margin: 1.5}}
        underlayColor='#00000000'
        onPress={this.openCamera} >
        <View style={{ position: 'relative' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: width / numColumns - 3, height: width / numColumns - 3, alignItems:'center',justifyContent:'center'}}>
              <IconCamera/>
              <Text style={{color:"#767676"}}>Quay phim</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
      )
    }

    return (
      <TouchableHighlight
        style={{margin: 1.5}}
        underlayColor='#00000000'
        onPress={() => preView(item)} >
        <View style={{ position: 'relative' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ImageBackground
              style={{ width: width / numColumns - 3, height: width / numColumns - 3}}
              source={{ uri: item.uri }} >
            </ImageBackground>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

export default VideoTile;