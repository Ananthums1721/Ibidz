import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, Dimensions, Text, TouchableOpacity, Image, Platform } from 'react-native';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';

import PhoneInput from "react-native-phone-number-input";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function PhoneNumberInput({
  Width,
  Height,
  onChangeFormattedText,
  value,
  Error,
  ErrorText,
  Code,
  phoneCCode,
  setPhoneCCode,
}) {


  const [formattedPhoneNumber, setformattedPhoneNumber] = useState('')

  const phoneInput = useRef(null);
  const [dummy, setDummy] = React.useState(false);
  return (
    <View style={{ height: Height * 1.5, alignItems: 'flex-start', justifyContent: 'flex-end', }}>

      <View
        style={[styles.container, { height: Height * 0.9, borderRadius: 10, marginTop: Height / 6, width: windowWidth * (Width / 100), backgroundColor: colours.primaryWhite, justifyContent: 'center' }]}
      >

        <PhoneInput
          ref={phoneInput}
          defaultValue={formattedPhoneNumber}
          defaultCode={Code?Code:"IN"}
          value={value}
          onChangeCountry={(value) => {
            if(phoneCCode&&setPhoneCCode){
              phoneCCode.CountryCode = value.callingCode[0]
              setPhoneCCode(phoneCCode),
              setDummy(!dummy)
            }
          }}
          layout="first"
          onChangeFormattedText={onChangeFormattedText}
          containerStyle={{ backgroundColor: '#fff', alignItems: "center",width: windowWidth * (85 / 100), borderRadius:20,}}
          textContainerStyle={{ fontFamily: 'Proxima Nova Alt Semibold', height: windowHeight * (6 / 100),width: windowWidth * (70 / 100), backgroundColor: "#fff", borderRadius:20 }}
          textInputStyle={{ fontFamily: 'Proxima Nova Alt Semibold', backgroundColor: '#fff', top: 2, height: windowHeight * (5 / 100), width: windowWidth * (70 / 100), borderRadius:20, padding:0}}
          placeholder='Phone number'
          textInputProps={{placeholderTextColor: colours.primaryGrey}}
          
          codeTextStyle={{ backgroundColor: '#fff', alignItems: 'center', textAlignVertical:'center', justifyContent:'center',height: Platform.OS == 'ios'? null : windowHeight*(4/100) }}
        />
      </View>
      {Error ? (
        <Text style={[styles.error, { width: windowWidth * (Width / 105), textAlign: "left" }]}>{ErrorText ? ErrorText : "*Required"}</Text>
      )
        :
        <Text style={[styles.error, { width: windowWidth * (Width / 105), textAlign: "left" }]}></Text>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 6.68,
    shadowColor: colours.primaryColor,
    elevation: 7,
  },
  error: {
    color: colours.primaryRed,
    marginTop: '1%',
    paddingLeft: '1%',
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: getFontontSize(14),
  },
  fontStyle1: {
    color: colours.lightBlue,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
  },
  phcontainer: {
    height: 50,
    width: windowWidth * (85 / 100),
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 6.68,
    shadowColor: colours.primaryColor,
    elevation: 7,
  }

});
