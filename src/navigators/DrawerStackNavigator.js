import {
    StyleSheet,
    Dimensions,
    Image,
    ScrollView,
    ImageBackground,
  } from 'react-native';
  import React from 'react';
  import { createDrawerNavigator } from '@react-navigation/drawer';
  
  
  import DrawerContent from './DrawerContent';
  import TabNavigator from './TabNavigator';
  import Favorite from '../screens/AuctionList';
  import Profile from '../screens/Profile';
  
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const Drawer = createDrawerNavigator();
  
  const DrawerStackNavigator = () => {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false
        }}
        drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen name='Home' component={TabNavigator} />
      </Drawer.Navigator>
    )
  }
  
  export default DrawerStackNavigator
  
  const styles = StyleSheet.create({
    drawerActive: {
      height: windowHeight * (2 / 100),
      width: windowWidth * (5 / 100),
      backgroundColor: 'pink'
    }
  })