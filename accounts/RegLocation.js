import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, View, Alert } from 'react-native';
import { Button, Text, Input } from '@rneui/themed';
import { Picker } from '@react-native-picker/picker';
import TypingEffect from '../TypingEffect'; // Assuming TypingText is a custom component for typing effect

export default function RegLocation({ navigation, route }) {
  const [selectedState, setSelectedState] = useState(null);
  const [fullAddress, setFullAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pinCode, setPinCode] = useState('');

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", 
    "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
  ];

  const handleNextPress = () => {
    if (!selectedState || !fullAddress || !landmark || !pinCode) {
      Alert.alert('Error', 'Please fill in all the fields.');
    } else {
      navigation.navigate('RegPassword', { 
        state: selectedState, 
        fullAddress: fullAddress, 
        landmark: landmark, 
        pinCode: pinCode,
        emailid: route.params.emailid, 
        name: route.params.name, 
        type: route.params.type,
        number: route.params.number
      });
    }
  };

  return (
    <KeyboardAvoidingView behavior='padding'>
      <View style={styles.container}>
          <TypingEffect 
            text="Enter your address" 
            speed={50}
            type='h3'
          />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedState}
            onValueChange={(itemValue) => setSelectedState(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select State" value={null} />
            {states.map((state, index) => (
              <Picker.Item key={index} label={state} value={state} />
            ))}
          </Picker>
        </View>
        <Input
          placeholder="Enter Full Address"
          value={fullAddress}
          onChangeText={setFullAddress}
          style={styles.input}
        />
        <Input
          placeholder="Enter Landmark"
          value={landmark}
          onChangeText={setLandmark}
          style={styles.input}
        />
        <Input
          placeholder="Enter Pin Code"
          value={pinCode}
          onChangeText={setPinCode}
          keyboardType="numeric"
          maxLength={6}
          style={styles.input}
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
  container: {
    padding: 20,
    alignItems: 'center',
  },
  typingText: {
    fontSize: 24,
    marginBottom: 20,
  },
  pickerContainer: {
    width: 370,
    marginBottom: 25,
    backgroundColor: '#473178',
    borderRadius: 5,
  },
  picker: {
    color: '#fff',
  },
  input: {
    width: 370,
    marginBottom: 15,
  },
  buttonContainer: {
    width: '90%',
    marginTop: 20,
  },
  button: {
    width: '100%',
    backgroundColor: "#E64E1F",
  },
});