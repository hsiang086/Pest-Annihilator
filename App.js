import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import axios from 'axios';

import Button from './components/Button';
import ImageViewer from './components/ImageViewer';

const PlaceholderImage = require('./assets/pest.jpg');

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  const detectPestApi = async () => {
    const base64 = await FileSystem.readAsStringAsync(fileUri=selectedImage, { encoding: 'base64' });
    axios({
      method: 'POST',
      url: 'https://detect.roboflow.com/pest-detection-qvpee/3',
      params: {
        api_key: 'ToumOw2ArLdsofKlQMYQ',
      },
      data: base64,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then(function (response) {
      console.log(response.data['predictions']);
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer
          placeholderImageSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
        <Button theme="secondary" label="Detect Pest" onPress={detectPestApi} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex:1, 
    paddingTop: 58
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
