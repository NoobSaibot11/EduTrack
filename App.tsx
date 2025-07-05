import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#f6f8fa" />
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
