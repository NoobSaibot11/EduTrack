import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { RootStackParamList } from '../../navigation/types';

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

        const imagePath = photo.path;
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
    bottom: 100,
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
