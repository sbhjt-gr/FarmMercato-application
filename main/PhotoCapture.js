// import React, { useState, useEffect } from 'react';
// import { View, Button, Image, StyleSheet } from 'react-native';
// import { Camera } from 'expo-camera';
// import { getStorage, ref, uploadBytes } from 'firebase/storage';
// import * as ImagePicker from 'expo-image-picker';
// import { auth } from '../firebase'; // Ensure this is the correct path

// const PhotoCapture = () => {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [cameraRef, setCameraRef] = useState(null);
//   const [photo, setPhoto] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const takePhoto = async () => {
//     if (cameraRef) {
//       const { uri } = await cameraRef.takePictureAsync({ quality: 0.3 });
//       setPhoto(uri);
//       console.log("Photo taken:", uri); // Debugging
//     }
//   };

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.3,
//     });

//     if (!result.canceled) {
//       setPhoto(result.uri);
//       console.log("Photo chosen:", result.uri); // Debugging
//     }
//   };

//   const uploadPhoto = async () => {
//     if (photo) {
//       setUploading(true);
//       try {
//         const storage = getStorage();
//         const storageRef = ref(storage, `photos/${auth.currentUser.uid}/${Date.now()}.jpg`);
//         const response = await fetch(photo);
//         const blob = await response.blob();
//         await uploadBytes(storageRef, blob);
//         console.log("Photo uploaded successfully!"); // Debugging
//       } catch (error) {
//         console.error("Error uploading photo:", error); // Debugging
//       } finally {
//         setUploading(false);
//       }
//     }
//   };

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       {!photo && (
//         <Camera
//           style={styles.camera}
//           ref={(ref) => setCameraRef(ref)}
//         />
//       )}
//       {photo && <Image source={{ uri: photo }} style={styles.preview} />}
//       <View style={styles.buttonContainer}>
//         <Button title="Take Photo" onPress={takePhoto} />
//         <Button title="Choose from Gallery" onPress={pickImage} />
//         {photo && (
//           <Button
//             title={uploading ? "Uploading..." : "Upload Photo"}
//             onPress={uploadPhoto}
//             disabled={uploading}
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   camera: {
//     width: '100%',
//     height: 300,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 20,
//   },
//   preview: {
//     width: 300,
//     height: 300,
//     marginTop: 20,
//   },
// });

// export default PhotoCapture;
