import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const ProductList = () => {
  const [uploadedImages, setUploadedImages] = useState([]);

  const fetchUploadedImages = async () => {
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUploadedImages(products);
    } catch (error) {
      console.error("Error fetching images and info: ", error);
    }
  };

  useEffect(() => {
    fetchUploadedImages();
  }, []);

  const renderImageItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.uploadedImage} />
      <Text>Name: {item.productName}</Text>
      <Text>Type: {item.productType}</Text>
      <Text>Quantity: {item.quantityAvailable}</Text>
      <Text>Harvesting Date: {item.harvestingDate}</Text>
      <Text>Price: {item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text h4 style={styles.uploadedImagesHeader}>Uploaded Products</Text>
      <FlatList
        data={uploadedImages}
        renderItem={renderImageItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  uploadedImagesHeader: {
    marginBottom: 10,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  productContainer: {
    marginBottom: 15,
  },
});

export default ProductList;