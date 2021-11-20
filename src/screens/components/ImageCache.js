import React, { useEffect, useRef, useState } from "react";
import {Image, View, ActivityIndicator } from "react-native";
import { Avatar,Image as ImageReactElement } from "react-native-elements";
import { Avatar as AvatarNativeBase } from "native-base";
import * as FileSystem from "expo-file-system";

function getImageName(uri) {
  return uri.split(/[\\/]/).pop();
}
async function findImageInCache(uri) {
  try {
    let info = await FileSystem.getInfoAsync(uri);
    return { ...info, err: false };
  } catch (error) {
    return {
      exists: false,
      err: true,
      msg: error,
    };
  }
}
async function cacheImage(uri, cacheUri, callback) {
  try {
    const downloadImage = FileSystem.createDownloadResumable(
      uri,
      cacheUri,
      {},
      callback
    );
    const downloaded = await downloadImage.downloadAsync();
    return {
      cached: true,
      err: false,
      path: downloaded.uri,
    };
  } catch (error) {
    return {
      cached: false,
      err: true,
      msg: error,
    };
  }
}

export const ImageCache = (props) => {
  const {
    source: { uri },
    ...rest
  } = props;
  const isMounted = useRef(true);
  const [imgUri, setUri] = useState("");
  useEffect(() => {
    const imageName = getImageName(uri);
    async function loadImg() {
      const cacheFileUri = `${FileSystem.cacheDirectory}${imageName}`;
      let imgXistsInCache = await findImageInCache(cacheFileUri);
      if(isMounted.current)
      if (imgXistsInCache.exists) {
        setUri(cacheFileUri);
      } else {
        let cached = await cacheImage(uri, cacheFileUri, () => {});
        if (cached.cached) {
          setUri(cached.path);
        }
      }
    }
    loadImg();
    return () => (isMounted.current = false);
  }, []);
  return (
    <>
      {imgUri ? (
        <Image source={{ uri: imgUri }} {...rest} />
      ) : (
        <View
          style={{alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size={33} />
        </View>
      )}
    </>
  );
};

export const ImageReactElementCache = (props) => {
    const {
      source: { uri },
      ...rest
    } = props;
    const isMounted = useRef(true);
    const [imgUri, setUri] = useState("");
    useEffect(() => {
      const imageName = getImageName(uri);
      async function loadImg() {
        const cacheFileUri = `${FileSystem.cacheDirectory}${imageName}`;
        let imgXistsInCache = await findImageInCache(cacheFileUri);
        if(isMounted.current)
        if (imgXistsInCache.exists) {
          setUri(cacheFileUri);
        } else {
          let cached = await cacheImage(uri, cacheFileUri, () => {});
          if (cached.cached) {
            setUri(cached.path);
          }
        }
      }
      loadImg();
      return () => (isMounted.current = false);
    }, []);
    return (
      <>
        {imgUri ? (
          <ImageReactElement source={{ uri: imgUri }} {...rest} />
        ) : (
          <ImageReactElement {...rest} />
        )}
      </>
    );
  };

  export const AvatarReactElementCache = (props) => {
    const {
      source: { uri },
      ...rest
    } = props;
    const isMounted = useRef(true);
    const [imgUri, setUri] = useState("");
    useEffect(() => {
      const imageName = getImageName(uri);
      async function loadImg() {
        const cacheFileUri = `${FileSystem.cacheDirectory}${imageName}`;
        let imgXistsInCache = await findImageInCache(cacheFileUri);
        if(isMounted.current)
        if (imgXistsInCache.exists) {
          setUri(cacheFileUri);
        } else {
          let cached = await cacheImage(uri, cacheFileUri, () => {});
          if (cached.cached) {
            setUri(cached.path);
          }
        }
      }
      loadImg();
      return () => (isMounted.current = false);
    }, []);
    return (
      <>
        {imgUri ? (
          <Avatar source={{ uri: imgUri }} {...rest} />
        ) : (
          <Avatar {...rest} />
        )}
      </>
    );
  };

  export const AvatarNativeBaseCache = (props) => {
    const {
      source: { uri },
      ...rest
    } = props;
    const isMounted = useRef(true);
    const [imgUri, setUri] = useState("");
    useEffect(() => {
      const imageName = getImageName(uri);
      async function loadImg() {
        const cacheFileUri = `${FileSystem.cacheDirectory}${imageName}`;
        let imgXistsInCache = await findImageInCache(cacheFileUri);
        if(isMounted.current)
        if (imgXistsInCache.exists) {
          setUri(cacheFileUri);
        } else {
          let cached = await cacheImage(uri, cacheFileUri, () => {});
          if (cached.cached) {
            setUri(cached.path);
          }
        }
      }
      loadImg();
      return () => (isMounted.current = false);
    }, []);
    return (
      <>
        {imgUri ? (
          <AvatarNativeBase source={{ uri: imgUri }} {...rest} />
        ) : (
          <AvatarNativeBase {...rest} />
        )}
      </>
    );
  };