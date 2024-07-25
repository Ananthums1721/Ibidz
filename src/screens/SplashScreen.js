import React, { Component, Profiler } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Image, SafeAreaView, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colours from '../globals/colours';
import { AppContext } from '../Context/appContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SplashScreen = ({ navigation, route }) => {

  const { loadProfile, profile } = React.useContext(AppContext);
  React.useEffect(() => {
    const asynceffect = async () => {
      await loadProfile();
      setTimeout(function () {
        navigation.reset({
          index: 0,
          routes: [{ name: 'DrawerStackNavigator' }],
        })
      }, 3000)

      // let iop = await AsyncStorage.getItem('isOpenedBefore');
      // let token = await AsyncStorage.getItem('token')
    
    //   if (iop == 'true') {
    //     if (token&&token !='' ) {
    //       setTimeout(function () {
    //         navigation.reset({
    //           index: 0,
    //           routes: [{ name: 'TabNavigator' }],
    //         })
    //       }, 3000)
    //     }else {
    //     setTimeout(function () {
    //       navigation.reset({
    //         index: 0,
    //         routes: [{ name: 'LoginScreen' }],
    //       })
    //     }, 3000)
    //   }
    // } else {
    //   setTimeout(function () {
    //     navigation.reset({
    //       index: 0,
    //       routes: [{ name: 'LoginScreen' }],
    //     })
    //   }, 3000)
    // }
  }
asynceffect();
  }, []);

return (
  <SafeAreaView style={styles.container}>

    {/* <ImageBackground source={require('../asset/images/screenback.png')}
        style={{
          height: windowHeight,
          width: windowWidth,
          justifyContent:'center',
          resizeMode:'stretch'
        }}> */}
    <Image
      source={require('../asset/logo/LogoB.png')}
      style={{
        height: windowWidth * (65 / 100),
        width: windowWidth * (65 / 100),
        resizeMode: "contain"
      }}
    />
    {/* </ImageBackground> */}
  </SafeAreaView>
);
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.backgroundColor,
    flex: 1,
  },
});