import React from 'react';
import {
  Dimensions,
  ImageBackground,
  TouchableHighlight,
  View,
  Text
} from 'react-native';
import UnCheck from '../../../assets/pick_photo_uncheck.svg'
import Check from '../../../assets/pick_photo_check.svg'
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library'
import IconCamera from '../../../assets/icn_camera.svg'
const {width} = Dimensions.get('window');

class ImageTile extends React.PureComponent {
  openCamera = async ()=>{
    let photo = await ImagePicker.launchCameraAsync(
      {
        presentationStyle: 	6,
        quality: 1,
      }
    )
    if(!photo.cancelled){
      const asset = await MediaLibrary.createAssetAsync(photo.uri)
      asset.snap = true
      this.props.selectImage(asset)
    }
  }

  render() {
    const { index, item, selected, selectImage, selectedItemNumber,numColumns,} = this.props;
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
              <Text style={{color:"#767676"}}>Chụp ảnh</Text>
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
        onPress={() => selectImage(item)} >
        <View style={{ position: 'relative' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ImageBackground
              style={{ width: width / numColumns - 3, height: width / numColumns - 3}}
              source={{ uri: item.uri }} >
              {selected &&
                <View style={{flex:1, opacity:0.5, backgroundColor: '#000'}}></View>
              }
              <View style={{position:"absolute", top:10, right:10}}> 
                {
                  selected ? <Check /> : <UnCheck/>
                }
                {selected && (
                  <View style={{position:"absolute", top:0, bottom: 0,left: 0,right :0,  justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{color:"#fff"}}>{selectedItemNumber}</Text>
                  </View>
                )}       
              </View>
            </ImageBackground>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

export default ImageTile;