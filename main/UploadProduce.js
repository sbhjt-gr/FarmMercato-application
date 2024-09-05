import React, { useState } from 'react';
import { View, Modal, Image, ScrollView, Alert, StyleSheet, Dimensions } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth } from '../firebase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Heading from './Heading';

const { width } = Dimensions.get('window');

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
        (snapshot) => {},
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
            quantityAvailable: `${quantityAvailable} kg`,
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
            energySource,
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
          placeholder="Quantity Available (kg)"
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

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
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

export default UploadProduce;