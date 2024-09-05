import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';

const Heading = () => (
  <View style={styles.headingContainer}>
    <Image source={require('../assets/images/icon.png')} style={styles.icon} />
    <Text style={styles.headingText}>FarmMarceto</Text>
  </View>
);

const styles = StyleSheet.create({
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#424242',
  },
});

export default Heading;