import React,{useState,useCallback} from 'react';
import { View, TextInput, StyleSheet, Dimensions, Text, TouchableOpacity, Image } from 'react-native';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import { showIcon, showImage } from '../globals/icons';

const windowWidth = Dimensions.get('window').width;

export default function LoginTextInput({
  Width,
  Height,
  Placeholder,
  OnChangeText,
  Border,
  value,
  Error,
  top,
  Length,
  ErrorText,
  KeyboardType,
  secureEntry,
  PhoneCode,
  CurrencyCode,
  ShowValuePlaceHolder,
  BGColor,
  Icon,
  Documentpicker,
  onPress,
  Disable
}) {
  const [secureEntryStatus, setSecureEntryStatus] = React.useState(secureEntry ? true : false);
  const [show, setShow] = React.useState(false);
  
  let name = 'user'
  const imgPath = `../asset/images/${name}.png`;

 
  return (
    <View style={{height: Height*1.6,  alignItems:'flex-start', justifyContent:'flex-end', }}>
      {/* <View style={{marginLeft: windowWidth*(5/100)}}>
        <Text style={[styles.fontStyle1]}>
          {Placeholder}
        </Text>
      </View> */}
      <View
        style={[styles.container,{height:Height*0.9, borderRadius:10, marginTop:Height/6,  width:windowWidth*(Width/100), backgroundColor: BGColor?BGColor:colours.primaryWhite,justifyContent: Icon?'flex-start' : 'space-between'}]}
      > 
      {Icon && (
        <View style={{marginLeft:10}}>{showImage(Icon, 5)}</View>
      )}
      
      {
        PhoneCode&&(
          <Text style={[styles.fontStyle1,{paddingLeft:20, color: colours.primaryBlack}]}>{"+91 "}</Text>
        )
      }
      {
        CurrencyCode&&(
          <Text style={[styles.fontStyle1,{paddingHorizontal:10}]}>{"Currency"}</Text>
        )
      }
      {
        Documentpicker&&(
          <TouchableOpacity style={{
            height:windowWidth*(6/100),
            width:windowWidth*(30/100),
            marginLeft:5,
            backgroundColor:colours.lightGrey,
            borderRadius:6,
            alignItems:'center',
            justifyContent:'center'
          }}
          onPress={onPress}
          >
            <Text style={{fontFamily: 'Proxima Nova Alt Semibold',fontSize:getFontontSize(14),color:colours.primaryBlack}}>Id Proof</Text>
          </TouchableOpacity>
        )
      }
      {
        Disable?        
        <Text numberOfLines={1} style={{ width: windowWidth * (40/ 100), marginLeft:10, color:colours.primaryBlack, fontFamily: 'Proxima Nova Alt Semibold', fontSize: getFontontSize(16),paddingLeft:10}}>{value}</Text>
        :
        <TextInput
          style={{ width: windowWidth * ((Width-28 )/ 100), marginLeft:10, color:colours.primaryBlack, fontFamily: 'Proxima Nova Alt Semibold', padding:0, fontSize: getFontontSize(16),paddingLeft:10}}
          onChangeText={OnChangeText}
          value={value}
          placeholder={Placeholder}
          placeholderTextColor={colours.blue}
          maxLength={Length?Length:null}
          secureTextEntry={secureEntryStatus}
          textAlignVertical={'center'}
          keyboardType={KeyboardType?KeyboardType:'default'}
        />
      }

        {secureEntry && (
          
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => {
              setSecureEntryStatus(!secureEntryStatus);
              setShow(!show);
            }}>
            <Image
              source={show ? require(`../asset/images/eye2.png`):require(`../asset/images/eye1.png`)}
              style={{
                width:windowWidth * (7 / 100),
                height: windowWidth * (7 / 100),
                right:-20
              }}
            />
          </TouchableOpacity>
        )}
      </View>
      {Error? (
        <Text style={[styles.error, {width: windowWidth * (Width / 105),textAlign:"left"}]}>{ErrorText ? ErrorText : "*Required"}</Text>
      )
      :
      <Text style={[styles.error, {width: windowWidth * (Width / 105),textAlign:"left"}]}></Text>
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
  },
  error: {
    color: colours.primaryRed,
    marginTop: '0.3%',
    paddingLeft: '1%',
    fontFamily: 'Proxima Nova Alt Regular',
    fontSize: getFontontSize(14),
  },
  fontStyle1: {
    color: colours.lightBlue,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
  }
});
