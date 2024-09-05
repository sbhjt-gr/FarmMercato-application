import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { Button, Input, Text} from '@rneui/themed'
import { auth } from "../firebase.js"
import TypingEffect from "../TypingEffect";

export default function RegName({ navigation, route }) {
  const [number, setNumber] = useState("")
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) =>
    {
        if(authUser) {
            navigation.replace('HomeMain')
        }
    });
    return unsubscribe;
    }, []);
  return (
    <KeyboardAvoidingView behavior='padding'>
      <View style={styles.bottomElement}>
      <TypingEffect 
          text="Enter your phone number" 
          speed={50}
          type='h3'
        />
      <Input containerStyle={{
          width: 370
        }} placeholder="Phone Number (with no country code)" maxLength={10} autofocus type="number" value={number} keyboardType='decimal-pad' onChangeText={ function(text) {setNumber(text)}} />
      <Button onPress={
        function() {
        if(number.length != 10) {
          alert('Phone number should be of 10 digits.')
        } else { 
          navigation.navigate('RegLocation', { 
            emailid: route.params.emailid, 
            name: route.params.name, 
            type: route.params.type, 
            number: number 
          })
        }}} raised title="Next" 
        containerStyle={{
          width: 350,
          marginHorizontal: 50,
          marginVertical: 10,
        }}
        size="lg"
        buttonStyle={styles.button} />
      </View>
    </KeyboardAvoidingView>
  )
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
