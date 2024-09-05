import React, { useState, useEffect } from 'react';
import { View, Modal, Image, StyleSheet, Dimensions, Alert, FlatList, ScrollView } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, Input, Text } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

// Heading Component
const Heading = () => (
  <View style={styles.headingContainer}>
    <Image source={require('../assets/images/icon.png')} style={styles.icon} />
    <Text style={styles.headingText}>FarmMarceto Farmer</Text>
  </View>
);

// Upload Produce Tab
const UploadProduce = () => {
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('Vegetables');
  const [quantityAvailable, setQuantityAvailable] = useState('');
  const [harvestingDate, setHarvestingDate] = useState(new Date());
  const [price, setPrice] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [farmingMethod, setFarmingMethod] = useState('Organic');
  const [irrigationMethod, setIrrigationMethod] = useState('Drip Irrigation');
  const [fertilizerUse, setFertilizerUse] = useState('Organic');
  const [pesticideUse, setPesticideUse] = useState('None');
  const [pesticideFrequency, setPesticideFrequency] = useState('None');
  const [pesticideType, setPesticideType] = useState('None');
  const [farmEquipment, setFarmEquipment] = useState('Manual');
  const [energySource, setEnergySource] = useState('Renewable');

  const pickImage = async (source) => {
    let result;
    if (source === 'gallery') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
    } else if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
    }

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadImageAndInfo = async () => {
    if (!selectedImage) return;

    try {
      setIsLoading(true);
      const response = await fetch(selectedImage);
      const blob = await response.blob();

      const storage = getStorage();
      const storageRef = ref(storage, `photos/${auth.currentUser.uid}/${Date.now()}.jpg`);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // You can track the progress of the upload here if needed
          // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error("Error uploading image and info: ", error);
          Alert.alert("Error", `Failed to upload image and info. ${error.message}`);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const db = getFirestore();
          
          await addDoc(collection(db, 'products'), {
            productName,
            productType,
            quantityAvailable: `${quantityAvailable} KG`,
            harvestingDate: harvestingDate.toISOString().split('T')[0],
            price,
            imageUrl: downloadURL,
            uploadDate: new Date(),
            userId: auth.currentUser.uid,
            farmingMethod,
            irrigationMethod,
            fertilizerUse,
            pesticideUse,
            pesticideFrequency,
            pesticideType,
            farmEquipment,
            energySource
          });

          Alert.alert("Success", "Product uploaded successfully");
          setSelectedImage(null);
          setProductName('');
          setProductType('Vegetables');
          setQuantityAvailable('');
          setHarvestingDate(new Date());
          setPrice('');
          setFarmingMethod('Organic');
          setIrrigationMethod('Drip Irrigation');
          setFertilizerUse('Organic');
          setPesticideUse('None');
          setPesticideFrequency('None');
          setPesticideType('None');
          setFarmEquipment('Manual');
          setEnergySource('Renewable');
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Error uploading image and info: ", error);
      Alert.alert("Error", `Failed to upload image and info. ${error.message}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.tabContent}>
        <Heading />
        <View style={styles.bottomElement}>
          <Modal visible={isLoading} transparent>
            <View style={styles.modal}>
              <Progress.Bar width={width * 0.6} indeterminate={true} color="#483178" />
            </View>
          </Modal>
        </View>
        <Input
          style={styles.input}
          containerStyle={styles.inputContainer}
          placeholder="Product Name"
          value={productName}
          onChangeText={setProductName}
        />
        <Picker
          selectedValue={productType}
          style={styles.picker}
          onValueChange={(itemValue) => setProductType(itemValue)}
        >
          <Picker.Item label="Category" value="#" />
          <Picker.Item label="Vegetables" value="Vegetables" />
          <Picker.Item label="Fruits" value="Fruits" />
        </Picker>
        <Input
          style={styles.input}
          placeholder="Quantity Available (in KGs)"
          value={quantityAvailable}
          keyboardType="numeric"
          containerStyle={styles.inputContainer}
          onChangeText={setQuantityAvailable}
        />
        <Input
          style={styles.input}
          containerStyle={styles.inputContainer}
          placeholder="Price"
          value={price}
          keyboardType="numeric"
          onChangeText={setPrice}
        />
        <Button
          title={`Harvesting Date: ${harvestingDate.toISOString().split('T')[0]}`}
          onPress={() => setShowDatePicker(true)}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          color="#E64E1F"
        />
        {showDatePicker && (
          <DateTimePicker
            value={harvestingDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setHarvestingDate(selectedDate);
              }
            }}
          />
        )}
        <Picker
          selectedValue={farmingMethod}
          style={styles.picker}
          onValueChange={(itemValue) => setFarmingMethod(itemValue)}
        >
          <Picker.Item label="Farming Method" value="#" />
          <Picker.Item label="Organic" value="Organic" />
          <Picker.Item label="Conventional" value="Conventional" />
          <Picker.Item label="Regenerative" value="Regenerative" />
          <Picker.Item label="Hydroponic" value="Hydroponic" />
        </Picker>
        <Picker
          selectedValue={irrigationMethod}
          style={styles.picker}
          onValueChange={(itemValue) => setIrrigationMethod(itemValue)}
        >
          <Picker.Item label="Irrigation Method" value="#" />
          <Picker.Item label="Drip Irrigation" value="Drip Irrigation" />
          <Picker.Item label="Flood Irrigation" value="Flood Irrigation" />
          <Picker.Item label="Rain-fed" value="Rain-fed" />
        </Picker>
        <Picker
          selectedValue={fertilizerUse}
          style={styles.picker}
          onValueChange={(itemValue) => setFertilizerUse(itemValue)}
        >
          <Picker.Item label="Fertilizer Use" value="#" />
          <Picker.Item label="Organic" value="Organic" />
          <Picker.Item label="Synthetic" value="Synthetic" />
          <Picker.Item label="None" value="None" />
        </Picker>
        <Picker
          selectedValue={pesticideUse}
          style={styles.picker}
          onValueChange={(itemValue) => setPesticideUse(itemValue)}
        >
          <Picker.Item label="Pesticide Use" value="#" />
          <Picker.Item label="None" value="None" />
          <Picker.Item label="Organic" value="Organic" />
          <Picker.Item label="Synthetic" value="Synthetic" />
        </Picker>
        <Picker
          selectedValue={pesticideFrequency}
          style={styles.picker}
          onValueChange={(itemValue) => setPesticideFrequency(itemValue)}
        >
          <Picker.Item label="Pesticide Frequency" value="#" />
          <Picker.Item label="None" value="None" />
          <Picker.Item label="Monthly" value="Monthly" />
          <Picker.Item label="Weekly" value="Weekly" />
        </Picker>
        <Picker
          selectedValue={pesticideType}
          style={styles.picker}
          onValueChange={(itemValue) => setPesticideType(itemValue)}
        >
          <Picker.Item label="Pesticide Type" value="#" />
          <Picker.Item label="Not Applicable" value="NA" />
          <Picker.Item label="Low" value="Low" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="High" value="High" />
        </Picker>
        <Picker
          selectedValue={farmEquipment}
          style={styles.picker}
          onValueChange={(itemValue) => setFarmEquipment(itemValue)}
        >
          <Picker.Item label="Farm Equipment" value="#" />
          <Picker.Item label="Manual" value="Manual" />
          <Picker.Item label="Electric" value="Electric" />
          <Picker.Item label="Diesel" value="Diesel" />
          <Picker.Item label="Biodiesel" value="Biodiesel" />
        </Picker>
        <Picker
          selectedValue={energySource}
          style={styles.picker}
          onValueChange={(itemValue) => setEnergySource(itemValue)}
        >
          
          <Picker.Item label="Energy Source" value="#" />
          <Picker.Item label="Renewable" value="Renewable" />
          <Picker.Item label="Non-renewable" value="Non-renewable" />
        </Picker>
        <Button 
          containerStyle={styles.imageClickPhotoPickerContainer}
          size="lg"
          buttonStyle={styles.imageClickPhotoPickerButton}
          title="Pick an Image from Gallery" 
          onPress={() => pickImage('gallery')} 
          color="#E64E1F" 
        />
        <Button 
          containerStyle={styles.imageClickPhotoPickerContainer}
          size="lg"
          buttonStyle={styles.imageClickPhotoPickerButton}
          title="Take a Photo" 
          onPress={() => pickImage('camera')} 
          color="#E64E1F" 
        />
        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}
        <Button 
          containerStyle={styles.buttonContainer}
          size="lg"
          buttonStyle={styles.button} 
          title="Upload" 
          onPress={uploadImageAndInfo} 
          color="#E64E1F" 
        />
      </View>
    </ScrollView>
  );
};

// Produce Listed Tab
const ProduceListed = ({ refreshList }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUploadedImages = async () => {
      const user = auth.currentUser;

      if (!user) {
        console.error("No user is signed in.");
        return;
      }

      const uid = user.uid;

      setIsLoading(true);
      try {
        const db = getFirestore();
        const q = query(
          collection(db, 'products'),
          where('userId', '==', uid), // Filter by the current user's uid
          orderBy('uploadDate', 'desc')
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          console.log('No products found for the given uid.');
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
  }, [refreshList]); // Refetch when refreshList changes

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
              <Text>Price: ₹{item.price}/KG</Text>
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

// Others Tab
const Others = ({ navigation }) => {
  return (
    <View style={styles.tabContent}>
      <Heading />
      <Text>Others Tab</Text>
    </View>
  );
};

// Main Component
const Farmer = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'uploadProduce', title: 'Upload Produce X' },
    { key: 'produceListed', title: 'My Produce X' },
    { key: 'settings', title: 'Profile Settings X' },
    { key: 'others', title: 'Other Options X' },
  ]);

  const [refreshList, setRefreshList] = useState(false); // State to trigger refresh

  const renderScene = SceneMap({
    uploadProduce: () => <UploadProduce onUploadSuccess={() => setRefreshList(prev => !prev)} />, // Pass callback to refresh list
    produceListed: () => <ProduceListed refreshList={refreshList} />, // Pass refresh state to ProduceListed
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
            uploadProduce: 'cloud-upload',
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50
  },
  tabContent: {
    flex: 1,
    padding: 16,
    width: '100%',
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
  button: {
    backgroundColor: "#E64E1F",
  },
  buttonContainer: {
    width: 350,
    marginBottom: 10,
    alignSelf: 'center',
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
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
});

export default Farmer;