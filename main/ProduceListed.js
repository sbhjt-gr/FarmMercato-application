// ProduceListed.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';
import * as Progress from 'react-native-progress';
import { fetchUploadedImages } from './uploadUtils';
import Heading from './Heading';

const ProduceListed = ({ refreshList }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUploadedImages(setUploadedImages, setIsLoading);
  }, [refreshList]);

  return (
    <View style={styles.tabContent}>
      <Heading />
      {isLoading ? (
        <Progress.Circle size={50} indeterminate={true} color="#E64E1F" />
      ) : (
        <FlatList
          data={uploadedImages}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.uploadedImage} />
              <Text>Name: {item.productName}</Text>
              <Text>Type: {item.productType}</Text>
              <Text>Quantity Available: {item.quantityAvailable}</Text>
              <Text>Price: ₹{item.price}/KG</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    padding: 16,
  },
  productContainer: {
    marginBottom: 20,
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default ProduceListed;
