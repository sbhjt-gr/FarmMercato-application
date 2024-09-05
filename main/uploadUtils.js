// uploadUtils.js
import { Alert } from 'react-native';
import storage from '@react-native-firebase/storage'; // Assuming Firebase is used
import firestore from '@react-native-firebase/firestore';

// Upload image to Firebase storage and the product information to Firestore
const uploadImageAndInfo = async (imageUri, productData, setIsLoading, setSelectedImage) => {
  try {
    setIsLoading(true);
    
    // Create a unique filename
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const storageRef = storage().ref(`uploads/${filename}`);
    
    // Upload image to Firebase storage
    const task = storageRef.putFile(imageUri);
    await task;

    // Get image URL after upload
    const imageUrl = await storageRef.getDownloadURL();

    // Save product info in Firestore
    await firestore().collection('products').add({
      ...productData,
      imageUrl,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    Alert.alert('Success', 'Product uploaded successfully!');
    
    // Clear form
    setSelectedImage(null);
  } catch (error) {
    console.error('Error uploading image and info:', error);
    Alert.alert('Error', 'Failed to upload product. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

// Fetch uploaded images from Firestore
export const fetchUploadedImages = async (setUploadedImages, setIsLoading) => {
  try {
    setIsLoading(true);

    // Fetch the list of products from Firestore
    const productsSnapshot = await firestore().collection('products').orderBy('createdAt', 'desc').get();
    
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setUploadedImages(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    Alert.alert('Error', 'Failed to load products.');
  } finally {
    setIsLoading(false);
  }
};

export default uploadImageAndInfo;