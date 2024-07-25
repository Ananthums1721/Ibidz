import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import LinearGradient from 'react-native-linear-gradient';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function AuthButton({
  BackgroundColor,
  OnPress,
  ButtonText,
  ButtonWidth,
  ButtonHeight,
  FirstColor,
  SecondColor,
  FSize,
  FColor,
  disabled
}) {
  return (
    <View>
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{x: 0, y: 1 }}
        colors={[ FirstColor?FirstColor:colours.primaryColor, SecondColor?SecondColor:colours.primaryColor ]}
        style={[
          styles.buttonStyle,
          { borderRadius:10 },
          {  shadowColor:BackgroundColor, },
          { width: windowWidth * (ButtonWidth / 100) },
          { height: ButtonHeight ? windowHeight * (ButtonHeight / 100) : windowHeight * (6 / 100), },
          ,]}
      >
        <TouchableOpacity
          disabled={disabled}
          onPress={OnPress}
          style={{width: windowWidth * (ButtonWidth / 100) , height: ButtonHeight ? windowHeight * (ButtonHeight / 100) : windowHeight * (6 / 100), alignItems:'center', justifyContent:'center', flexDirection:'row'}}
        >
          <Text style={[styles.buttonText,{ color: FColor?FColor:colours.primaryWhite, fontSize:FSize?getFontontSize(FSize):getFontontSize(18)}]}>{ButtonText}</Text>
        </TouchableOpacity>
        
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'white',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    padding:0
  },
});
