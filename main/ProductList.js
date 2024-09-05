// Farmer.js
import React, { useState } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UploadProduce from './UploadProduce';
import ProduceListed from './ProduceListed';
import Settings from './Settings';
import Others from './Others';

const Farmer = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'uploadProduce', title: 'Upload Produce' },
    { key: 'produceListed', title: 'My Produce' },
    { key: 'settings', title: 'Settings' },
    { key: 'others', title: 'Others' },
  ]);

  const renderScene = SceneMap({
    uploadProduce: UploadProduce,
    produceListed: ProduceListed,
    settings: Settings,
    others: Others,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      style={styles.tabBar}
      indicatorStyle={styles.indicator}
      renderIcon={({ route }) => {
        const icons = {
          uploadProduce: 'cloud-upload',
          produceListed: 'list-alt',
          settings: 'settings',
          others: 'more-horiz',
        };
        return <Icon name={icons[route.key]} size={24} color="#E64E1F" />;
      }}
      labelStyle={styles.tabLabel}
    />
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
  tabBar: {
    backgroundColor: '#473178',
  },
  tabLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  indicator: {
    backgroundColor: '#E64E1F',
  },
});

export default Farmer;
