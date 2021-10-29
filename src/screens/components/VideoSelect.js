import React from "react";
import {
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { Camera } from "expo-camera";
import VideoTile from "./VideoTile";
import { Overlay } from "react-native-elements";
import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import IconHeaderClose from "../../../assets/icn_close.svg";

const { width, height } = Dimensions.get("window");

export default class VideoSelect extends React.Component {
  static defaultProps = {
    loadCount: 50,
    emptyStayComponent: null,
    preloaderComponent: <ActivityIndicator size="large" />,
    mediaType: [MediaLibrary.MediaType.video],
    selected: [],
    onChange: (value) => {},
    max: 1,
  };

  state = {
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    numColumns: 3,
    photos: ["camera"],
    selected: [],
    isEmpty: false,
    after: null,
    hasNextPage: true,
    visible: false,
    video: null,
  };
  videoRef = React.createRef();

  async componentDidMount() {
    await this.getPermissionsAsync();
    this.getPhotos();
  }

  getPermissionsAsync = async () => {
    const { status: camera } = await Camera.requestCameraPermissionsAsync();
    const { status: cameraRoll } = await MediaLibrary.requestPermissionsAsync();
    this.setState({
      hasCameraPermission: camera === "granted",
      hasCameraRollPermission: cameraRoll === "granted",
    });
  };

  selectImage = (image) => {
    this.props.onChange(image);
  };

  getPhotos = () => {
    const params = {
      first: this.props.loadCount,
      mediaType: this.props.mediaType,
      sortBy: [MediaLibrary.SortBy.creationTime],
    };
    if (this.state.after) params.after = this.state.after;
    if (!this.state.hasNextPage) return;
    MediaLibrary.getAssetsAsync(params).then(this.processPhotos);
  };

  processPhotos = (data) => {
    if (data.totalCount) {
      if (this.state.after === data.endCursor) return;
      const uris = data.assets;
      this.setState({
        photos: [...this.state.photos, ...uris],
        after: data.endCursor,
        hasNextPage: data.hasNextPage,
      });
    } else {
      this.setState({ isEmpty: true });
    }
  };

  getItemLayout = (data, index) => {
    const length = width / this.state.numColumns;
    return { length, offset: length * index, index };
  };

  renderImageTile = ({ item, index }) => {
    return (
      <VideoTile
        index={index}
        numColumns={this.state.numColumns}
        item={item}
        selectImage={this.selectImage}
        preView={this.preview}
      />
    );
  };

  preview = (video) => {
    this.setState({ visible: true, video: video });
  };

  done = () => {
    this.setState({ visible: false });
    this.videoRef.current.stopAsync();
    this.selectImage(this.state.video);
  };

  renderPreloader = () => this.props.preloaderComponent;

  renderEmptyStay = () => this.props.emptyStayComponent;

  render() {
    const { hasCameraPermission } = this.state;
    if (!hasCameraPermission)
      return this.props.noCameraPermissionComponent || null;

    return (
      <View style={this.props.style}>
        <Overlay
          isVisible={this.state.visible}
          onBackdropPress={() => {
            this.setState({ visible: false });
            this.videoRef.current.stopAsync();
          }}
        >
          <View
            style={{
              height: Dimensions.get("window").height,
              width: Dimensions.get("window").width,
              position: "relative",
              display: this.state.visible ? "flex" : "none",
            }}
          >
            <Video
              ref={this.videoRef}
              style={{ height: height, width: width }}
              source={this.state.video}
              resizeMode="contain"
              isLooping
              onLoad={() => this.videoRef.current.playAsync()}
            />

            <View
              style={{
                height: 60,
                opacity: 0.6,
                backgroundColor: "#000",
                position: "absolute",
                top: 0,
                width: width,
              }}
            >
              <TouchableOpacity
                style={styles.iconClose}
                onPress={() => {
                  this.setState({ visible: false });
                  this.videoRef.current.stopAsync();
                }}
              >
                <IconHeaderClose />
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: 50,
                backgroundColor: "#000",
                position: "absolute",
                bottom: 0,
                width: width,
              }}
            >
              <TouchableHighlight
                style={styles.wrapLoginButton}
                activeOpacity={0.8}
                underlayColor="#3f3f3f"
                onPress={this.done}
              >
                <LinearGradient
                  colors={enableColor}
                  start={[0, 1]}
                  end={[1, 0]}
                  style={styles.button}
                >
                  <View style={styles.centerView}>
                    <Text style={{ color: "#fff", fontWeight: "500" }}>
                      Xong
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableHighlight>
            </View>
          </View>
        </Overlay>
        <FlatList
          data={this.state.photos}
          numColumns={this.state.numColumns}
          key={this.state.numColumns}
          renderItem={this.renderImageTile}
          keyExtractor={(_, index) => index}
          onEndReached={() => this.getPhotos()}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            this.state.isEmpty ? this.renderEmptyStay() : this.renderPreloader()
          }
          initialNumToRender={24}
          getItemLayout={this.getItemLayout}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    color: "#fff",
    height: 62,
  },
  iconBack: {
    marginTop: 30,
    left: 10,
  },
  iconBackWrap: {
    width: 40,
    position: "absolute",
  },
  title: {
    marginTop: 30,
    marginLeft: "auto",
    marginRight: "auto",
    color: "#fff",
    fontSize: 18,
  },
  istruction: {
    backgroundColor: "#f9fafc",
    width: "100%",
    height: 40,
    paddingTop: 10,
    paddingLeft: 12,
  },
  button: {
    width: "100%",
    height: 40,
    alignSelf: "center",
    borderRadius: 20,
  },
  wrapLoginButton: {
    width: "50%",
    marginTop: "auto",
    marginBottom: "auto",
    alignSelf: "center",
    borderRadius: 20,
  },
  centerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconClose: {
    marginTop: 24,
    left: 10,
  },
});

const enableColor = ["#0085ff", "#05adff"];
