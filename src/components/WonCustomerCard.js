import React, { useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import { showIcon, showImage } from '../globals/icons';
import AuthButton from './AuthButton';
import LoginTextInput from './LoginTextInput';
import SelectDropdown from 'react-native-select-dropdown'
import { LoaderContext } from '../Context/loaderContext';
import { salesConfirm, vendorOtpVerification } from '../api';
import { AppContext } from '../Context/appContext';
import Toast from 'react-native-simple-toast';
import { formatCurrency } from "react-native-format-currency";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const WonCustomerCard = ({ navigation,
    brandname,
    bidAmount,
    method,
    custname,
    balanceAmount,
    otpStatus,
    salesStatus,
    id,
    onVerify
}) => {

    const [Otp, setOtp] = useState('');
    const [OtpError, setOtpError] = useState(false);
    const [OtpErrorMessage, setOtpErrorMessage] = useState('');
    const items = ["Cash/Online", "Finance"];
    const { showLoader } = React.useContext(LoaderContext);
    const { profile } = useContext(AppContext);
    const [paymentMethod, setPaymentMethod] = useState();

    const VerifyOtp = async () => {
        if (Otp != '') {
            try{
                showLoader(true);
                let res = await vendorOtpVerification({
                    sp: "vrifyCustomer",
                    aucId: id,
                    sellerId: profile[0]?.sellerId,
                    otp: Otp
                })

                showLoader(false)
                onVerify()

            } catch(err){
                showLoader(false)
                Toast.show(err?.Message?err?.Message:'Invalid OTP / Something went wrong')
            }
        } else {
            setOtpErrorMessage('*Required');
            setOtpError(true)
            showLoader(false)
        }
    }


    const Confirm = async () => {
        try {
            showLoader(true);
            if (paymentMethod != '') {
                let res = await salesConfirm({
                    sp: "updVendorSaleStatus",
                    saleStatus: "SaleConfirm",
                    aucId: id,
                    sellerId: profile[0]?.sellerId,
                    paymentMode: paymentMethod
                })
                showLoader(false);
                onVerify()
            } else {
                Toast.show('Select payment method');
                showLoader(false)
            }

        } catch (e) {
            showLoader(false)
        }
    }

    return (
        <View style={{ width: windowWidth, alignItems: 'center'}}>

            <View style={styles.containers}>

                <View style={styles.firstBox}>
                    <View style={styles.brandBox}>
                        <Text style={styles.fontText2} >Auction Name</Text>
                        <Text style={styles.fontText1}>{brandname}</Text>
                    </View>
                    <View style={[styles.brandBox, , { marginLeft: windowWidth * (1 / 100) }]}>
                        <Text style={styles.fontText2} >Customer</Text>
                        <Text style={styles.fontText1}>{custname}</Text>
                    </View>

                </View>


                <View style={styles.box1}>
                    <View style={[styles.box3, { marginTop: 10 }]}>
                        <Text style={[styles.fontText2]}>Bid Amount</Text>
                        <Text style={styles.fontText2}>Balance Amount</Text>
                        <Text style={[styles.fontText2, { width: windowWidth * (25 / 100) }]}>Payment Method</Text>
                    </View>
                    <View style={styles.box3}>
                        <Text style={[styles.fontText1]} >{formatCurrency({ amount: bidAmount ? bidAmount : 0, code: "INR" })[0]}</Text>
                        {
                            method != '' && salesStatus == 'SaleConfirm' && otpStatus == true ?
                                <TouchableOpacity style={styles.touchable1} disabled={true}>
                                    <View style={{ width: windowWidth * (6 / 100), height: windowWidth * (6 / 100) }}>{showImage('tick', 6)}</View>
                                    <Text style={[styles.fontText1, { color: colours.primaryWhite }]}>Paid</Text>
                                </TouchableOpacity>
                                :
                                <Text style={[styles.fontText1]} >{formatCurrency({ amount: balanceAmount ? balanceAmount : 0, code: "INR" })[0]}</Text>
                        }

                        {
                            otpStatus == true && method == null && salesStatus == null ?

                                <SelectDropdown
                                    data={items}
                                    onSelect={(selectedItem, index) => {
                                        console.log('data selected', selectedItem, index)
                                    }}
                                    buttonStyle={{
                                        flexDirection: 'row',
                                        backgroundColor: colours.lowBlue,
                                        width: windowWidth * (25 / 100),
                                        height: windowHeight * (3 / 100),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 20,
                                        marginLeft: 5,
                                        borderColor: colours.primaryBlue,
                                        borderWidth: 1

                                    }}
                                    buttonTextStyle={{
                                        fontSize: getFontontSize(12),
                                        color: colours.primaryBlack,
                                        fontFamily: 'Poppins-Regular',
                                    }}
                                    selectedRowStyle={{ backgroundColor: colours.primaryWhite }}
                                    dropdownIconPosition='right'
                                    renderDropdownIcon={() => <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                        <Text>{showIcon('down', colours.primaryBlack, 14)}</Text>
                                    </View>
                                    }
                                    dropdownStyle={{
                                        width: windowWidth * (25 / 100),
                                        height: windowHeight * (12 / 100),
                                        borderRadius: 10,
                                        elevation: 4,
                                        marginRight: windowWidth * (5 / 100)
                                    }}
                                    rowTextStyle={styles.text1}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        setPaymentMethod(selectedItem)
                                        // text represented after item is selected
                                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                                        return selectedItem
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        // text represented for each item in dropdown
                                        // if data array is an array of objects then return item.property to represent item in dropdown
                                        return item
                                    }}
                                />
                                :
                                <Text style={[styles.fontText1, { width: windowWidth * (25 / 100) }]} >{method}</Text>

                        }
                    </View>
                </View>

                <View style={styles.box2}>
                    {
                        method != '' && salesStatus == 'SaleConfirm' && otpStatus == true ?
                            <TouchableOpacity style={styles.touchable2} disabled={true}>
                                <View style={{ width: windowWidth * (6 / 100), height: windowWidth * (6 / 100) }}>{showImage('tick', 6)}</View>
                                <Text style={[styles.fontText1, { color: colours.primaryWhite }]}>Sold</Text>
                            </TouchableOpacity>
                            :
                            salesStatus == 'Rejected' && method == null ?
                                <TouchableOpacity disabled={true} style={[styles.touchable2, { backgroundColor: colours.primaryRed }]}>
                                    <Text style={[styles.fontText1, { color: colours.primaryWhite }]}>Rejected</Text>
                                </TouchableOpacity>
                                :
                                method == null && salesStatus == null && otpStatus == null ?
                                    <View style={[styles.box4,]}>
                                        <LoginTextInput
                                            OnChangeText={(text) => {
                                                setOtp(text);
                                                setOtpError(false);
                                            }}
                                            Width={60}
                                            Placeholder={'OTP'}
                                            value={Otp}
                                            Error={OtpError}
                                            ErrorText={OtpErrorMessage}
                                            Height={windowWidth * (15 / 100)}
                                            secureEntry
                                            Icon={'lock'}
                                        />
                                        <AuthButton
                                            OnPress={() => VerifyOtp()}
                                            ButtonText={'Verify'}
                                            ButtonWidth={20}
                                            ButtonHeight={5}
                                            FirstColor={colours.primaryOrange}
                                            SecondColor={colours.primaryOrange}
                                        />
                                    </View>
                                    :
                                    otpStatus == true && method == null && salesStatus == null ?
                                        <TouchableOpacity style={styles.touchable2} onPress={() => Confirm()}>
                                            <View style={{ width: windowWidth * (6 / 100), height: windowWidth * (6 / 100) }}>{showImage('tick', 6)}</View>
                                            <Text style={[styles.fontText1, { color: colours.primaryWhite }]}>Confirm Sale</Text>
                                        </TouchableOpacity>
                                        :
                                        null
                    }
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containers: {
        width: windowWidth * (90 / 100),
        padding: windowHeight * (1 / 100),
        backgroundColor: colours.primaryWhite,
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.16,
        shadowRadius: 6.68,
        shadowColor: colours.primaryBlack,
        elevation: 7,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    firstBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    brandBox: {
        width: windowWidth * (43 / 100),
    },
    fontText1: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(16),
        color: colours.primaryBlack,
    },
    fontText2: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(13),
        color: colours.textGray,
    },
    text1: {
        fontSize: getFontontSize(12),
        color: colours.primaryBlack,
        fontFamily: 'Poppins-Medium',

    },
    box1: {
        width: windowWidth * (90 / 100),
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomColor: colours.lowGrey,
        borderBottomWidth: 0.6,
    },
    box2: {
        width: windowWidth * (90 / 100),
        alignItems: 'center',
        justifyContent: 'center',

    },
    touchable1: {
        height: windowHeight * (3 / 100),
        width: windowWidth * (25 / 100),
        backgroundColor: colours.primaryGreen,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row"
    },
    touchable2: {
        height: windowHeight * (6 / 100),
        width: windowWidth * (85 / 100),
        backgroundColor: colours.primaryGreen,
        borderRadius: 10,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row"
    },
    box3: {
        width: windowWidth * (90 / 100),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: windowWidth * (2 / 100),

    },
    box4: {
        width: windowWidth * (90 / 100),
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: windowWidth * (2 / 100),
        bottom: -5

    },
});

export default WonCustomerCard;