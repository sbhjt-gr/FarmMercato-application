import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, View, Image } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { auth } from "../firebase.js";
import TypingEffect from "../TypingEffect";

export default function RegName({ navigation, route }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace('HomeMain');
      }
    });
    return unsubscribe;
  }, []);

  const handleNameChange = (text) => {
    const formattedText = text.replace(/[^a-zA-Z\s]/g, '');
    const capitalizedText = formattedText
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    setName(capitalizedText);

    if (capitalizedText.trim().split(' ').length < 2) {
      setError("Name must contain both your first & last name.");
    } else {
      setError("");
    }
  };

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
      <View style={styles.bottomElement}>
        <TypingEffect 
          text="Enter your full name" 
          speed={50}
          type='h3'
        />

        <Input 
          containerStyle={styles.inputContainer} 
          placeholder="Full Name" 
          value={name} 
          onChangeText={handleNameChange}
          errorMessage={error} 
        />

        <Button 
          onPress={() => {
            if (!name || error) {
              alert('Please enter a valid name.');
            } else {
              navigation.navigate('RegLocation', { name: name, type: route.params.type });
            }
          }} 
          raised 
          title="Next" 
          size="lg"
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          rippleColor='#473178'
        />

        <Button
          title="Sign up with Google"
          size="lg"
          containerStyle={styles.googleButtonContainer}
          buttonStyle={styles.googleButton}
          icon={
            <Image 
              source={require('../image/google.png')} 
              style={styles.googleIcon}
            />
          }
          titleStyle={styles.googleButtonText}
          onPress={() => {
            alert('Feature will be available soon. Please go with the manual registration for now.');
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomElement: {
    alignItems: "center",
    paddingVertical: 50, 
    flex: 1,
  },
  inputContainer: {
    width: 370,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '90%',
  },
  button: {
    width: '100%',
    backgroundColor: "#E64E1F",
  },
  googleButtonContainer: {
    width: '90%',
    marginBottom: 20,
    position: 'absolute',
    bottom: 30, 
  },
  googleButton: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: "rgba(115, 79, 194, 0.2)", 
    borderWidth: 1,
    borderColor: "#473178",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#473178",
  },
});
