/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { GluestackUIProvider } from '@gluestack-ui/themed';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/Navigator';
import { config } from './config/gluestack-ui.config';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    // backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    backgroundColor: "linear-gradient(to bottom, #6a11cb 0%, #2575fc 100%)",
    flex: 1
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <GluestackUIProvider config={config} colorMode={isDarkMode ? 'dark' : 'light'}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </GluestackUIProvider>
    </SafeAreaView>
  );
}


export default App;
