// UploadProduce.js
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Modal, Dimensions, Alert, Image, TouchableOpacity } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from 'react-native-progress';
import DateTimePicker from '@react-native-community/datetimepicker';
import { uploadImageAndInfo } from './uploadUtils'; // Import upload function
import Heading from './Heading';
// import { TouchableOpacity } from 'react-native';

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

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.tabContent}>
        <Heading />
        <Input
          placeholder="Product Name"
          value={productName}
          onChangeText={setProductName}
        />
        <Picker
          selectedValue={productType}
          onValueChange={(itemValue) => setProductType(itemValue)}
        >
          <Picker.Item label="Vegetables" value="Vegetables" />
          <Picker.Item label="Fruits" value="Fruits" />
        </Picker>
        <Input
          placeholder="Quantity Available (kg)"
          value={quantityAvailable}
          onChangeText={setQuantityAvailable}
          keyboardType="numeric"
        />
        <Input
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        
        <Button
          title={`Harvesting Date: ${harvestingDate.toISOString().split('T')[0]}`}
          onPress={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker
            value={harvestingDate}
            mode="date"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              setHarvestingDate(selectedDate || harvestingDate);
            }}
          />
        )}
        <Button
          title="Pick Image"
          onPress={() => pickImage('gallery')}
        />
        <Button
          title="Take a Photo"
          onPress={() => pickImage('camera')}
        />
        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}
        <Button
          title="Upload"
          onPress={() => uploadImageAndInfo(selectedImage, {
            productName, productType, quantityAvailable, harvestingDate, price
          }, setIsLoading, setSelectedImage)}
        />
        <Modal visible={isLoading}>
          <Progress.Bar width={width * 0.6} indeterminate={true} color="#483178" />
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 50,
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
});

export default UploadProduce;
