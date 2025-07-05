import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Alert,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCameraPermission } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { HomeScreenNavProp, HomeScreenRouteProp } from './types';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const { hasPermission, requestPermission } = useCameraPermission();

  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigateToCamera = async () => {
    if (!hasPermission) {
      const newPermissionStatus = await requestPermission();
      if (!newPermissionStatus) {
        Alert.alert('Permission Denied', 'Camera permission is required.');
        return;
      }
    }
    navigation.navigate('Camera');
  };

  const uploadImageToApi = async (imagePath: string) => {
    try {
      setLoading(true);
      const base64Image = await RNFS.readFile(imagePath, 'base64');

      const response = await axios.post(
        'https://your-api-endpoint.com/analyze', // Replace with your API
        { image: base64Image },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      setApiResponse(response.data.result);
    } catch (error: any) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Failed to fetch response from the API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (route.params?.image) {
      uploadImageToApi(route.params.image);
    }
  }, [route.params?.image]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.parentBox}>
          {route.params?.image && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: 'file://' + route.params.image }}
                style={styles.previewImage}
              />
            </View>
          )}
          <Card style={styles.card}>
            <Card.Title title="Details" titleVariant="headlineSmall" />
            <Card.Content>
              {loading ? (
                <ActivityIndicator size="large" />
              ) : (
                <Text style={styles.statusText}>
                  {apiResponse || 'No details yet.'}
                </Text>
              )}
            </Card.Content>
          </Card>
        </View>

        <Button
          mode="contained"
          onPress={navigateToCamera}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Open Camera</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  scroll: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  parentBox: {
    flex: 1,
  },
  card: {
    marginTop: 30,
    padding: 10,
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 3,
  },
  statusText: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonText: {
    color: '#ffffff',
  },
  button: {
    marginTop: 30,
    padding: 8,
    borderRadius: 8,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 20,
  },
});

export default HomeScreen;
