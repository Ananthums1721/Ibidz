import React, { useState} from "react";
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions, Linking, Platform, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { showIcon } from "../globals/icons";
import colours from "../globals/colours";
import LottieView from "lottie-react-native";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const SupportButton = () => {

  const [icon_1] = useState(new Animated.Value(40));
  const [icon_2] = useState(new Animated.Value(40));
  const [icon_3] = useState(new Animated.Value(40));

  const [pop, setPop] = useState(false);

  const popIn = () => {
    setPop(true);
    Animated.timing(icon_1, {
      toValue: 130,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_2, {
      toValue: 110,
      duration: 750,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_3, {
      toValue: 130,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }

  const popOut = () => {
    setPop(false);
    Animated.timing(icon_1, {
      toValue: 40,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_2, {
      toValue: 40,
      duration: 750,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_3, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }

  return(
    <View style={{
      position:'absolute',
      width: windowWidth*(15/100),
      height:  windowWidth*(15/100),
      marginTop: Platform.OS == 'ios'? windowHeight*(80/100) : windowHeight*(87/100),
      left: windowWidth*(90/100)

    }}>
      <Animated.View style={[styles.circle, { bottom: icon_1, backgroundColor: colours.primaryColor}]}>
        <TouchableOpacity onPress={() => {popOut() ,Linking.openURL(`tel:${9544509000}`)} } >
          {showIcon('call', colours.primaryWhite, windowWidth*(6/100) )}
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.circle, { bottom: icon_2, right: icon_2, backgroundColor: colours.primaryColor}]}>
        <TouchableOpacity onPress={() => {popOut() ,Linking.openURL('mailto:mail@fourotech.com')}}>
          {showIcon('mail', colours.primaryWhite, windowWidth*(7/100) )}
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.circle, { right: icon_3, backgroundColor: colours.primaryColor}]}>
        <TouchableOpacity onPress={() => {popOut() ,Linking.openURL('whatsapp://send?text=Hi iBidz..&phone=+919544509000')}}>
          {showIcon('whatsapp', colours.primaryWhite, windowWidth*(8/100) )}
        </TouchableOpacity>
      </Animated.View>
      <Pressable
        style={styles.circle}
        onPress={() => {
          pop === false ? popIn() : popOut();
        }}
      >
        <LottieView 
          source={require('../asset/lottie/Support.json')} 
          style={{
              height: windowWidth*(13/100),
              width: windowWidth*(13/100),
          }} 
          autoPlay
          loop
        />
        {/* {showIcon('mail', colours.primaryWhite, 20 )} */}
      </Pressable>
    </View>
  )

}

export default SupportButton;

const styles = StyleSheet.create({
  circle: {
     backgroundColor: colours.primaryYellow,
     width: windowWidth*(14/100),
     height: windowWidth*(14/100),
     position: 'absolute',
     bottom: 40,
     right: 40,
     borderRadius: 50,
     justifyContent: 'center',
     alignItems: 'center',
     shadowOffset: {
         width: 0,
         height: 3,
     },
     shadowOpacity: 0.16,
     shadowRadius: 6.68,
     shadowColor: colours.primaryBlack,
     elevation: 7,
  }
})