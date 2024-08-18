import React, {useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Linking,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  ImageBackground,
} from 'react-native';

import colours from '../globals/colours';
import {getFontontSize} from '../globals/functions';
import AuthButton from '../components/AuthButton';
import LoginTextInput from '../components/LoginTextInput';
import {AppContext} from '../Context/appContext';
import {LoaderContext} from '../Context/loaderContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Toast from 'react-native-simple-toast';
import Toast from 'react-native-toast-message';
import Header from '../components/Header';
import PhoneNumberInput from '../components/PhoneNumberInput';
import SwitchSelector from 'react-native-switch-selector';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginScreen = ({navigation}) => {
  const {login, cCodeFlag} = React.useContext(AppContext);
  const {showLoader} = React.useContext(LoaderContext);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [status, setStatus] = React.useState('phone');
  const [phoneCCode, setPhoneCCode] = React.useState({CountryCode: '91'});

  const handlemail = async text => {
    setEmail(text), setEmailError(false);
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!text.match(mailformat)) {
      setEmailErrorMessage('Enter a valid email ID');
      setEmailError(true);
    }
  };

  const handleLogin = async () => {
    const EmailError = email === '';
    const PasswordError = password === '';

    if (!(EmailError || PasswordError || emailError)) {
      try {
        showLoader(true);
        let res = await login({
          sp: 'getCustomerAuth',
          username:
            status == 'email'
              ? email
              : email
                  .split(`+${phoneCCode.CountryCode}`)
                  .join(`+${phoneCCode.CountryCode}-`),
          password: password,
        });
        await AsyncStorage.setItem('isOpenedBefore', 'true');

        navigation.reset({
          index: 0,
          routes: [{name: 'DrawerStackNavigator'}],
        });
        // Toast.show(res)
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res,
        });
        showLoader(false);
      } catch (err) {
        // Toast.show(err.Message)
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err?.Message ? err?.Message : 'Something went wrong',
        });
        showLoader(false);
      }
    } else {
      setEmailError(emailError ? emailError : EmailError);
      setPasswordError(PasswordError);
      setEmailErrorMessage(emailError ? 'Enter a valid email ID' : '*Required');
      setPasswordErrorMessage('*Required');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow navigation={navigation} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 200,
          }}>
          <Image
            source={require('../asset/logo/LogoB.png')}
            style={{
              height: windowWidth * (35 / 100),
              width: windowWidth * (55 / 100),
              resizeMode: 'contain',
            }}
          />
          <View style={styles.innerContainer}>
            <View>
              <Text
                style={[
                  styles.fontStyle3,
                  {
                    paddingBottom: 5,
                    textAlign: 'center',
                    fontSize: getFontontSize(16),
                  },
                ]}>
                Welcome to ibidz !
              </Text>
              <Text
                style={[
                  styles.fontStyle3,
                  {paddingBottom: 5, textAlign: 'center'},
                ]}>
                Login as Buyer
              </Text>
              <View style={{paddingVertical: windowHeight * (1 / 100)}}>
                <SwitchSelector
                  initial={0}
                  onPress={value => {
                    setEmail('');
                    setEmailError(false);
                    setEmailErrorMessage('');
                    setPassword();
                    setPasswordError(false);
                    setPasswordErrorMessage('');
                    setStatus(value);
                  }}
                  textColor={colours.primaryBlack} //'#7a44cf'
                  selectedColor={colours.primaryWhite}
                  buttonColor={colours.primaryColor}
                  hasPadding
                  selectedTextStyle={[
                    styles.fontStyle2,
                    {color: colours.primaryWhite},
                  ]}
                  textStyle={styles.fontStyle2}
                  options={[
                    {label: `With Phone`, value: `phone`},
                    {label: `With Email`, value: `email`},
                  ]}
                  borderRadius={windowHeight * (5 / 100)}
                  height={windowHeight * (5 / 100)}
                />
              </View>
              {status == 'email' ? (
                <LoginTextInput
                  OnChangeText={text => handlemail(text)}
                  Width={85}
                  Placeholder={'Email'}
                  value={email}
                  Error={emailError}
                  // PhoneCode={email == '' ? null : isNaN(email.charAt(0)) ? false : true}
                  ErrorText={emailErrorMessage}
                  Height={windowWidth * (14 / 100)}
                  Icon={'mail'}
                />
              ) : (
                <PhoneNumberInput
                  onChangeFormattedText={text => {
                    setEmail(text);
                    setEmailError(false);
                  }}
                  setPhoneCCode={() => {
                    setPhoneCCode, setEmailError(false);
                  }}
                  phoneCCode={phoneCCode}
                  Width={85}
                  value={email}
                  Error={emailError}
                  ErrorText={emailErrorMessage}
                  Height={windowWidth * (14 / 100)}
                />
              )}
              <LoginTextInput
                OnChangeText={text => {
                  setPassword(text);
                  setPasswordError(false);
                }}
                Width={85}
                Placeholder={'Password'}
                value={password}
                Error={passwordError}
                ErrorText={passwordErrorMessage}
                Height={windowWidth * (14 / 100)}
                secureEntry
                Icon={'lock'}
              />

              <Text
                style={styles.forgot}
                onPress={() => navigation.navigate('ForgotPassword')}>
                Forgot Password ?
              </Text>

              <View style={styles.buttonContainer}>
                <AuthButton
                  OnPress={() => handleLogin()}
                  ButtonText={'Sign In'}
                  ButtonWidth={85}
                />
              </View>
            </View>

            <View style={{marginBottom: windowHeight * (10 / 100)}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: windowWidth,
                  justifyContent: 'center',
                }}>
                <Text style={styles.fontStyle2}> Create An Account?</Text>
                <Text
                  style={[
                    styles.fontStyle2,
                    {
                      color: colours.blue,
                      fontFamily: 'Poppins-Bold',
                      textDecorationLine: 'underline',
                    },
                  ]}
                  onPress={() => navigation.navigate('RegisterScreen')}>
                  {' '}
                  Register
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: windowWidth,
                  justifyContent: 'center',
                }}>
                <Text style={styles.fontStyle3}> Sign as</Text>
                <Text
                  style={[
                    styles.fontStyle3,
                    {
                      color: colours.blue,
                      fontFamily: 'Poppins-Bold',
                      textDecorationLine: 'underline',
                    },
                  ]}
                  onPress={() => navigation.navigate('VendorLoginScreen')}>
                  {' '}
                  Seller
                </Text>
              </View>
            </View>
          </View>
          {/* </ImageBackground> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colours.backgroundColor,
    // backgroundColor: 'pink',
  },
  image: {
    height: windowWidth * (50 / 100),
    width: windowWidth * (50 / 100),
    resizeMode: 'contain',
  },
  innerContainer: {
    width: windowWidth,
    height: windowHeight * (60 / 100),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: windowHeight * (1 / 100),
    //  backgroundColor: 'white'
  },
  buttonContainer: {
    flexDirection: 'row',
    width: windowWidth * (85 / 100),
    justifyContent: 'space-around',
  },
  fontStyle2: {
    fontSize: getFontontSize(16),
    color: colours.primaryBlack,
    fontFamily: 'Poppins-Regular',
  },
  fontStyle3: {
    fontSize: getFontontSize(20),
    color: colours.primaryBlack,
    fontFamily: 'Poppins-SemiBold',
  },
  fontStyle4: {
    fontSize: getFontontSize(12),
    color: colours.primaryBlack,
    fontFamily: 'Poppins-Regular',
  },
  forgot: {
    color: colours.blue,
    paddingBottom: windowHeight * (2 / 100),
    textAlign: 'left',
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(14),
    textDecorationLine: 'underline',
    marginTop: windowHeight * (0.5 / 100),
    width: windowWidth * (40 / 100),
  },
});

export default LoginScreen;
