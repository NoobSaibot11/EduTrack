import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Alert, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card } from 'react-native-paper';
import {
  useNavigation,
  useIsFocused,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useCameraPermission } from 'react-native-vision-camera';
import { ImageUtil, MobileModel } from 'react-native-pytorch-core';

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
type HomeScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type ImageClassificationResult = {
  maxIdx: number;
  confidence: number;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const isFocused = useIsFocused();
  const [topClass, setTopClass] = useState<string>('');
  const { hasPermission, requestPermission } = useCameraPermission();

  const [attendanceStatus, setAttendanceStatus] = useState<
    'Present' | 'Denied' | 'Not Marked'
  >('Not Marked');

  // const model = require('./mobilenet_v3_small.ptl');
  // const IMAGE_CLASSES = require('./image_classes.json');

  const navigateToCamera = async () => {
    if (!hasPermission) {
      requestPermission().then(newPermissionStatus => {
        if (newPermissionStatus) {
          navigation.navigate('Camera');
          return;
        }
        Alert.alert('Permission Denied', 'Camera permission is required.');
        return;
      });
    }
    navigation.navigate('Camera');
  };

  // useEffect(() => {
  //   const markAttendance = async (base64Image: string) => {
  //     try {
  //       const image = await ImageUtil.fromURL(base64Image);

  //       const { metrics, result } =
  //         await MobileModel.execute<ImageClassificationResult>(model, {
  //           image,
  //         });

  //       console.log(metrics);
  //       if (result.confidence > 0.7) {
  //         setTopClass(IMAGE_CLASSES[result.maxIdx]);
  //       } else {
  //         setTopClass('low confidence');
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   if (isFocused && route.params?.image) {
  //     markAttendance(route.params.image);
  //   }
  // }, [IMAGE_CLASSES, isFocused, model, route.params]);

  return (
    <SafeAreaView style={styles.container}>
      {route.params?.image && (
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: route.params.image.startsWith('/')
                ? 'file://' + route.params.image
                : `data:image/jpeg;base64,${route.params.image}`,
            }}
            style={styles.previewImage}
          />
        </View>
      )}
      <Card style={styles.card}>
        <Card.Title title="Attendance Status" />
        <Card.Content>
          <Text style={[styles.statusText, getStatusStyle(attendanceStatus)]}>
            {attendanceStatus}
          </Text>
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={navigateToCamera} style={styles.button}>
        Open Camera
      </Button>
    </SafeAreaView>
  );
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Present':
      return { color: 'green' };
    case 'Denied':
      return { color: 'red' };
    default:
      return { color: 'gray' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    marginBottom: 30,
    padding: 10,
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 3,
  },
  statusText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    padding: 8,
    borderRadius: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
    resizeMode: 'cover',
  },
});

export default HomeScreen;
