import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Text } from '@rneui/themed';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase'; // Ensure this is the correct path

const Farmer = ({ navigation }) => {
  const [userType, setUserType] = useState('');
  const [userName, setUserName] = useState('');
  const [userUID, setUserUID] = useState('');

  // Function to fetch user data from Firestore
  const fetchUserData = async () => {
    try {
      const db = getFirestore();
      const userDoc = doc(db, "users", auth.currentUser.uid); // Use UID to access the document
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        console.log("User data fetched: ", userData); // Debugging
        setUserType(userData.userType || ''); // Set the userType from Firestore
        setUserName(auth.currentUser.displayName || ''); // Set the userName from Firebase Auth
      } else {
        console.log("No such document!"); // Debugging
      }
    } catch (error) {
      console.error("Error fetching user data: ", error); // Debugging
    }
  };

  // Function to handle logout
  const handleLogOut = async () => {
    try {
      await auth.signOut();
      navigation.replace("HomeMain"); // Navigate to HomeMain on logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Set header options using useLayoutEffect
  useLayoutEffect(() => {
    if (userName) {
      navigation.setOptions({
        title: `Welcome, ${userName}!`,
        headerRight: () => (
          <TouchableOpacity onPress={handleLogOut}>
            <Text style={{ color: '#fff', fontWeight: 'bold', marginRight: 15 }}>Log Out</Text>
          </TouchableOpacity>
        ),
        headerLeft: () => <></>,
      });
    }
  }, [navigation, userName]);

  // Fetch user data when component mounts
  useEffect(() => {
    if (auth.currentUser) {
      console.log("Current User UID: ", auth.currentUser.uid); // Debugging
      setUserUID(auth.currentUser.uid); // Set UID to state
      fetchUserData();
    } else {
      console.log('No user is currently logged in.'); // Debugging
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text h3>Hi, {userName}!</Text>
      <Text h3>You are a {userType}.</Text>
      <Button title="Log Out" onPress={handleLogOut} color="#E64E1F" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Farmer;
