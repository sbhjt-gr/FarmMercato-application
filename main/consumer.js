import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList, Text, Alert, Linking, Modal, ScrollView } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, Input, CheckBox } from '@rneui/themed';
import * as Progress from 'react-native-progress';
import { getFirestore, collection, doc, getDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import TypingEffect from "../TypingEffect";
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

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
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

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

  const fetchProducts = async (farmerId) => {
    setIsLoading(true);
    try {
      const db = getFirestore();
      const productsQuery = query(
        collection(db, 'products'),
        where('userId', '==', farmerId)
      );

      const querySnapshot = await getDocs(productsQuery);
      const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setProducts(productsList);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleOrder = (item) => {
    // Handle order logic here
    // Alert.alert('Order', `Order placed for ${item.productName}`);
  };

  const handleOffer = (item) => {
    // Handle offer logic here
    // Alert.alert('Offer', `Offer made for ${item.productName}`);
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
                <View style={styles.farmerInfo}>
                  <Image
                    source={require('../image/farmer.png')}
                    style={styles.farmerImage}
                  />
                  <Text style={styles.addressText}>{item.displayName}</Text>
                </View>
                <Card.Divider />
                <Text style={styles.addressText}>
                  {item.fullAddress}, {item.landmark}, {item.state} - {item.pincode}
                </Text>
                <Text style={styles.addressText}>Phone Number: {item.number}</Text>

                <Button
                  title="Call"
                  onPress={() => handleCall(item.number)}
                  buttonStyle={styles.callButton}
                />

                {/* Add Products Button */}
                <Button
                  title="Products"
                  onPress={() => fetchProducts(item.id)}
                  buttonStyle={styles.callButton} // You can add a custom style for the button
                />
              </Card>
            )}
            keyExtractor={(item) => item.id}
          />
        </>
      )}

      {/* Modal to display products */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Products</Text>
            <ScrollView>
          {products.map((item) => (
            <Card key={item.id} containerStyle={styles.cardContainer}>
              <View style={styles.productContainer}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.uploadedImage} />
                ) : (
                  <Text style={styles.productText}>No image available</Text>
                )}
                <Text style={styles.productText}>Name: {item.productName}</Text>
                <Text style={styles.productText}>Quantity Available: {item.quantityAvailable}</Text>
                <Text style={styles.productText}>Price: ₹{item.price}/KG</Text>
                <Text style={styles.productText}>Farmer Name: {item.displayName}</Text>
                <Text style={[styles.productText, {color: 'red', fontSize: 18}]}>{`Sustainability Score: ${item.sustainabilityScore}`}</Text>
                <Button
                  title="Order from Farmer"
                  onPress={() => handleOrder(item)}
                  buttonStyle={styles.callButton}
                />
                <Button
                  title="Message the Farmer"
                  onPress={() => Alert.alert('Will be implemented soon!')}
                  buttonStyle={styles.callButton}
                />
                <Button
                  title="Make Price Offer"
                  onPress={() => handleOffer(item)}
                  buttonStyle={styles.callButton}
                />
              </View>
            </Card>
          ))}
        </ScrollView>
            <Button
              title="Close"
              onPress={() => setModalVisible(false)}
              buttonStyle={styles.callButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const PaymentModal = ({
  modalVisible,
  setModalVisible,
  orderAddress,
  setOrderAddress,
  city,
  setCity,
  state,
  setState,
  pincode,
  setPincode,
  handleOrderSubmit,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TypingEffect text="Enter your address" speed={50} type="h3" />

          <Input
            style={styles.input}
            placeholder="Street Address"
            value={orderAddress}
            onChangeText={setOrderAddress}
          />

          <Input
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />

          <Input
            style={styles.input}
            placeholder="State"
            value={state}
            onChangeText={setState}
          />

          <Input
            style={styles.input}
            placeholder="Pincode"
            value={pincode}
            onChangeText={setPincode}
          />

          <Button
            title="Proceed to Payment"
            onPress={handleOrderSubmit} // Handles order submission
            buttonStyle={styles.callButton}
          />
          <Button
            title="Cancel"
            onPress={() => setModalVisible(false)}
            buttonStyle={styles.callButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const OfferModal = ({
  modalVisibleTwo,
  setModalVisibleTwo,
  ppr,
  setPPR,
  quantity,
  setQuantity,
  handleOfferSubmit
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisibleTwo}
      onRequestClose={() => {
        setModalVisibleTwo(false);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TypingEffect text="Enter your offer" speed={50} type="h3" />

          <Input
            style={styles.input}
            placeholder="Enter offer price / KG"
            value={ppr}
            onChangeText={setPPR}
            keyboardType='numeric'
          />

          <Input 
            style={styles.input}
            placeholder="Enter the quantity (in KGs)"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType='numeric'
          />
          <Button
            title="Make Offer"
            // onPress={handleOfferSubmit} // Handles order submission
            buttonStyle={styles.callButton}
          />
          <Button
            title="Cancel"
            onPress={() => setModalVisibleTwo(false)}
            buttonStyle={styles.callButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const ProduceListed = () => {
  const [produce, setProduce] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPincode, setSearchPincode] = useState('');
  const [userPincode, setUserPincode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleTwo, setModalVisibleTwo] = useState(false);
  const [orderAddress, setOrderAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [selectedProduce, setSelectedProduce] = useState(null);

  useEffect(() => {
    fetchUserPincode();
  }, []);

  useEffect(() => {
    if (userPincode) {
      fetchAllProduce(userPincode);
    }
  }, [userPincode]);

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
        setUserPincode(pincode); // Set the pincode in the parent component
      } else {
        console.error('No user data found for this UID.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAllProduce = async (pincode) => {
    setIsLoading(true);
    try {
      const db = getFirestore();
      const farmersQuery = query(
        collection(db, 'users'),
        where('userType', '==', 'farmer'),
        where('pincode', '==', pincode)
      );

      const farmersSnapshot = await getDocs(farmersQuery);
      const farmersList = farmersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log('Fetched farmers:', farmersList); // Debug statement

      let allProduce = [];
      for (const farmer of farmersList) {
        console.log('Fetching produce for farmer:', farmer.id); // Debug statement
        const produceQuery = query(
          collection(db, 'products'),
          where('userId', '==', farmer.id),
          orderBy('uploadDate', 'desc') // This requires a composite index
        );

        const produceSnapshot = await getDocs(produceQuery);
        const produceList = produceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched produce for farmer:', farmer.id, produceList); // Debug statement
        allProduce = [...allProduce, ...produceList];
      }

      console.log('All fetched produce:', allProduce); // Debug statement
      setProduce(allProduce);
    } catch (error) {
      console.error('Error fetching produce:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchAllProduce(searchPincode);
  };

  const handleOrder = (item) => {
    setSelectedProduce(item);
    setModalVisible(true);
  };
  const handleOffer = (item) => {
    setSelectedProduce(item);
    setModalVisibleTwo(true);
  };

  const handleOrderSubmit = () => {
    // Handle order submission logic here
    console.log('Order submitted for:', selectedProduce, 'to address:', orderAddress);
    setModalVisible(false);
    setOrderAddress('');
  };
  const handleOfferSubmit = () => {
    // Handle order submission logic here
    // console.log('Order submitted for:', selectedProduce, 'to address:', orderAddress);
    setModalVisibleTwo(false);
    // setOrderAddress('');
  };
  const calculateSustainabilityScore = (parameters) => {
    // Define weights for each parameter
    const weights = {
      farmingMethod: 0.15,
      irrigationMethod: 0.15,
      fertilizerUse: 0.15,
      pesticideUse: 0.15,
      pesticideFrequency: 0.10,
      pesticideType: 0.10,
      farmEquipment: 0.10,
      energySource: 0.10
    };
  
    // Define scores for each parameter
    const scores = {
      farmingMethod: {
        Organic: 1,
        Conventional: 0.5,
        Regenerative: 1,
        Hydroponic: 0.75
      },
      irrigationMethod: {
        'Drip Irrigation': 1,
        'Flood Irrigation': 0.5,
        'Rain-fed': 0.75
      },
      fertilizerUse: {
        Organic: 1,
        Synthetic: 0.5,
        None: 1
      },
      pesticideUse: {
        None: 1,
        Organic: 0.75,
        Synthetic: 0.5
      },
      pesticideFrequency: {
        None: 1,
        Monthly: 0.75,
        Weekly: 0.5
      },
      pesticideType: {
        NA: 1,
        Low: 0.75,
        Medium: 0.5,
        High: 0.25
      },
      farmEquipment: {
        Manual: 1,
        Electric: 0.75,
        Diesel: 0.5,
        Biodiesel: 0.75
      },
      energySource: {
        Renewable: 1,
        'Non-renewable': 0.5
      }
    };
  
    // Calculate total score
    let totalScore = 0;
    let maxScore = 0;
  
    for (const [param, weight] of Object.entries(weights)) {
      const value = parameters[param];
      const paramScore = scores[param][value] || 0;  // Safeguard if value not found
      totalScore += paramScore * weight;
      maxScore += weight; // Sum of weights for normalization
    }
  
    // Calculate percentage score
    const percentageScore = (totalScore / maxScore) * 100;
  
    // Return score as string formatted with percentage symbol
    return `${percentageScore.toFixed(2)}%`; // Ensure string format
  };
  

  return (
    <View style={styles.tabContent}>
      <Heading />
      <Picker
        style={{ marginBottom: 15 }}
        // onValueChange={handleValueChange}
      >
        <Picker.Item label="Sort by Distance" value="distance" />
        <Picker.Item label="Sort by Price" value="price" />
      </Picker>
      <Input
        style={styles.searchBar}
        placeholder="Enter Pin Code"
        value={searchPincode}
        onChangeText={setSearchPincode}
        onSubmitEditing={handleSearch}
      />
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <Progress.Circle size={50} indeterminate={true} color="#E64E1F" />
        </View>
      ) : (
        <FlatList
          data={produce}
          renderItem={({ item }) => {
            let sustainabilityScore = calculateSustainabilityScore({
              farmingMethod: item.farmingMethod,
              irrigationMethod: item.irrigationMethod,
              fertilizerUse: item.fertilizerUse,
              pesticideUse: item.pesticideUse,
              pesticideFrequency: item.pesticideFrequency,
              pesticideType: item.pesticideType,
              farmEquipment: item.farmEquipment,
              energySource: item.energySource
            });
          
            const handleShowAIPrice = async () => {
              await fetchAIRecommendedPrice(item.productName, item.quantityAvailable, item.id);
            };
          
            return (
              <Card containerStyle={styles.cardContainer}>
                <View style={styles.productContainer}>
                  {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.uploadedImage} />
                  ) : (
                    <Text>No image available</Text>
                  )}
                  <Text style={styles.productText}>Name: {item.productName}</Text>
                  <Text style={styles.productText}>Quantity Available: {item.quantityAvailable}</Text>
                  <Text style={styles.productText}>Price: ₹{item.price}/KG</Text>
                 
                  <Text style={[styles.productText, {color: 'red', fontSize: 18}]}>Sustainability Score: {sustainabilityScore}</Text>
                  <Button
                    title="Order from Farmer"
                    onPress={() => handleOrder(item)}
                    buttonStyle={styles.callButton}
                  />
                  <Button
                    title="Message the Farmer"
                    onPress={() => Alert.alert('Will be implemented soon!')}
                    buttonStyle={styles.callButton}
                  />
                  <Button
                    title="Make Price Offer"
                    onPress={() => handleOffer(item)}
                    buttonStyle={styles.callButton}
                  />
                </View>
              </Card>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      )}
      <PaymentModal 
        modalVisible={modalVisible} 
        setModalVisible={setModalVisible} 
        orderAddress={orderAddress}
        setOrderAddress={setOrderAddress}
        city={city}
        setCity={setCity}
        state={state}
        setState={setState}
        pincode={pincode}
        setPincode={setPincode}
        handleOrderSubmit={handleOrderSubmit}
      />
      <OfferModal
        modalVisibleTwo={modalVisibleTwo}
        setModalVisibleTwo={setModalVisibleTwo} 
        handleOfferSubmit={handleOfferSubmit}
      />
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

  return (
    <View style={styles.tabContent}>
      <Heading />
      <Button 
        title="Logout" 
        onPress={handleLogout} 
        color="#E64E1F" 
        containerStyle={styles.buttonContainer} 
      />
      <Button color="#E64E1F"  containerStyle={styles.buttonContainer}  title="Change Name" onPress={() => Alert.alert('Change Name')} />
      <Button color="#E64E1F"  containerStyle={styles.buttonContainer}  title="Change Password" onPress={() => Alert.alert('Change Password')} />
      <Button color="#E64E1F"  containerStyle={styles.buttonContainer}  title="Change Address" onPress={() => Alert.alert('Change Address')} />
      <Button color="#E64E1F"  containerStyle={styles.buttonContainer}  title="Change Email" onPress={() => Alert.alert('Change Email')} />
      <Button color="#E64E1F"  containerStyle={styles.buttonContainer}  title="Change Phone Number" onPress={() => Alert.alert('Change Phone Number')} />
        
    </View>
  );
};

const Consumer = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'searchFarmer', title: 'Find Farmers UXYZ' },
    { key: 'produceListed', title: 'Nearby Listed XYZ' },
    { key: 'settings', title: 'Profile Settings X' }

  ]);

  const [refreshList, setRefreshList] = useState(false);
  const [pincode, setPincode] = useState(null);

  useEffect(() => {
    console.log('Pincode in Consumer:', pincode);
  }, [pincode]);

  const renderScene = SceneMap({
    searchFarmer: () => <Search setPincode={setPincode} />,
    produceListed: () => pincode ? <ProduceListed pincode={pincode} refreshList={refreshList} /> : <Text>Loading pincode...</Text>,
    settings: Settings
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
            settings: 'settings'
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
  callButton: {
    marginTop: 10,
    backgroundColor: '#E64E1F',
  },
  buttonContainer: {
    width: 350,
    marginBottom: 10,
    alignSelf: 'center',
  },
  tabContent: {
    flex: 1,
    padding: 16,
    marginBottom: 70,
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
    width: '100%',
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
    backgroundColor: '#473178',
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    marginBottom: 20,
    backgroundColor: '#473178',
    borderRadius: 10,
    padding: 10,
  },
  addressText: {
    fontSize: 14,
    color: '#fff',
  },
  farmerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  farmerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10
  },
  productText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  productTextSus: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add transparency for the background
  },
  modalContent: {
    // width: '90%',
    maxHeight: '80%', // Set a maximum height for the modal
    padding: 20,
    backgroundColor: '#fff', // White background for modal content
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#473178',
  },
});

export default Consumer;