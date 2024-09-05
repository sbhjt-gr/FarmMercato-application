import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, View, Alert } from 'react-native';
import { Button, Text } from '@rneui/themed';
import ModalDropdown from 'react-native-modal-dropdown';
// import data from '../statedata.json';

export default function RegLocation({ navigation, route }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDivisions, setSubDivisions] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedSubDivision, setSelectedSubDivision] = useState(null);

  useEffect(() => {
    // Flatten the data array to access the state information
    const flattenedData = data.flat();
    
    // Extract unique states
    const stateList = [...new Set(flattenedData.map(item => item["STATE NAME"]))];
    setStates(stateList);
  }, []);

  const handleStateSelect = (index, value) => {
    setSelectedState(value);
    setSelectedDistrict(null);
    setSelectedSubDivision(null);

    // Filter districts based on the selected state
    const flattenedData = data.flat();
    const filteredDistricts = flattenedData
      .filter(item => item["STATE NAME"] === value)
      .map(item => item["DISTRICT NAME"]);
    const uniqueDistricts = [...new Set(filteredDistricts)];
    setDistricts(uniqueDistricts);
  };

  const handleDistrictSelect = (index, value) => {
    setSelectedDistrict(value);
    setSelectedSubDivision(null);

    // Filter sub-divisions based on the selected district
    const flattenedData = data.flat();
    const filteredSubDivisions = flattenedData
      .filter(item => item["DISTRICT NAME"] === value)
      .map(item => item["SUB-DISTRICT NAME"]);
    const uniqueSubDivisions = [...new Set(filteredSubDivisions)];
    setSubDivisions(uniqueSubDivisions);
  };

  const handleNextPress = () => {
    if (!selectedState || !selectedDistrict || !selectedSubDivision) {
      Alert.alert('Error', 'Please select state, district, and sub-division');
    } else {
      navigation.navigate('RegPassword', { 
        state: selectedState, 
        district: selectedDistrict, 
        subDivision: selectedSubDivision,

      });
    }
  };

  return (
    <KeyboardAvoidingView behavior='padding'>
      <View style={styles.container}>
        <Text h3>Choose Your Location</Text>
        <ModalDropdown 
          options={states.length > 0 ? states : ['No states available']} 
          defaultValue="Select State" 
          onSelect={handleStateSelect} 
          style={styles.dropdown} 
          textStyle={styles.dropdownText} 
          dropdownStyle={styles.dropdownMenu} 
        />
        <ModalDropdown 
          options={districts.length > 0 ? districts : ['No districts available']} 
          defaultValue="Select District" 
          onSelect={handleDistrictSelect} 
          style={styles.dropdown} 
          textStyle={styles.dropdownText} 
          dropdownStyle={styles.dropdownMenu} 
          disabled={districts.length === 0} 
        />
        <ModalDropdown 
          options={subDivisions.length > 0 ? subDivisions : ['No sub-divisions available']} 
          defaultValue="Select Sub-Division" 
          onSelect={(index, value) => setSelectedSubDivision(value)} 
          style={styles.dropdown} 
          textStyle={styles.dropdownText} 
          dropdownStyle={styles.dropdownMenu} 
          disabled={subDivisions.length === 0} 
        />
        <Button 
          onPress={handleNextPress} 
          raised 
          title="Next" 
          size="lg" 
          containerStyle={styles.buttonContainer} 
          buttonStyle={styles.button} 
          rippleColor='#473178' 
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  dropdown: {
    width: 370,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
  },
  buttonContainer: {
    width: '90%',
    marginTop: 20,
  },
  button: {
    width: '100%',
    backgroundColor: "#E64E1F",
  },
});
