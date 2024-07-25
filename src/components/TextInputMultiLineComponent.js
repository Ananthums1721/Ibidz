import React,{useState,useCallback} from 'react';
import { View, TextInput, StyleSheet, Dimensions, Text, TouchableOpacity, Image } from 'react-native';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import { showIcon, showImage } from '../globals/icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function TextInputMultiLineComponent({
  Width,
  Placeholder,
  OnChangeText,
  value,
  Error,
  ErrorText,
  secureEntry,
  BGColor,
  Heading,
  Align
}) {
  const [secureEntryStatus, setSecureEntryStatus] = React.useState(secureEntry ? true : false);
  const [show, setShow] = React.useState(false);
  
  let name = 'user'
  const imgPath = `../asset/images/${name}.png`;

 
  return (
    <View style={{
        width: windowWidth*(Width/100),
        alignItems: 'flex-start'
    }}>
        <Text style={[styles.fontStyle1,{marginVertical:'1%'}]}>{Heading}</Text>
        <View
            style={[styles.container,{ height: windowHeight*(15/100),   width:windowWidth*(Width/100), backgroundColor: BGColor?BGColor:colours.primaryWhite, alignItems:'flex-start'}]}
        > 
        <TextInput
          style={{ width: windowWidth * ((Width-8 )/ 100), marginLeft:10, color:colours.primaryBlack, fontFamily: 'Proxima Nova Alt Semibold', fontSize: getFontontSize(16),paddingLeft:10}}
          onChangeText={OnChangeText}
          value={value}
          placeholder={Placeholder}
          placeholderTextColor={colours.lightGrey}
          textAlignVertical={'center'}
          multiline={true}
          maxLength={2500}
        />
      </View>
      {Error? (
        <Text style={[styles.error, {width: windowWidth * (Width / 102),textAlign:Align?Align:"right"}]}>{ErrorText ? ErrorText : "*Required"}</Text>
      )
      :
      <Text style={[styles.error, {width: windowWidth * (Width / 102),textAlign:Align?Align:"right"}]}></Text>
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    alignItems:'center', 
    justifyContent:'space-between',
    marginBottom:5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 6.68,
    shadowColor:  colours.primaryColor,
    elevation: 7,
    borderRadius:10,
    paddingTop:10
    // height: windowHeight*(6/100)
  },
  error: {
    color: colours.primaryRed,
    marginTop: '1%',
    paddingLeft: '1%',
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: getFontontSize(14),
  },
  fontStyle1: {
    color: colours.blue,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
  }
});
