import React, { useContext, useEffect, useState } from "react";
import { Text, View, SafeAreaView, StyleSheet, Dimensions, Alert } from 'react-native';
import AuthButton from "../components/AuthButton";
import Header from "../components/Header";
import LoginTextInput from "../components/LoginTextInput";
import { AppContext } from "../Context/appContext";
import { LoaderContext } from "../Context/loaderContext";
import { getFontontSize } from "../globals/functions";
import colours from "../globals/colours";
import { getProfileDetails, updateProfile } from "../api";
import Toast from 'react-native-toast-message'
import PhoneNumberInput from '../components/PhoneNumberInput';
import commonConst from '../globals/commonConstants';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const EditProfile = ({ navigation }) => {

    const { showLoader, loading } = React.useContext(LoaderContext);
    const { editProfile, profile } = useContext(AppContext);

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('')

    const [nameError, setNameError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [phoneError, setPhoneError] = React.useState(false);

    const [nameErrorsMessage, setNameErrorMessage] = React.useState('false');
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [phoneErrorMessage, setPhoneErrorMessage] = React.useState('');
    const [profiledata, setProfileData] = useState('');
    const [phoneCCode, setPhoneCCode] = React.useState({CountryCode : '91'});
    const [phoneCode, setPhoneCode] = useState('IN');
    const [dummy, setDummy] = useState(false)


    useEffect(() => {
        getProfile()
    }, [])

    const getProfile = async () => {
        showLoader(true)
        let res = await getProfileDetails()
        setProfileData(res)
        setName(res[0]?.custName);
        setEmail(res[0]?.custEmail);
        setPhone(res[0]?.custPhone? res[0]?.custPhone.split('-')[1] : '');
        if(res[0]?.custPhone){
            getCode(res[0]?.custPhone.split('-')[0])
        }
        showLoader(false)
    }

    const getCode = (value) => {
        var jsonVal = commonConst.countryCode;
        for (var key in jsonVal) {
            if (jsonVal[key] == value){
                setPhoneCode(key)
                phoneCCode.CountryCode = value.split('+').join('');
                setPhoneCCode(phoneCCode);
                setDummy(!dummy);
            }
        }
    }


    const handlemail = async (text) => {
        setEmail(text), setEmailError(false);
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!text.match(mailformat)) {
            setEmailErrorMessage('Enter Valid Mail ID');
            setEmailError(true);
        }
    }

    const handleValidation = () => {
        // Alert.alert('hi')
        const EmailError = email === '';
        const NameError = name === '';
        const PhoneError = phone === '';
        if (!(EmailError || PhoneError || NameError)) {
            if (profiledata[0]?.custEmail !== email ||
                profiledata[0]?.custPhone !== phone ||
                profiledata[0]?.custName !== name) {
                updateProfileData();
            } else {
                Toast.show({
                    type: 'ifo',
                    text1: 'Info',
                    text2: 'Details Are Not Changed'
                })
            }
        } else {
            setEmailError(EmailError);
            setNameError(NameError);
            setPhoneError(PhoneError)
            setEmailErrorMessage('Required');
            setNameErrorMessage('Required');
            setPhoneErrorMessage('Required');
        }


    }

    const updateProfileData = async () => {
        try {
            showLoader(true);
            let res = await updateProfile({
                sp: "updCustomerProfile",
                fullName: name,
                email: email,
                phone: phone.includes(`+${phoneCCode.CountryCode}`)?  phone.split(`+${phoneCCode.CountryCode}`).join(`+${phoneCCode.CountryCode}-`): `+${phoneCCode.CountryCode}-${phone}`,
                custId: profile[0].customerId ? profile[0].customerId : ""
            });
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Profile Updated Successfull'
            })
            showLoader(false);
            navigation.navigate('Profile')
        } catch (err) {
            showLoader(false);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: err? err : 'Something went wrong'
            })
        }
    };


    return (

        <SafeAreaView style={styles.container}>
            <Header title={'Update Profile'} navigation={navigation} backarrow />
            {
                !loading && (
                    <View style={{
                        flex: 1, padding: windowWidth * (5 / 100), alignItems: 'center',
                        justifyContent: 'center'
                    }}>
        
                        <LoginTextInput
                            OnChangeText={(text) => {
                                setName(text);
                                setNameError(false);
                            }}
                            Width={90}
                            Placeholder={'Full Name'}
                            value={name}
                            Error={nameError}
                            ErrorText={nameErrorsMessage}
                            Height={windowWidth * (14 / 100)}
                            Icon={'uname'}
                        />
                        <LoginTextInput
                            OnChangeText={handlemail}
                            Width={90}
                            Placeholder={'Email ID'}
                            value={email}
                            Error={emailError}
                            ErrorText={emailErrorMessage}
                            Height={windowWidth * (14 / 100)}
                            Icon={'mail'}
                        />
                        {/* <LoginTextInput
                            OnChangeText={handlePhone}
                            Width={90}
                            Placeholder={'Phone No'}
                            value={phone}
                            KeyboardType={'number-pad'}
                            // Length={10}
                            PhoneCode={phone == '' ? null : isNaN(phone.charAt(0)) ? false : true}
                            Error={phoneError}
                            ErrorText={phoneErrorMessage}
                            Height={windowWidth * (14 / 100)}
                            Icon={'phone'}
                        /> */}
                        <PhoneNumberInput
                            onChangeFormattedText={(text) => {
                                setPhone(text);
                                setPhoneError(false);
                            }}
                            setPhoneCCode={()=>{
                                setPhoneCCode,
                                setPhoneError(false);
                            }}
                            Code={phoneCode}
                            phoneCCode={phoneCCode}
                            Width={90}
                            value={phone}
                            Error={phoneError}
                            ErrorText={phoneErrorMessage}
                            Height={windowWidth * (14 / 100)}
                        />
        
                        
                        <AuthButton
                            ButtonText={'Update'}
                            ButtonWidth={90}
                            OnPress={handleValidation}
                        />
                    </View>
                )
            }
        </SafeAreaView>
    )
}
export default EditProfile
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.backgroundColor,
        alignItems: 'center'
        // padding: windowWidth * (5 / 100
    },
    fontText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: getFontontSize(18),
        color: colours.primaryBlack,
        marginBottom: 50
    },
})