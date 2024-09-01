import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { auth } from "../firebase.js";
import TypingEffect from "../TypingEffect";

export default function RegEmail({ navigation, route }) {
  const [emailid, setEmailID] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace('HomeMain');
      }
    });
    return unsubscribe;
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleNextPress = () => {
    if (!emailid) {
      alert('Enter your email ID');
    } else if (!validateEmail(emailid)) {
      alert('Your email ID is not valid.');
    } else {
      navigation.navigate('RegPassword', { emailid: emailid, name: route.params.name, type: route.params.type });
    }
  };

  return (
    <KeyboardAvoidingView behavior='padding'>
        <View style={styles.bottomElement}>
          <TypingEffect 
            text="Enter your email address" 
            speed={50}
            type='h3'
          />

        <Input 
          containerStyle={{ width: 370 }} 
          placeholder="Email ID" 
          autofocus 
          type="text" 
          value={emailid} 
          onChangeText={text => setEmailID(text)} 
        />

        <Button 
          onPress={handleNextPress} 
          raised 
          title="Next" 
          size="lg"
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          rippleColor='#473178'
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bottomElement: {
    top: 50,
    alignItems: "center",
  },
  buttonContainer: {
    width: '90%',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    backgroundColor: "#E64E1F",
  },
  googleButton: {
    width: '100%',
    backgroundColor: "transparent", 
    borderWidth: 1, 
    borderColor: "#E64E1F", 
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#E64E1F",
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 30
  },
});
