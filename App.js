import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, ImageBackground, StyleSheet, Dimensions  } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeMain from './HomeMain.js';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const Stack = createNativeStackNavigator();

export default function App() {
    return(
    <NavigationContainer theme={{...DefaultTheme, colors: {...DefaultTheme.colors, background: 'rgba(64,171,250, 0.15'}}}>
        <StatusBar backgroundColor='#4875FF' barStyle='light-content' />
          <SafeAreaProvider>
            <ImageBackground style={{height: screenHeight, width: screenWidth}} source={require('./image/background.jpg')} resizeMode="cover">
              <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#4875FF'}, headerTintColor: '#fff'}}>
                <Stack.Screen
                  name = "HomeMain"
                  component = {HomeMain}
                  options={{headerShown: false}}
                />
            </Stack.Navigator>
          </ImageBackground>
        </SafeAreaProvider>
      </NavigationContainer>
    );

}

const styles = StyleSheet.create({
    imageBack: {
      height: screenHeight,
      width: screenWidth,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.5
    }
  })
  
  