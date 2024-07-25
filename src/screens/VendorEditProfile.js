import React, { useContext, useEffect, useState } from "react";
import { Text, View, SafeAreaView, StyleSheet, Dimensions, Alert } from 'react-native';
import AuthButton from "../components/AuthButton";
import Header from "../components/Header";
import LoginTextInput from "../components/LoginTextInput";
import { AppContext } from "../Context/appContext";
import { LoaderContext } from "../Context/loaderContext";
import { getFontontSize } from "../globals/functions";
import colours from "../globals/colours";
import { getVendorProfile, VendorUpdateProfile, } from "../api";
import Toast from 'react-native-simple-toast';
import PhoneNumberInput from "../components/PhoneNumberInput";
import commonConst from '../globals/commonConstants';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VendorEditProfile = ({ navigation }) => {

    const { showLoader, loading } = React.useContext(LoaderContext);
    const { editProfile, profile } = useContext(AppContext);

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('')
    const [address, setAddress] = React.useState('');

    const [nameError, setNameError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [phoneError, setPhoneError] = React.useState(false);
    const [addressError, setAddressError] = React.useState(false);

    const [nameErrorsMessage, setNameErrorMessage] = React.useState('');
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [phoneErrorMessage, setPhoneErrorMessage] = React.useState('');
    const [addressErrorMessage, setAddressErrorMessage] = React.useState('');
    const [phoneCCode, setPhoneCCode] = React.useState({CountryCode : '91'});
    const [phoneCode, setPhoneCode] = useState('IN');
    const [dummy, setDummy] = useState(false)


    const [profiledata, setProfileData] = useState('');


    useEffect(() => {
        getProfile()
    }, [])

    const getProfile = async () => {
        showLoader(true)
        let res = await getVendorProfile()
        setProfileData(res);
        setName(res[0]?.sellerName);
        setEmail(res[0]?.sellerEmail);
        setPhone(res[0]?.sellerPhone? res[0]?.sellerPhone.split('-')[1] : '');
        if(res[0]?.sellerPhone){
            getCode(res[0]?.sellerPhone.split('-')[0])
        }
        setAddress(res[0]?.address);
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
        const AddressError=address==='';
        if (!(EmailError || PhoneError || NameError ||AddressError)) {
            if (profiledata[0]?.sellerEmail !== email ||
                profiledata[0]?.sellerPhone !== phone ||
                profiledata[0]?.sellerName !== name ||
                profiledata[0]?.address !== address ) {
                updateProfileData();
            } else {
                Toast.show('Details Are Not Changed');
            }
        } else {
            setEmailError(EmailError);
            setNameError(NameError);
            setEmailErrorMessage('Required');
            setNameErrorMessage('Required');
            setAddressError(AddressError);
            setAddressErrorMessage('Required')
            setPhoneErrorMessage('Required');
            setPhoneError(PhoneError)
        }


    }

    const updateProfileData = async () => {
        try {
            showLoader(true);
            let res = await VendorUpdateProfile({
                sp: "updSellerProfile",
                fullName: name,
                email: email,
                phone: phone.includes(`+${phoneCCode.CountryCode}`)?  phone.split(`+${phoneCCode.CountryCode}`).join(`+${phoneCCode.CountryCode}-`): `+${phoneCCode.CountryCode}-${phone}`,
                address:address,
                sellerId: profile[0].sellerId ? profile[0].sellerId : ""
            });
            Toast.show('Profile Updated Successfull');
            showLoader(false);
            navigation.navigate('VendorProfile')
        } catch (err) {
            showLoader(false);
            Toast.show(err?.Message?err?.Message:'Something went wrong');
        }
    };


    return (

        <SafeAreaView style={styles.container}>
            <Header title={'Update Profile'} navigation={navigation} backarrow />
            {
                !loading &&(
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
                            Placeholder={'Enter Full Name'}
                            value={name}
                            Error={nameError}
                            ErrorText={nameErrorsMessage}
                            Height={windowWidth * (14 / 100)}
                            Icon={'uname'}
                        />
                        <LoginTextInput
                            OnChangeText={handlemail}
                            Width={90}
                            Placeholder={'Enter Email ID'}
                            value={email}
                            Error={emailError}
                            ErrorText={emailErrorMessage}
                            Height={windowWidth * (14 / 100)}
                            Icon={'mail'}
                        />
                        {/* <LoginTextInput
                            OnChangeText={handlePhone}
                            Width={90}
                            Placeholder={'Enter Phone No'}
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
        
        
                        <LoginTextInput
                            OnChangeText={(text) => {
                                setAddress(text);
                                setAddressError(false);
                            }} 
                            Width={90}
                            Placeholder={'Enter Address'}
                            value={address}
                            Error={addressError}
                            ErrorText={addressErrorMessage}
                            Height={windowWidth * (14 / 100)}
                            Icon={'location'}
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
export default VendorEditProfile
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