import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useTheme, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StatusBar, ImageBackground, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import from 'firebase/auth'
import HomeMain from './HomeMain';
import RegName from './accounts/RegName';
import RegEmailID from './accounts/RegEmailID';
import RegLocation from './accounts/RegLocation';
import UserType from './accounts/UserType';
import RegPassword from './accounts/RegPassword';
import LoginScreen from './accounts/LoginScreen';
import { auth } from './firebase'; // Import the configured auth
import farmerPage from './main/farmer'; // Import the AppTabs component
import consumerPage from './main/consumer'; // Import the AppTabs component


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const Stack = createStackNavigator();

export default function App() {
  const scheme = useColorScheme(); // Detect light or dark mode
  const [initializing, setInitializing] = useState(true); // Track if Firebase is initializing
  const [user, setUser] = useState(null); // Track the authenticated user

  useEffect(() => {
    const authListener = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (initializing) setInitializing(false);
    });
    return authListener; // Unsubscribe on unmount
  }, [initializing]);

  if (initializing) return null; // Wait for Firebase to initialize before rendering the navigator

  // Custom Light Theme
  const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'rgba(163,40,161, 0.07)', // Transparent purple for light mode
    },
  };

  // Custom Dark Theme
  const darkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#1F001E', // Transparent grey for dark mode
    },
  };

  return (
    
    <NavigationContainer theme={scheme === 'dark' ? darkTheme : lightTheme}>
      <StatusBar
        backgroundColor='#483178'
      />
      <SafeAreaProvider>
        <ImageBackground
          style={{ height: screenHeight, width: screenWidth }}
          source={require('./image/background.jpg')}
          resizeMode="cover"
        >
          <Stack.Navigator
            screenOptions={{
              gestureEnabled: true,
              headerStyle: { backgroundColor: '#573B91' },
              headerTintColor: '#fff',
            }}>
                <Stack.Screen
                  name="farmerPage"
                  component={farmerPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="consumerPage"
                  component={consumerPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="UserType"
                  component={UserType}
                  options={{ headerShown: false }}
                />
                  <Stack.Screen
                    name="HomeMain"
                    component={HomeMain}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="RegName"
                    component={RegName}
                    options={{ title: "Enter your name" }}
                  />
                  <Stack.Screen
                    name="RegLocation"
                    component={RegLocation}
                    options={{ title: "Enter your address" }}
                  />
                  <Stack.Screen
                    name="RegEmailID"
                    component={RegEmailID}
                    options={{ title: "Enter your email ID" }}
                  />
                  <Stack.Screen
                    name="RegPassword"
                    component={RegPassword}
                    options={{ title: "Enter your password" }}
                  />
                  <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{ title: "Login to your account" }} />
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
    opacity: 0.5,
  },
});
