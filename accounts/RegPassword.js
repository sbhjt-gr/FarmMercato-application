import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Modal, useWindowDimensions } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { auth } from "../firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import * as Progress from 'react-native-progress';
import TypingEffect from "../TypingEffect";
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions

const evaluatePasswordStrength = (password) => {
  const lengthCriteria = password.length >= 8;
  const numberCriteria = /[0-9]/.test(password);
  const upperCaseCriteria = /[A-Z]/.test(password);
  const lowerCaseCriteria = /[a-z]/.test(password);
  const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let strength = 0;
  if (lengthCriteria) strength += 1;
  if (numberCriteria) strength += 1;
  if (upperCaseCriteria) strength += 1;
  if (lowerCaseCriteria) strength += 1;
  if (specialCharCriteria) strength += 1;

  switch (strength) {
    case 5:
      return { progress: 1, color: '#4CAF50', text: 'Strong (100%)' }; // Strong
    case 4:
      return { progress: 0.75, color: '#FFC107', text: 'Medium (50%)' }; // Medium
    case 3:
      return { progress: 0.5, color: '#FF9800', text: 'Weak (25%)' }; // Weak
    default:
      return { progress: 0.25, color: '#F44336', text: 'Very Weak (0%)' }; // Very Weak
  }
};

export default function RegPassword({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState({ progress: 0, color: '#F44336', text: 'Very Weak' });
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const handlePasswordChange = (text) => {
    setPassword(text);
    setStrength(evaluatePasswordStrength(text));
    setHasStartedTyping(text.length > 0);
  };

  const signUp = async () => {
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (password) {
      try {
        setIsLoading(true);
        const { user } = await createUserWithEmailAndPassword(auth, route.params.emailid, password);
        await updateProfile(user, {
          displayName: route.params.name,
        });

        // Store user type and additional data in Firestore
        const db = getFirestore();
        await setDoc(doc(db, "users", user.uid), {
          displayName: route.params.name,
          state: route.params.state, 
          fullAddress: route.params.fullAddress, 
          landmark: route.params.landmark, 
          pincode: route.params.pinCode,
          emailid: route.params.emailid, 
          userType: route.params.type,
          number: route.params.number
        });

        setIsLoading(false);
      
        navigation.replace('UserType');
      } catch (error) {
        alert(error.message);
        setIsLoading(false);
      }
    } else {
      alert("Create a password first!");
    }
  };

  return (
    <KeyboardAvoidingView behavior='padding'>
      <View style={styles.bottomElement}>
        <Modal visible={isLoading} transparent>
          <View style={styles.modal}>
            <Progress.Bar width={width * 0.6} indeterminate={true} color="#483178" />
          </View>
        </Modal>
        <TypingEffect 
            text="Create a password" 
            speed={50}
            type='h3'
          />
          {/* <Text>{route.params.number}</Text> */}
        <Input
          placeholder="Set Password"
          containerStyle={{ width: 370 }}
          secureTextEntry
          type="password"
          value={password}
          onChangeText={handlePasswordChange}
          onSubmitEditing={signUp}
        />
        {hasStartedTyping && (
          <View style={styles.progressContainer}>
            <Progress.Bar
              progress={strength.progress}
              width={width * 0.6}
              color={strength.color}
              borderColor="transparent"
              style={styles.progressBar}
            />
            <Text style={[styles.strengthText, { color: strength.color }]}>Strength: {strength.text}</Text>
          </View>
        )}
        <Button
          onPress={signUp}
          raised
          title="Sign Up"
          containerStyle={{
            width: 350,
            marginHorizontal: 50,
            marginVertical: 10,
          }}
          size="lg"
          buttonStyle={styles.button}
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
  button: {
    width: '100%',
    backgroundColor: "#E64E1F",
  },
  modal: {
    flex: 1,
    backgroundColor: '#eee',
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    marginLeft: '5%',
    marginBottom: '3%',
    alignItems: 'flex-start', 
    width: '90%',
  },
  progressBar: {
    marginBottom: 10,
  },
  strengthText: {
    fontSize: 14,
  },
});
