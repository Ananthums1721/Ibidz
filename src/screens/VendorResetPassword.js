import { View, Text, SafeAreaView, KeyboardAvoidingView, ScrollView, ImageBackground, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState, useContext } from 'react'
import LoginTextInput from '../components/LoginTextInput';
import AuthButton from '../components/AuthButton';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import { LoaderContext } from '../Context/loaderContext';
import { resentOTP, resetPassword } from '../api';
// import Toast from 'react-native-simple-toast';
import Toast from 'react-native-toast-message'
import Header from '../components/Header';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VendorResetPassword = ({ navigation, route }) => {

    const [newpassword, setNewPassword] = useState('');
    const [newpasswordError, setNewPasswordError] = useState(false);
    const [newpasswordErrorMessage, setNewPasswordErrorMessage] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [confirmpasswordError, setConfirmPasswordError] = useState(false);
    const [confirmpasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    const [Otp, setOtp] = useState(0);
    const [OtpError, setOtpError] = useState(false);
    const [OtpErrorMessage, setOtpErrorMessage] = useState('');
    const { showLoader } = useContext(LoaderContext);

    const id = route?.params?.id ? route?.params?.id : null;
    const otp = route?.params.otp ? route?.params.otp : null;


    const newPasswordHandler = (textEnterd) => {
        setNewPassword(textEnterd);
        setNewPasswordError(false);
        if (textEnterd.length < 6) {
            setNewPasswordErrorMessage('Minimum 6 Characters Required');
            setNewPasswordError(true);
        }
    };
    const confirmPasswordHandler = (textEnterd) => {
        setConfirmPassword(textEnterd);
        setConfirmPasswordError(false);
        if (textEnterd !== newpassword) {
            setConfirmPasswordErrorMessage('Please Enter Confirm Password');
            setConfirmPasswordError(true);
        }
    };
    const formHandler = async () => {
        let newpasswordError = newpassword === null;
        let confirmpasswordError = confirmpassword === null;
        let OtpError = Otp === null;

        if (!(newpasswordError || confirmpasswordError || OtpError)) {
            handleChangePassword();
        }
    };


    const handleChangePassword = async () => {

        if (newpassword.length < 6) {
            setNewPasswordErrorMessage(
                'Minimum 6 Characters Required',
            );
            setNewPasswordError(true);
        } else if (confirmpassword !== newpassword) {
            setConfirmPasswordErrorMessage('Please Enter Confirm Password');
            setConfirmPasswordError(true);
        } else if (Otp === '') {
            setOtpErrorMessage('Please the Verification code.');
            setOtpError(true);
        }else {
            try {
                showLoader(true)
                if (otp != '') {
                    let res = await resetPassword({
                        sp: "vendorresetPassword",
                        sellerId: id,
                        otp: Otp,
                        password: confirmpassword
                    })
                    showLoader(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: 'Reset Password successfull'
                    })
                    navigation.navigate('LoginScreen')
                }
            } catch (e) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: e?.Message? e?.Message:''
                })
                showLoader(false);
            }
        }
    }

    const getresendOTP = async () => {
        showLoader(true);
        try {
            let res1 = await resentOTP({
                sp: "resendOtp ",
                userId: id,
                userMode: "seller"
            })
            showLoader(false)
        } catch (e) {
            showLoader(false)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
        <Header backarrow title={'Reset Password'} navigation={navigation} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                    {/* <ImageBackground source={require('../asset/images/screenback.png')}
                        style={{
                            height: windowHeight,
                            width: windowWidth,

                        }}> */}
                    <Image
                        source={require('../asset/logo/LogoB.png')}
                        style={{
                            height: windowWidth * (40 / 100),
                            width: windowWidth * (40 / 100),
                            resizeMode: 'contain',
                        }}
                    />
                    <View style={styles.innerContainer}>

                        <LoginTextInput
                            OnChangeText={(text) => {
                                setOtp(text);
                                setOtpError(false);
                            }}
                            Width={85}
                            Placeholder={'OTP'}
                            value={Otp}
                            Error={OtpError}
                            ErrorText={OtpErrorMessage}
                            Height={windowWidth * (14 / 100)}
                            secureEntry
                            Icon={'lock'}
                        />

                        <LoginTextInput
                            OnChangeText={newPasswordHandler}
                            Width={85}
                            Placeholder={'New Password'}
                            value={newpassword}
                            Error={newpasswordError}
                            ErrorText={newpasswordErrorMessage}
                            Height={windowWidth * (14 / 100)}
                            secureEntry
                            Icon={'lock'}
                        />

                        <LoginTextInput
                            OnChangeText={confirmPasswordHandler}
                            Width={85}
                            Placeholder={'Confirm Password'}
                            value={confirmpassword}
                            Error={confirmpasswordError}
                            ErrorText={confirmpasswordErrorMessage}
                            Height={windowWidth * (14 / 100)}
                            secureEntry
                            Icon={'lock'}
                        />

                        <View style={styles.buttonContainer}>
                            <AuthButton
                                OnPress={() => formHandler()}
                                ButtonText={'Reset Password'}
                                ButtonWidth={85}
                            />

                            <Text style={[styles.fontStyle3, { color: colours.darkBlack, paddingBottom: 10, width: windowWidth * (80 / 100), textAlign: 'center', marginTop: windowHeight * (4 / 100) }]}>
                                Have you not received the code ?<Text
                                    onPress={() => getresendOTP()}
                                    style={[styles.fontStyle3, { color: colours.secondaryBlue, textDecorationLine: 'underline' }]}>Resend</Text></Text>

                        </View>
                    </View>
                    <TouchableOpacity style={{ flexDirection: 'row', width: '90%', marginTop: windowHeight * (5 / 100) }} onPress={() => navigation.goBack()}>
                        <View style={{ height: 2, flex: 1, alignSelf: 'center' }} />
                        <Text style={[styles.fontStyle3, { color: colours.primaryBlack, textAlign: 'center' }]}>Back to Login</Text>
                        <View style={{ height: 2, flex: 1, alignSelf: 'center' }} />
                    </TouchableOpacity>
                    {/* </ImageBackground> */}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default VendorResetPassword


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.backgroundColor,
        alignItems:'center'
    },
    image: {
        width: windowWidth,
        height: windowHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        width: windowWidth,
        height: windowHeight * (60 / 100),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    buttonContainer: {
        width: windowWidth * (85 / 100),
        justifyContent: 'space-around',
        marginTop: 10
    },
    fontStyle3: {
        fontSize: getFontontSize(16),
        color: colours.primaryGrey,
        fontFamily: 'Poppins-SemiBold',
    },
    optionModalView: {
        height: windowHeight * (45 / 100),
        marginTop: windowHeight * (55 / 100),
        // paddingTop: windowHeight * (10/ 100),
        // paddingBottom: windowHeight * (2 / 100),
        width: windowWidth,
        backgroundColor: colours.primaryWhite,
        justifyContent: 'space-around',
        alignItems: 'center'
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
        fontSize: getFontontSize(20),
        fontFamily: 'Poppins-SemiBold'
    },
    underlineStyleHighLighted: {
        borderColor: colours.blue
        // fontFamily:'Inter',
        // fontSize:20,
        // color:Colors.primaryblue
    },
});