// src/screens/CameraScreen.tsx

import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

const CameraScreen: React.FC = () => {
  const cameraRef = useRef<Camera>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [cameraReady, setCameraReady] = useState(false);

  const device = useCameraDevice('back');

  const handleCapture = async () => {
    if (cameraRef.current && cameraReady) {
      try {
        const photo = await cameraRef.current.takePhoto({
          flash: 'off',
        });

        // This will return a file path like: "file:///..."
        const imagePath = photo.path;

        // Navigate using the image path (base64 not directly supported)
        navigation.navigate('Home', { image: imagePath });
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Could not take picture.');
      }
    }
  };

  if (device === undefined) {
    navigation.navigate('Home', { image: undefined });
    return;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.preview}
        device={device}
        isActive={true}
        onInitialized={() => setCameraReady(true)}
        photo={true}
        audio={false}
      />

      <TouchableOpacity onPress={handleCapture} style={styles.captureButton}>
        <Text style={styles.captureText}>Capture</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  captureButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  captureText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CameraScreen;
