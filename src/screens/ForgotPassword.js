import { View, Text, SafeAreaView, ImageBackground, Image, TouchableOpacity, Dimensions, KeyboardAvoidingView, StyleSheet, ScrollView, Platform } from 'react-native'
import React, { useState, useContext, useEffect } from 'react';

import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import AuthButton from '../components/AuthButton';
import LoginTextInput from '../components/LoginTextInput';
import { AppContext } from '../Context/appContext';
import { LoaderContext } from '../Context/loaderContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Toast from 'react-native-simple-toast';
import Toast from 'react-native-toast-message'
import { forgotPassword, verifyOTP } from '../api';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Modal from "react-native-modal";
import Header from '../components/Header';
import { showIcon } from '../globals/icons';
import PhoneNumberInput from '../components/PhoneNumberInput';
import SwitchSelector from "react-native-switch-selector";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ForgotPassword = ({ navigation, route }) => {

    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState(false);
    const [phoneErrorMessage, setPhoneErrorMessage] = useState('');

    const [data, setData] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');

    const [isModalVisible, setModalVisible] = useState(false);
    const [otp, setOTP] = useState('');
    const { profile, register } = useContext(AppContext);
    const [custID, setCustId] = useState('');
    const { showLoader } = React.useContext(LoaderContext);
    const [status, setStatus] = React.useState('phone');
    const [phoneCCode, setPhoneCCode] = React.useState({CountryCode : '91'});

    const handlemail = async (text) => {
        setEmail(text), 
        setData(text);
        setEmailError(false);
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!text.match(mailformat)) {
            setEmailErrorMessage('Enter a valid email ID');
            setEmailError(true);
        }
    };

    const handlePhone = async (text) => {
        setPhone(text);
        setData(text);
        setPhoneError(false);
        var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (phone == '') {
            setPhoneErrorMessage('Enter a valid mobile number');
            setPhoneError(true);
        }
    };
    const handleForgot = async () => {
        // Alert.alert('hi')
        const phoneError = phone.trim() === '';
        const EmailError = email.trim() === '';


        if (phone != ''||email!='') {
            try {
                showLoader(true);
                let res = await forgotPassword({
                    sp: "forgotpassword",
                    // username: `+91-${phone}`
                    username: data.split(`+${phoneCCode.CountryCode}`).join(`+${phoneCCode.CountryCode}-`)
                })
                
                if (res != '') {
                    // toggleModal()
                    Toast.show({
                        type: 'success',
                        text1: 'Succcess',
                        text2: 'OTP sent'
                    });
                    setCustId(res[0].custId)
                    navigation.navigate('ResetPassword',{ id: res[0].custId })
                }
                showLoader(false);
            } catch (e) {
                showLoader(false);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: e?.Message?e?.Message:''
                });
            }
        } else {
            setPhoneError(phoneError);
            setPhoneErrorMessage('*Required');
            setEmailError(EmailError);
            setEmailErrorMessage('*Required');
        }

    }
   
    const toggleButton = async (value) => {
        setStatus(value)
    }
    return (
        <SafeAreaView style={styles.container}>
        <Header backarrow navigation={navigation}  title={'Forgot Password'}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView>
                <View style={{ width: windowWidth, alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        source={require('../asset/logo/LogoB.png')}
                        style={{
                            height: windowWidth * (40 / 100),
                            width: windowWidth * (40 / 100),
                            resizeMode: 'contain',
                        }}
                    />
                </View>


                <View style={styles.innerContainer}>
                    <View style={styles.navView}>
                        <SwitchSelector
                            initial={0}
                            onPress={value => toggleButton(value)}
                            textColor={'#c9c9c9'} //'#7a44cf'
                            selectedColor={colours.primaryWhite}
                            buttonColor={colours.secondaryBlue}
                            borderColor={colours.secondaryColor}
                            hasPadding
                            options={[
                                { label: "Phone", value: "phone", }, //images.feminino = require('./path_to/assets/img/feminino.png')
                                { label: "Email", value: "mail", } //images.masculino = require('./path_to/assets/img/masculino.png')
                            ]}
                            testID="gender-switch-selector"
                            accessibilityLabel="gender-switch-selector"
                            borderRadius={10}
                            height={45}
                        />
                    </View>
                    {
                        status === 'phone' ?

                            <PhoneNumberInput
                                onChangeFormattedText={(text) => {
                                    handlePhone(text)
                                }}
                                setPhoneCCode={()=>{
                                    setPhoneCCode,
                                    setPhoneError(false);
                                }}
                                phoneCCode={phoneCCode}
                                Width={85}
                                value={phone}
                                Error={phoneError}
                                ErrorText={phoneErrorMessage}
                                Height={windowWidth * (14 / 100)}

                            />
                            :
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
                    }



                    <View style={styles.buttonContainer}>
                        <AuthButton
                            OnPress={() =>status === 'phone' && phone =='' ?
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'Enter a valid mobile number'
                            }):status === 'mail' && email =='' ? 
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'Enter a valid email'
                            }) : handleForgot()}
                            ButtonText={'Request OTP'}
                            ButtonWidth={85}
                        />
                    </View>
                </View>
                <TouchableOpacity style={{ flexDirection: 'row', width: windowWidth, marginTop: Platform.OS == 'ios'? 0 : windowHeight * (5 / 100), justifyContent: 'center' }} onPress={() => navigation.goBack()}>
                    <Text style={[styles.fontStyle3, { color: colours.primaryBlack, textAlign: 'center' }]}>Back to Login</Text>
                </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ForgotPassword


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.backgroundColor,
        alignItems: 'center'
    },
    image: {
        width: windowWidth,
        height: windowHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        width: windowWidth,
        height: windowHeight * (55 / 100),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    navView: {
        paddingHorizontal: windowWidth * (2 / 100),
        width: windowWidth * (90 / 100),
        marginBottom: windowHeight * (1 / 100)
    },
    buttonContainer: {
        flexDirection: 'row',
        width: windowWidth * (85 / 100),
        justifyContent: 'space-around',

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
    underlineStyleBase: {
        width: 40,
        height: 45,
        backgroundColor: '#f8f9ff',
        borderRadius: 10,
        color: colours.blue,
        fontSize: getFontontSize(18),
        fontFamily: 'Poppins-SemiBold',
        padding:10
    },
    underlineStyleHighLighted: {
        borderColor: colours.blue
        // fontFamily:'Inter',
        // fontSize:20,
        // color:Colors.primaryblue
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
});