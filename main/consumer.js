import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList, Text } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, Input } from '@rneui/themed';
import * as Progress from 'react-native-progress';
import { getFirestore, collection, doc, getDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-elements';

const { width } = Dimensions.get('window');

// Heading Component
const Heading = () => (
  <View style={styles.headingContainer}>
    <Image source={require('../assets/images/icon.png')} style={styles.icon} />
    <Text style={styles.headingText}>FarmMercato Consumer</Text>
  </View>
);

const Search = ({ setPincode }) => {
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPincode, setSearchPincode] = useState('');

  useEffect(() => {
    fetchUserPincode();
  }, []);

  const fetchUserPincode = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is signed in.");
      return;
    }

    const uid = user.uid;
    const db = getFirestore();
    const userDoc = doc(db, 'users', uid);

    try {
      const docSnapshot = await getDoc(userDoc);
      console.log('Document snapshot exists:', docSnapshot.exists());

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        console.log('User data:', userData);
        const pincode = userData.pincode;
        console.log('Pincode:', pincode);
        setPincode(pincode); // Set the pincode in the parent component
        fetchFarmers(pincode); // Fetch farmers based on user pincode
      } else {
        console.error('No user data found for this UID.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchFarmers = async (pincode) => {
    setIsLoading(true);
    try {
      const db = getFirestore();
      const farmersQuery = query(
        collection(db, 'users'),
        where('userType', '==', 'farmer'),
        where('pincode', '==', pincode)
      );

      const querySnapshot = await getDocs(farmersQuery);
      const farmersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setFarmers(farmersList);
    } catch (error) {
      console.error('Error fetching farmers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.tabContent}>
      <Heading />
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <Progress.Circle size={50} indeterminate={true} color="#E64E1F" />
        </View>
      ) : (
        <>
          <Input
            placeholder="Search by Pincode"
            value={searchPincode}
            onChangeText={(text) => setSearchPincode(text)}
            onSubmitEditing={() => fetchFarmers(searchPincode)}
          />
          <FlatList
            data={farmers}
            renderItem={({ item }) => (
              <Card containerStyle={styles.cardContainer}>
                <Card.Title>{item.displayName}</Card.Title>
                <Card.Divider />
                <Text style={styles.addressText}>
                  {item.street}, {item.landmark}, {item.subDivision}, {item.district}, {item.state}, {item.pincode}
                </Text>
              </Card>
            )}
            keyExtractor={(item) => item.id}
          />
        </>
      )}
    </View>
  );
};

const ProduceListed = ({ pincode, refreshList }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Pincode in ProduceListed:', pincode);

    const fetchUploadedImages = async () => {
      if (!pincode) {
        console.error('Pincode is not set.');
        return;
      }

      setIsLoading(true);
      try {
        const db = getFirestore();
        const q = query(
          collection(db, 'products'),
          where('pincode', '==', pincode),
          orderBy('uploadDate', 'desc')
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          console.log('No products found for the given pincode.');
        } else {
          const products = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log('Fetched products:', products);
          setUploadedImages(products);
        }
      } catch (error) {
        console.error("Error fetching images and info: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUploadedImages();
  }, [refreshList, pincode]); // Refetch when refreshList or pincode changes

  return (
    <View style={styles.tabContent}>
      <Heading />
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <Progress.Circle size={50} indeterminate={true} color="#E64E1F" />
        </View>
      ) : (
        <FlatList
          data={uploadedImages}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.uploadedImage} />
              ) : (
                <Text>No image available</Text>
              )}
              <Text>Name: {item.productName}</Text>
              <Text>Type: {item.productType}</Text>
              <Text>Quantity: {item.quantityAvailable}</Text>
              <Text>Harvesting Date: {item.harvestingDate}</Text>
              <Text>Price: {item.price}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

// Settings Tab
const Settings = () => {
  const navigation = useNavigation(); // Get navigation prop using hook

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        Alert.alert("Logged out", "You have been logged out successfully.");
        navigation.navigate('HomeMain'); // Adjust this based on your navigation setup
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
        Alert.alert("Error", "Failed to log out.");
      });
  };
  
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
  
        // Prepare data for Firestore
        const userData = {
          displayName: route.params.name || '', // Use a fallback if undefined
          pincode: route.params.pincode || '',
          userType: route.params.type || '',
          state: route.params.state || 'Unknown State', 
          district: route.params.district || 'Unknown District',
          subDivision: route.params.subDivision || 'Unknown Sub-Division',
          street: route.params.street || 'Unknown Street',
          landmark: route.params.landmark || 'Unknown Landmark',
        };
  
        // Save user data to Firestore
        const db = getFirestore();
        await setDoc(doc(db, 'users', user.uid), userData);
  
        alert("User registered successfully!");
      } catch (error) {
        console.error("Error during sign up:", error);
        alert("Error during sign up: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.tabContent}>
      <Heading />
      <Button 
          title="Logout" 
          onPress={handleLogout} 
          color="#E64E1F" 
          containerStyle={styles.buttonContainer} />
    </View>
  );
};

// Others Tab
const Others = () => {
  return (
    <View style={styles.tabContent}>
      <Heading />
      <Text>Others Tab</Text>
    </View>
  );
};

// Main Component
const Consumer = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'searchFarmer', title: 'Find Farmers X' },
    { key: 'produceListed', title: 'Nearby Listed X' },
    { key: 'settings', title: 'Profile Settings X' },
    { key: 'others', title: 'Other Options X' },
  ]);

  const [refreshList, setRefreshList] = useState(false);
  const [pincode, setPincode] = useState(null);

  useEffect(() => {
    console.log('Pincode in Consumer:', pincode);
  }, [pincode]);

  const renderScene = SceneMap({
    searchFarmer: () => <Search setPincode={setPincode} />,
    produceListed: () => pincode ? <ProduceListed pincode={pincode} refreshList={refreshList} /> : <Text>Loading pincode...</Text>,
    settings: Settings,
    others: Others,
  });

  const renderTabBar = props => (
    <View style={styles.tabBarContainer}>
      <TabBar
        {...props}
        style={styles.tabBar}
        indicatorStyle={styles.indicator}
        renderIcon={({ route }) => {
          const iconNames = {
            searchFarmer: 'search',
            produceListed: 'list-alt',
            settings: 'settings',
            others: 'more-horiz',
          };
          return <Icon name={iconNames[route.key]} size={24} color="#E64E1F" />;
        }}
        labelStyle={styles.tabLabel}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageClickPhotoPickerContainer: {
    width: '90%',
    marginBottom: 20,
    alignSelf: 'center',
  },
  imageClickPhotoPickerButton: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: "rgba(115, 79, 194, 0.2)", 
    borderWidth: 1,
    borderColor: "#473178",
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#424242'
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    backgroundColor: "#E64E1F",
  },
  buttonContainer: {
    width: 350,
    marginBottom: 10,
    alignSelf: 'center',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  selectedImage: {
    width: width - 32,
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productContainer: {
    flex: 1,
    marginBottom: 20,
  },
  uploadedImage: {
    width: width - 32,
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  tabBar: {
    backgroundColor: '#473178', // Background color for the tab bar
    borderTopWidth: 1,
    borderTopColor: '#E64E1F',
  },
  tabLabel: {
    fontSize: 12, // Smaller font size for tab bar text
    textAlign: 'center', // Center align text
  },
  indicator: {
    backgroundColor: '#E64E1F',
  },
  bottomElement: {
    top: 50,
    alignItems: "center",
  },
  modal: {
    flex: 1,
    backgroundColor: '#eee',
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    marginBottom: 20,
  },
  addressText: {
    fontSize: 14,
    color: '#424242',
  },
});

export default Consumer;