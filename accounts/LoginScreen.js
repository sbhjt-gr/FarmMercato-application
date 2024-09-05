import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Modal, Image, useWindowDimensions, Platform, TouchableOpacity } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons'; 
import { auth } from "../firebase.js";
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import doc and getDoc
import { signInWithEmailAndPassword } from 'firebase/auth';
import * as Progress from 'react-native-progress';
import TypingEffect from '../TypingEffect';

export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();
  const [password, setPassword] = useState("");

  const signIn = async () => {
    if (email && password) {
      try {
        setIsLoading(true);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Directly navigate to Farmer page if user exists
        navigation.replace('UserType');
      } catch (err) {
        alert(err.message);
        setIsLoading(false);
      }
    } else {
      alert("Enter all your details first!");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" style={styles.backButton} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        try {
          // Assuming the user exists; navigate to Farmer page
          navigation.replace('UserType');
        } catch (error) {
          console.error("Error handling authenticated user: ", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.innerContainer}>
        <Modal visible={isLoading} transparent>
          <View style={styles.modal}>
            <Progress.Bar width={width * 0.6} indeterminate={true} color="#483178" />
          </View>
        </Modal>
        <Image source={require('../image/farmer.png')} style={styles.image} />
        <TypingEffect 
          text="Login to your account!" 
          speed={50}
          type='h3'
        />
        <Input
          placeholder="E-mail ID"
          type="email"
          value={email}
          containerStyle={styles.inputContainer}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="text"
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn}
          containerStyle={styles.inputContainer}
        />
        <Button
          raised
          title="Log In"
          containerStyle={styles.buttonContainer}
          size="lg"
          buttonStyle={styles.button}
          onPress={signIn}
        />
        <Button
          title="Sign in with Google"
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
            alert('Feature will be available soon. Please go with the manual log in for now.');
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  typingText: {
    color: '#696969',
    marginBottom: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#E64E1F",
  },
  googleButtonContainer: {
    width: '100%',
    marginVertical: 10,
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
  modal: {
    flex: 1,
    backgroundColor: '#eee',
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    marginLeft: 15,
    color: 'white'
  },
});
