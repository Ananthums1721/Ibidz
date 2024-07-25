import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { getPaymentDues, userFeedBack } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import LoginTextInput from '../components/LoginTextInput';
import TextInputMultiLineComponent from '../components/TextInputMultiLineComponent';
import PhoneNumberInput from '../components/PhoneNumberInput';
import AuthButton from '../components/AuthButton';
import Toast from 'react-native-simple-toast';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const FeedBack = ({ navigation }) => {

    const [feedback, setFeedBack] = useState('');
    const { showLoader } = React.useContext(LoaderContext);

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [message, setMessage] = React.useState('');

    const [nameError, setNameError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [phoneError, setPhoneError] = React.useState(false);
    const [messageError, setMessageError] = React.useState(false);

    const [nameErrorsMessage, setNameErrorMessage] = React.useState('');
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [phoneErrorMessage, setPhoneErrorMessage] = React.useState('');
    const [messageErrorMessage, setMessageErrorMessage] = React.useState('');

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
        if (!text.match(phoneno)) {
            setPhoneErrorMessage('Enter a valid mobile number');
            setPhoneError(true);
        }
    };


    const handleSend = async () => {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        const nameError = name.trim() === '';
        const PhoneError = phone.trim() === '';
        const MessageError = message.trim() === '';
        const phoneTypeError = !phone.match(phoneno);
        const EmailError = email.trim() === '';
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
            if (!phone.match(phoneno)) {
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
                MessageError ||
                EmailTypeError ||
                phoneTypeError
            )
        ) {
            try {
                let res = await userFeedBack({
                    sp: "insUserFeedBack",
                    userName: name,
                    userPhone: phone,
                    userEmail: email,
                    userNote: message
                });
                Toast.show('FeedBack submitted successfully')
                setName('');
                setPhone('');
                setEmail('');
                setMessage('');
                navigation.goBack();
            } catch (error) {
                showLoader(false);
            }
        } else {
            setNameError(nameError);
            setMessageError(MessageError);
            setNameErrorMessage('Enter full name')
            setMessageErrorMessage('Minimum 3 characters required');
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <Header backarrow logo navigation={navigation} />
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView style={{ flex: 1, }}
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 150 }}
                >

                    <View style={styles.head}>
                        <Text style={styles.fontText1}>Contact Form</Text>
                    </View>

                    <>
                        <View style={styles.subboxText}>
                            <LoginTextInput
                                OnChangeText={(text) => {
                                    setName(text);
                                    if (text.length === '') {
                                        setNameErrorMessage('*Required');
                                        setNameError(true);
                                    }
                                    setNameError(false);
                                }}
                                Width={85}
                                Placeholder={'Full Name'}
                                value={name}
                                Error={nameError}
                                ErrorText={nameErrorsMessage}
                                Height={windowWidth * (14 / 100)}
                                Icon={'default'}
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
                                Icon={'emailImg'}
                            />

                            <LoginTextInput
                                OnChangeText={(text) => handlePhone(text)}
                                Width={85}
                                Placeholder={'Phone No'}
                                value={phone}
                                PhoneCode={true}
                                Length={10}
                                KeyboardType={'numeric'}
                                Error={phoneError}
                                ErrorText={phoneErrorMessage}
                                Height={windowWidth * (14 / 100)}
                                Icon={'callImg'}
                                CountryCode
                            />
                            <TextInputMultiLineComponent
                                OnChangeText={(text) => {
                                    setMessage(text);
                                    if (text.length <= 2) {
                                        setMessageErrorMessage('Minimum 3 characters required');
                                        setMessageError(true);
                                    } else {
                                        setMessageError(false);
                                    }
                                }}
                                Width={85}
                                Placeholder={'Message '}
                                value={message}
                                Error={messageError}
                                ErrorText={messageErrorMessage}
                                Align={'left'}
                            />
                            <Text />
                            <AuthButton
                                OnPress={phoneError || emailError ? null : handleSend}
                                ButtonText={'Send'}
                                ButtonWidth={85}
                            />
                        </View>

                    </>

                </ScrollView>
                
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default FeedBack
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.backgroundColor,
        alignItems:"center"
    },
    subboxText: {

        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth * (90 / 100),
        padding: 10
    },
    fontText10: {
        fontFamily: 'Poppins-Regular',
        fontSize: getFontontSize(16),
        color: colours.primaryBlack,
        lineHeight: 20,
        textAlign: "justify"

    },
    head: {
        flexDirection: 'row',
        width: windowWidth * (90 / 100),
        marginTop: windowHeight * (5 / 100),
        // paddingHorizontal: 10,
    },
    fontText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: getFontontSize(20),
        color: colours.primaryBlack,
    },

})