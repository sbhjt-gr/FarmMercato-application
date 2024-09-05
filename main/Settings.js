// Settings.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Heading from './Heading';

const Settings = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  return (
    <View style={styles.tabContent}>
      <Heading />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    padding: 16,
  },
});

export default Settings;
