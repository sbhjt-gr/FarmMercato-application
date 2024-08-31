import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, StatusBar } from 'react-native';
import { Button, Image, Text} from '@rneui/themed';
import Icon from 'react-native-vector-icons/AntDesign';

const TypingEffect = ({ text, speed }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isCursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index += 1;
      if (index >= text.length) {
        clearInterval(typingInterval);
        setCursorVisible(false);
      }
    }, speed);

    
    const cursorInterval = setInterval(() => {
      if (index < text.length) {
        setCursorVisible((prev) => !prev);
      }
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [text, speed]);

  return (
    <View style={styles.typingContainer}>
      <Text style={styles.descContent}>{displayedText}</Text>
      {isCursorVisible && <Text style={styles.cursor}>|</Text>}
    </View>
  );
};

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
          />
          <TypingEffect 
            text="As a consumer, directly buy from farmers and save the money going to the middleman!" 
            speed={50}
          />
        </View>
        <View style={styles.content}>
          <Button 
            size="lg"
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            rippleColor='#473178'
            icon={() => <Icon name="adduser" size={18} color="#fff" />}
            onPress={() => { navigation.navigate('Registration') }}
          >
            Register as a Farmer!
          </Button>
          <Button 
            size="lg"
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            rippleColor='#473178'
            icon={() => <Icon name="adduser" size={18} color="#fff" />}
            onPress={() => { navigation.navigate('Registration') }}
          >
            Register as a Buyer!
          </Button>
        </View>
        <View style={styles.alreadyUser}>
          <Text style={{ color: 'white' }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => { navigation.navigate('Login') }}>
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
    marginTop: 20,
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
  },
  descContent: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    padding: 5,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cursor: {
    color: 'white',
    fontSize: 20,
    marginLeft: 2,
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
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
});
