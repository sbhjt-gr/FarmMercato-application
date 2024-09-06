import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress'; // Import Progress for Circle
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Firestore functions
import { getAuth } from 'firebase/auth'; // Authentication functions

const UserType = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true); // For showing the loader
  
  useEffect(() => {
    const fetchUserType = async () => {
      setIsLoading(true);
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if (!user) {
        // If no user is logged in, navigate to HomeMain
        navigation.replace('HomeMain');
        return;
      }

      try {
        // Fetch the user document from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userType = userDoc.data().userType;

          // Navigate based on userType
          if (userType === 'farmer') {
            navigation.replace('farmerPage');
          } else if (userType === 'consumer') {
            navigation.replace('consumerPage');
          } else {
            navigation.replace('HomeMain');
          }
        } else {
          console.log("No such document found!");
          navigation.replace('HomeMain');
        }
      } catch (error) {
        console.error("Error fetching user type:", error);
        navigation.replace('HomeMain');
      } finally {
        setIsLoading(false); // Loader is finished once the type is fetched
      }
    };

    fetchUserType();

    // Set a timeout to refresh after 3 seconds and check the condition again
    const timeoutId = setTimeout(() => {
      fetchUserType();
    }, 3000);

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Progress.Circle 
        size={50} 
        indeterminate={true} 
        color="#E64E1F" // Custom color for loader
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
});

export default UserType;