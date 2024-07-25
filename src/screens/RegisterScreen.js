import React, { useRef, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ImageBackground, Dimensions, Platform, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView, Linking } from 'react-native';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import AuthButton from '../components/AuthButton';
import LoginTextInput from '../components/LoginTextInput';
import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { regProfile, resentOTP } from '../api';
// import Toast from 'react-native-simple-toast';
import Toast from 'react-native-toast-message'
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Modal from "react-native-modal";
import { Alert } from 'react-native';
import { showIcon } from '../globals/icons';
import PhoneNumberInput from '../components/PhoneNumberInput';
import CheckBox from 'react-native-check-box';
import Header from '../components/Header';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const RegisterScreen = ({ navigation }) => {

  const { showLoader } = React.useContext(LoaderContext);
  const { register } = React.useContext(AppContext);
 

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [phoneCCode, setPhoneCCode] = React.useState({CountryCode : '91'});
 

  const [nameError, setNameError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [phoneError, setPhoneError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);



  const [nameErrorsMessage, setNameErrorMessage] = React.useState('');
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [phoneErrorMessage, setPhoneErrorMessage] = React.useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');


  const [otp, setOTP] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [terms, setTerms] = useState(false);
  const [details, setDetails] = useState('');
  const [value, setValue] = useState('');
  const [Id,setId]=useState('');
  const [dummy, setDummy] = useState(false);

  const phoneInput = useRef(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  const handlemail = async (text) => {
    setEmail(text), setEmailError(false);
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!text.match(mailformat)) {
      setEmailErrorMessage('Enter a valid email ID');
      setEmailError(true);
    }
  };

  const handlePhone = async (text) => {
    setPhone(text);
    setPhoneError(false);
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (phone == '') {
      setPhoneErrorMessage('Enter a valid mobile number');
      setPhoneError(true);
    }
  };

  const handleRegister = async () => {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    const nameError = name.trim() === '';
    const PhoneError = phone.trim() === '';
    const PasswordError = password.length < 6;
    const EmailError = email.trim() === '';
    const termsError = terms === false;
    const EmailTypeError = !email.match(mailformat);

    if (!emailError) {
      if (!email.match(mailformat)) {
        setEmailErrorMessage('Enter a valid email ID');
        setEmailError(true);
      }
    } else if (emailError) {
      setEmailErrorMessage('Required');
      setEmailError(true);
    }

    if (!phoneError) {
      if (phone == '') {
        setPhoneErrorMessage('Enter a valid mobile number');
        setPhoneError(true);
      }
    } else if (phoneError) {
      setPhoneErrorMessage('*Required');
      setPhoneError(true);
    }

    if (
      !(
        nameError ||
        emailError ||
        EmailError ||
        phoneError ||
        PhoneError ||
        PasswordError ||
        EmailTypeError ||
        termsError
      )
    ) {
      try {
        showLoader(true);
        let res = await regProfile({
          sp: "getCustomerRegisterOtp",
          fullName: name,
          email: email,
          phone:phone.split(`+${phoneCCode.CountryCode}`).join(`+${phoneCCode.CountryCode}-`),
          password: password,
          termsChecked: terms,
          status: ""
        });
        showLoader(false);
        if (res[0] != '') {
          Toast.show({
              type: 'success',
              text1: 'Succcess',
              text2: 'OTP sent'
          });
          setModalVisible(true);
          let data = {
            custName: name,
            custEmail: email,
            // custPhone: phone,
            custPhone:phone.split(`+${phoneCCode.CountryCode}`).join(`+${phoneCCode.CountryCode}-`),
            custPassword: password,
            custId: res[0].custId
          }
          setId(res[0].custId);
          setDetails(data)
          setDummy(!dummy);
        }
        await AsyncStorage.setItem('isOpenedBefore', 'true');

      } catch (error) {
        showLoader(false);
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error?.Message ? error?.Message : 'Something went wrong'
        });
      }
    } else {
      setPasswordErrorMessage('Minimum 6 characters required');
      setPasswordError(PasswordError);
      setNameError(nameError);
      setNameErrorMessage('Enter full name');
    }
    if (termsError) {
      Toast.show({
          type: 'info',
          text1: 'Warning',
          text2: 'Agree Terms & Conditions'
      });
    }
  };


  const handleOTP = async () => {
    // Alert.alert('hi')
    try {
      if (otp == '') {
        Toast.show({
            type: 'info',
            text1: 'Warning',
            text2: 'Please enter OTP'
        });
      } else {
        let res = await register(
          otp,
          details)
          Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Registration successful'
          });
        navigation.reset({
          index: 0,
          routes: [{ name: 'DrawerStackNavigator' },{ name: 'LoginScreen' }],
        });
        setModalVisible(false);
      }
    } catch (e) {
      Toast.show({
          type: 'error',
          text1: 'Error',
          text2: e?.Message?e?.Message:''
      });
    }
  }

  const getresendOTP = async () => {
    showLoader(true);
    try {
        let res1 = await resentOTP({
            sp: "resendOtp ",
            userId: Id,
            userMode: "customer"
        })
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'OTP resended successfully'
        });
        showLoader(false)
    } catch (e) {
        showLoader(false)
    }
}

  return (
    <SafeAreaView style={styles.container}>
    <Header backarrow navigation={navigation}/>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 200 }}>

          <Image
            source={require('../asset/logo/LogoB.png')}
            style={{
              height: windowWidth * (25 / 100),
              width: windowWidth * (50 / 100),
              marginTop: windowHeight*(5/100),
              resizeMode: 'contain',
            }}
          />
          <View style={styles.innerContainer}>
            <Text style={[styles.fontStyle3, { paddingBottom: 5, textAlign: 'center', fontSize: getFontontSize(14) }]}>Find your dream car!</Text>
            <Text style={[styles.fontStyle3, { paddingBottom: 5, textAlign: 'center', fontSize: getFontontSize(18), fontFamily: 'Poppins-Bold' }]}>Register as a Customer</Text>

            <LoginTextInput
              OnChangeText={(text) => {
                setName(text);
                if (text.length === '') {
                  setNameErrorMessage('Enter full name');
                  setNameError(true);
                } else {
                  setPasswordError(false);
                }
                setNameError(false);
              }}
              Width={85}
              Placeholder={'Full Name'}
              value={name}
              Error={nameError}
              ErrorText={nameErrorsMessage}
              Height={windowWidth * (14 / 100)}
              Icon={'uname'}
            />
            <LoginTextInput
              OnChangeText={(text) => {
                handlemail(text)
              }}
              Width={85}
              Placeholder={'Email ID'}
              value={email}
              Error={emailError}
              ErrorText={emailErrorMessage}
              Height={windowWidth * (14 / 100)}
              Icon={'mail'}
            />

            <PhoneNumberInput
              onChangeFormattedText={(text) => {
                handlePhone(text)
              }}
              setPhoneCCode={()=>{
                  setPhoneCCode,
                  setPhoneError(false)
              }}
              phoneCCode={phoneCCode}
              Width={85}
              value={phone}
              Error={phoneError}
              ErrorText={phoneErrorMessage}
              Height={windowWidth * (14 / 100)}
            />

            <LoginTextInput
              OnChangeText={(text) => {
                setPassword(text);
                if (text.length <= 5) {
                  setPasswordErrorMessage('Minimum 6 characters required');
                  setPasswordError(true);
                } else {
                  setPasswordError(false);
                }
              }}
              Width={85}
              Placeholder={'Password'}
              value={password}
              PhoneCode={email == '' ? null : isNaN(email.charAt(0)) ? false : true}
              Error={passwordError}
              ErrorText={passwordErrorMessage}
              Height={windowWidth * (14 / 100)}
              secureEntry
              Icon={'lock'}
            />


           

            <View style={styles.checkboxContainer}>
              <CheckBox
                style={{ flex: 1, padding: 10, }}
                onClick={() => {
                  setTerms(!terms);
                }}
                isChecked={terms}
              // leftText={"CheckBox"}
              />
              <Text style={styles.fontStyle6}>By clicking, you are agreeing to our 
                <Text 
                onPress={() => navigation.navigate('Terms&Conditions',{
                    Type: 'Customer Terms and Conditions',
                    fromReg: true,
                  })
                } 
                style={[styles.fontStyle6, { color: colours.primaryColor }]}>Terms and Conditions.
                </Text>
              </Text>
            </View>


            <View style={styles.buttonContainer}>
              <AuthButton
                OnPress={phoneError || emailError ? null : handleRegister}
                ButtonText={'Create Account'}
                ButtonWidth={85}
              />
            </View>

            <View style={{ flexDirection: 'row', width: '90%', marginTop: windowHeight * (2 / 100) }} >
              <View style={{ height: 2, flex: 1, alignSelf: 'center' }} />
              <Text style={[styles.fontStyle3, { color: colours.primaryBlack, fontFamily: "Poppins-Regular" }]}>  Already Have an Account?</Text>
              <Text style={[styles.fontStyle3, { color: colours.blue, textDecorationLine: 'underline' }]} onPress={() => navigation.goBack()}> Sign In</Text>
              <View style={{ height: 2, flex: 1, alignSelf: 'center' }} />
            </View>

            <View style={{ flexDirection: 'row', width: '90%',marginTop: windowHeight * (1 / 100) }} >
              <View style={{ height: 2, flex: 1, alignSelf: 'center' }} />
              <Text style={[styles.fontStyle3, { color: colours.primaryBlack, fontFamily: "Poppins-Regular" }]}> Register as a Vendor? </Text>
              <Text style={[styles.fontStyle3, { color: colours.blue, textDecorationLine: 'underline' }]} onPress={() => navigation.navigate('VendorRegister')}> Register</Text>
              <View style={{ height: 2, flex: 1, alignSelf: 'center' }} />
            </View>

          </View>

        </ScrollView>
        <Modal
          isVisible={isModalVisible} >
          <View style={styles.modalView}>

            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)} >
                <View style={{
                  width: windowWidth * (5 / 100),
                  height: windowWidth * (5 / 100),
                  right: windowWidth * (2 / 100),
                  top:windowHeight*(2/100)
                }}>{showIcon('close', colours.lightRed, windowWidth * (6 / 100))}</View>
              </TouchableOpacity>
            </View>
            <Text style={styles.fontStyle2}>
              Enter OTP
            </Text>
            <Text style={[styles.fontStyle3, { color: colours.darkBlack, paddingBottom: 10, width: windowWidth * (80 / 100), textAlign: 'center', marginTop: windowHeight * (2 / 100), fontSize: getFontontSize(13) }]}>Please enter the verification code sent to your phone/mail.</Text>

            <OTPInputView
              autoFocusOnLoad={false}
              style={{
                width: windowWidth * (70 / 100),
                height: windowHeight * (4 / 100),
                marginTop: windowHeight * (2 / 100)
              }}
              code={otp}
              pinCount={6}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeChanged={(code) => setOTP(code)}
            />
            <Text style={[styles.fontStyle3, { color: colours.darkBlack, paddingBottom: 10, width: windowWidth * (80 / 100), textAlign: 'center', marginTop: windowHeight * (4 / 100), fontSize: getFontontSize(13) }]}>Have you not received the code ? <Text onPress={()=>getresendOTP()} style={[styles.fontStyle3, { color: colours.secondaryBlue, textDecorationLine: 'underline' }]}>Resend</Text></Text>

            <View style={{ marginTop: 15 }}>
              <AuthButton
                OnPress={() => handleOTP()}
                ButtonText={'Verify'}
                ButtonWidth={85}
              />
            </View>

          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundColor,
    alignItems: 'center',
  },
  image: {
    width: windowWidth,
    height: windowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: windowWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:windowHeight*(2/100),
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: windowWidth * (85 / 100),
    justifyContent: 'space-around',
    marginTop: 10
  },
  absolute: {
    width: windowWidth * (85 / 100),
    height: windowHeight * (75 / 100),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    // position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  topButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 0.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colours.primaryColor
  },
  modalView: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (40 / 100),
    backgroundColor: colours.primaryWhite,
    borderRadius: 10,
    padding: windowWidth * (2 / 100),
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalHeader: {
    alignItems: 'flex-end',
    width: windowWidth * (90 / 100),
    height: windowHeight * (2 / 100),
    marginBottom: 10,
  },
  fontStyle1: {
    fontSize: getFontontSize(24),
    color: colours.primaryGrey,
    fontFamily: 'Poppins-Medium',
  },
  fontStyle2: {
    fontSize: getFontontSize(16),
    color: colours.primaryGrey,
    fontFamily: 'Poppins-Medium',
  },
  fontStyle3: {
    fontSize: getFontontSize(16),
    color: colours.primaryBlack,
    fontFamily: 'Poppins-SemiBold',
  },
  fontStyle4: {
    fontSize: getFontontSize(12),
    color: colours.primaryGrey,
    fontFamily: 'Poppins-Medium',
    padding: 5,
  },
  fontStyle5: {
    fontSize: getFontontSize(16),
    color: colours.primaryColor,
    fontFamily: 'Poppins-Medium',
  },
  bottomSheet: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  underlineStyleBase: {
    width: 40,
    height: 45,
    backgroundColor: '#f8f9ff',
    borderRadius: 10,
    color: colours.blue,
    fontSize: getFontontSize(18),
    fontFamily: 'Proxima Nova Alt Semibold',
    padding:10,
  },
  underlineStyleHighLighted: {
    borderColor: colours.blue
    // fontFamily:'Inter',
    // fontSize:20,
    // color:Colors.primaryblue
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: windowWidth * (85 / 100),
    marginTop: windowHeight * (1 / 100)
  },
  fontStyle6: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(14),
    color: colours.primaryBlack,
    width: windowWidth * (70 / 100),
    textAlign: 'justify',
  },
  phcontainer: {
    height: 50,
    //width: windowWidth * (85 / 100),
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(14),
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

export default RegisterScreen;