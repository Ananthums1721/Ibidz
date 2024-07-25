import {View, Text, Dimensions, StyleSheet, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import Profile from '../screens/Profile';
import AuctionList from '../screens/AuctionList';
import {showIcon} from '../globals/icons';
import colours from '../globals/colours';

import VendorHomeScreen from '../screens/VendorHomeScreen';
import VendorProfile from '../screens/VendorProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoaderContext} from '../Context/loaderContext';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import VendorCMS from '../screens/VendorCMS';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Bottom = createBottomTabNavigator();

const TabNavigator = () => {
  const [type, setType] = useState('');
  const {showLoader} = React.useContext(LoaderContext);

  useEffect(() => {
    getInitialData();
  }, []);

  const getInitialData = async () => {
    showLoader(true);
    try {
      let data = await AsyncStorage.getItem('userType');
      console.log('data', data);
      setType(data);
      showLoader(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Bottom.Navigator
      // screenOptions={{
      //   headerShown: false,
      //   tabBarStyle: styles.tabBar,
      //   tabBarShowLabel: false,
      // }}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colours.primaryYellow,
        tabBarStyle: styles.tabBar,
      }}>
      {type == 'seller' ? (
        <>
          <Bottom.Screen
            name="VendorProfile"
            component={VendorProfile}
            options={{
              tabBarInactiveTintColor: colours.gray,
              tabBarActiveTintColor: colours.primaryBlue,
              tabBarIcon: ({focused}) =>
                focused ? (
                  <View style={styles.iconView}>
                    {showIcon('profile', colours.primaryYellow, 26)}
                  </View>
                ) : (
                  <View style={styles.iconView}>
                    {showIcon('profile', colours.primaryWhite, 26)}
                  </View>
                ),
            }}
          />
          <Bottom.Screen
            name="VendorCMS"
            component={VendorCMS}
            options={{
              tabBarInactiveTintColor: colours.gray,
              tabBarActiveTintColor: colours.primaryBlue,
              tabBarIcon: ({focused}) =>
                focused ? (
                  <View style={styles.iconView}>
                    {showIcon('cms', colours.primaryYellow, 26)}
                  </View>
                ) : (
                  <View style={styles.iconView}>
                    {showIcon('cms', colours.primaryWhite, 26)}
                  </View>
                ),
            }}
          />
        </>
      ) : (
        <>
          <Bottom.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              tabBarInactiveTintColor: colours.gray,
              tabBarActiveTintColor: colours.primaryBlue,
              tabBarIcon: ({focused}) =>
                focused ? (
                  <View style={styles.iconView}>
                    {showIcon('home', colours.primaryYellow, 26)}
                  </View>
                ) : (
                  <View style={styles.iconView}>
                    {showIcon('home', colours.primaryWhite, 26)}
                  </View>
                ),
            }}
          />
          <Bottom.Screen
            name="AuctionList"
            component={AuctionList}
            options={{
              tabBarInactiveTintColor: colours.gray,
              tabBarActiveTintColor: colours.primaryBlue,
              tabBarIcon: ({focused}) =>
                focused ? (
                  <View style={styles.iconView}>
                    {showIcon('bid', colours.primaryYellow, 26)}
                  </View>
                ) : (
                  <View style={styles.iconView}>
                    {showIcon('bid', colours.primaryWhite, 26)}
                  </View>
                ),
            }}
          />
          <Bottom.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarInactiveTintColor: colours.gray,
              tabBarActiveTintColor: colours.primaryBlue,
              tabBarIcon: ({focused}) =>
                focused ? (
                  <View style={styles.iconView}>
                    {showIcon('profile', colours.primaryYellow, 26)}
                  </View>
                ) : (
                  <View style={styles.iconView}>
                    {showIcon('profile', colours.primaryWhite, 26)}
                  </View>
                ),
            }}
          />
        </>
      )}
    </Bottom.Navigator>
  );
};

export default TabNavigator;
const styles = StyleSheet.create({
  tabBar: {
    height: windowHeight * (6 / 100),
    marginBottom:
      Platform.OS == 'ios'
        ? windowHeight * (2 / 100)
        : windowHeight * (1 / 100),
    paddingBottom: windowHeight * (1 / 100),
    width: windowWidth * (94 / 100),
    borderRadius: windowHeight * (6 / 100),
    marginLeft: windowWidth * (3 / 100),
    position: 'absolute',
    borderTopWidth: 0,
    backgroundColor: colours.primaryColor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    shadowColor: colours.primaryBlack,
  },
  iconView: {
    width: windowHeight * (4 / 100),
    height: windowHeight * (4 / 100),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
