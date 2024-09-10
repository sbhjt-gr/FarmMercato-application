import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, StatusBar } from 'react-native';
import { Button, Image, Text} from '@rneui/themed';
import Icon from 'react-native-vector-icons/AntDesign';
import TypingEffect from "./TypingEffect";

export default function HomeMain({ navigation, route }) {
  return (
    <>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="#483178"
      />
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require('./image/crops.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeTextContent}>Let's get started!</Text>
        </View>
        <View style={styles.desc}>
          <TypingEffect 
            text="Sell your agricultural products directly to consumer!" 
            speed={50}
            type='nor'
          />
          <TypingEffect 
            text="As a consumer, directly buy from farmers and save the money going to the middleman!" 
            speed={50}
            type='nor'
          />
        </View>
        <View style={styles.content}>
          <Button 
            size="lg"
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            rippleColor='#473178'
            icon={() => <Icon name="adduser" size={18} color="#fff" />}
            onPress={() => { navigation.navigate('RegName', {type: 'farmer'}) }}
          >
            Register as a Farmer
          </Button>
          <Button 
            size="lg"
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            rippleColor='#473178'
            icon={() => <Icon name="adduser" size={18} color="#fff" />}
            onPress={() => { navigation.navigate('RegName', {type: 'consumer'}) }}
          >
            Register as a Consumer
          </Button>
        </View>
        <View style={styles.alreadyUser}>
          <Text style={{ color: 'white' }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => { navigation.navigate('LoginScreen') }}>
            <Text style={{ fontWeight: 'bold', color: 'white' }}>
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  alreadyUser: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#573B91',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  welcomeText: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTextContent: {
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
  },
  desc: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginBottom: 40
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#FF5722',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});
