import React from 'react';
import {
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import { Camera } from 'expo-camera';
import ImageTile from './ImageTile'

const {width} = Dimensions.get('window');

export default class ImageSelect extends React.Component {
  static defaultProps = {
    loadCount: 50,
    emptyStayComponent: null,
    preloaderComponent: <ActivityIndicator size='large'/>,
    mediaType: [MediaLibrary.MediaType.photo],
    selected: [],
    onChange: (value)=>{},
    max: 4,
  }

  state = {
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    numColumns: 3,
    photos: ["camera"],
    selected: [],
    isEmpty: false,
    after: null,
    hasNextPage: true
  }

  async componentDidMount() {
    await this.getPermissionsAsync();
    this.getPhotos();
  }

  getPermissionsAsync = async () => {
    const {status: camera} =  await Camera.requestCameraPermissionsAsync();
    const {status: cameraRoll} = await MediaLibrary.requestPermissionsAsync();
    this.setState({
      hasCameraPermission: camera === 'granted',
      hasCameraRollPermission: cameraRoll === 'granted'
    });
  }

  selectImage = (image) => {
    let newSelected = Array.from(this.props.selected);
    let index = newSelected.findIndex((e)=> e.id === image.id);
    if (index === -1) {
      if (newSelected.length >= this.props.max) return;
      //image = await MediaLibrary.getAssetInfoAsync(image)
      newSelected.push(image);
    } else {
      newSelected.splice(index, 1);
    }
    if (newSelected.length > this.props.max) return;
    if (!newSelected) newSelected = [];
    this.props.onChange(newSelected);
  }

  getPhotos = () => {
    const params = {
      first: this.props.loadCount,
      mediaType: this.props.mediaType,
      sortBy: [MediaLibrary.SortBy.creationTime]
    };
    if (this.state.after) params.after = this.state.after;
    if (!this.state.hasNextPage) return;
    MediaLibrary
      .getAssetsAsync(params)
      .then(this.processPhotos);
  }

  processPhotos = (data) => {
    if (data.totalCount) {
      if (this.state.after === data.endCursor) return;
      const uris = data.assets;
      this.setState({
        photos: [...this.state.photos, ...uris],
        after: data.endCursor,
        hasNextPage: data.hasNextPage
      });
    } else {
      this.setState({isEmpty: true});
    }
  }

  getItemLayout = (data, index) => {
    const length = width / this.state.numColumns;
    return {length, offset: length * index, index};
  }

  renderImageTile = ({item, index}) => {
    const selected = this.props.selected.findIndex(e => e.id === item.id) !== -1;
    const selectedItemNumber = this.props.selected.findIndex(e => e.id === item.id) + 1;
    return (
      <ImageTile
        index = {index}
        numColumns={this.state.numColumns}
        selectedItemNumber={selectedItemNumber}
        item={item}
        selected={selected}
        selectImage={this.selectImage}
        refresh = {this.refresh}
      />
    );
  }

  renderPreloader = () => this.props.preloaderComponent;

  renderEmptyStay = () => this.props.emptyStayComponent;

  render() {
    const {hasCameraPermission} = this.state;
    if (!hasCameraPermission) return this.props.noCameraPermissionComponent || null;

    return (
      <View style={this.props.style}>
        <FlatList
            data={this.state.photos}
            numColumns={this.state.numColumns}
            key={this.state.numColumns}
            renderItem={this.renderImageTile}
            keyExtractor={(_, index) => index}
            onEndReached={() => this.getPhotos()}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={this.state.isEmpty ? this.renderEmptyStay() : this.renderPreloader()}
            initialNumToRender={24}
            getItemLayout={this.getItemLayout}
        />
      </View>
    );
  }
}