

import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, FlatList, TextInput } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import colours from '../globals/colours';
import { getFontontSize, getImage } from '../globals/functions';
import { showIcon } from '../globals/icons';
import AuthButton from './AuthButton';
import { LoaderContext } from '../Context/loaderContext';
import Modal from "react-native-modal";
import moment from 'moment';
import CheckBox from 'react-native-check-box';
import { getclaimAmount, bidRejection, aucRazorPay, updOrders, generateOTP } from '../api';
import { AppContext } from '../Context/appContext';
import Toast from 'react-native-simple-toast';
import RazorpayCheckout from 'react-native-razorpay';
import { CommonActions } from '@react-navigation/native';
import TextInputMultiLineComponent from './TextInputMultiLineComponent';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const WinCard = ({
    navigation,
    brandName,
    bidAmount,
    tokenAmount,
    balanceAmount,
    date,
    paymentStatus,
    id,
    salesStatus,
    onpress,
    otpStatus,
    aucWonOtp,
    onReload,
}) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [claimStatus, setClaimStatus] = useState(false);
    const [claimStatusValue, setClaimStatusValue] = useState(0);
    const [claimAmount, setClaimAmount] = useState([]);
    const [payAmount, setPayAmount] = useState('');
    const [isModalReject, setModalReject] = useState(false);
    const [reason, setReason] = useState('');
    const { profile } = useContext(AppContext);
    const [dummy, setDummy] = useState(false);
    const [razorpayRes, setRazorpayRes] = useState('');
    const { showLoader } = useContext(LoaderContext);


    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [selectedId, setSelectedId] = useState('');

    const toggleItem = (phHistoryId, itemAmount, itemPackId) => {
        if (selectedItems && selectedItems.length > 0 && selectedItems.includes(phHistoryId)) {
            setSelectedItems(selectedItems.filter(id => id !== phHistoryId)); // Unselect
            setSelectedAmount(selectedAmount - itemAmount);
            if (selectedItems.filter(id => id !== phHistoryId).length == 0) {
                setClaimStatus(false);
            }
            setDummy(!dummy);
        } else {
            setSelectedItems([...selectedItems, phHistoryId]); // Select
            setSelectedId(phHistoryId)
            setSelectedAmount(selectedAmount + itemAmount);
            setClaimStatus(true);
            setDummy(!dummy);
        }
    };

    const clearSelection = () => {
        setSelectedItems([]);
        setSelectedAmount(0);
        setSelectedId('');
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const rejectToggle = () => {
        setModalReject(!isModalReject)
    };


    useEffect(() => {
        fetchclaimAmount();
    }, [])

    const fetchclaimAmount = async () => {
        showLoader(true);
        try {
            let res = await getclaimAmount();
            setClaimAmount(res)
        } catch (e) {
        }
        showLoader(false);
    }

    const handleRejection = async () => {
        showLoader(true);
        try {
            if (reason != '') {

                let res = await bidRejection({
                    sp: "updCustomerSaleStatus",
                    saleStatus: "Rejected",
                    rejectReason: reason,
                    custId: profile[0]?.customerId,
                    aucId: id
                })
                showLoader(false);
                setModalReject(false);
                Toast.show('Rejection request submitted successfully');
                onReload()
            } else {
                Toast.show('Please enter reason');
            }
        } catch (e) {
        }
        showLoader(false);
        onReload()
    }

    const getRazorpayInfo = async () => {
        let data1 = '';
        for (let i = 0; i < selectedItems.length; i++) {
            data1 = data1 + `${selectedItems[i]},`
        }
        try {
            showLoader(true)
            let res = await aucRazorPay({
                sp: "aucRazorPay",
                custId: profile[0].customerId,
                aucId: id,
                claimStatus: claimStatus,
                packIds: data1
            })
            setRazorpayRes(res[0])
            
            showLoader(false)
            if (res != '') {
                var options = {
                    currency: 'INR',
                    key: 'rzp_test_cWQhGghXCxe6cO', // Your api key
                    name: 'Ibidz',
                    order_id: res[0]?.rp_token,
                    amount: res[0]?.amount,
                    prefill: {
                        email: res[0]?.cust_email,
                        contact: res[0]?.cust_phone,
                        name: res[0]?.cust_name
                    },
                    theme: { color: colours.primaryBlue }
                }
                RazorpayCheckout.open(options).then(async (data) => {
                    try {
                        showLoader(true);
                        let res1 = await updOrders({
                            sp: "updOrders",
                            razorpaySignature: data?.razorpay_signature,
                            razorpayIaymentId: data?.razorpay_payment_id,
                            razorpayOrderId: data?.razorpay_order_id,
                            orderStatus: 1,
                            claimStatus: claimStatus ? 1 : 0,
                            packageListIds: data1
                        })
                        if (res1.Message = 'Success') {
                            setModalVisible(false);
                            onReload()
                            Toast.show( claimStatus? "Successfully Redeemed" : "Successfully Paid")
                        }
                        showLoader(false);
                    } catch (e) {
                        setModalVisible(false);
                        onReload()
                        showLoader(false)
                    }

                }).catch((error) => {
                    setModalVisible(false);
                    onReload()
                    showLoader(false)
                });

            }
        } catch (error) {
            showLoader(false)
        }
    }

    const getGenerateOTP = async () => {
        try {
            showLoader(true);
            let res1 = await generateOTP({
                sp: "generateWonOtp",
                custId: profile[0].customerId,
                aucId: id
            })
            showLoader(false)
            Toast.show('OTP sent successfully')
            onReload()
        } catch (e) {
            showLoader(false)
            onReload()
        }
    }

    return (
        <View style={{ width: windowWidth, paddingHorizontal: 20, alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity style={styles.container}>
                <View style={styles.verificationBox}>
                    {
                        paymentStatus == true  && salesStatus !== 'Rejected' ?
                        < TouchableOpacity style={[styles.innerverification, { backgroundColor: colours.primaryGreen }]} >
                            <Text style={[styles.fontText5]}>PAID</Text>
                        </TouchableOpacity>
                        :
                        null
                    }
                    {
                        aucWonOtp == null && otpStatus == null && salesStatus == null && paymentStatus == null ?
                            <View style={[styles.innerverification, { backgroundColor: colours.primaryRed }]}>
                                <Text style={styles.fontText5}>Not Verified</Text>
                            </View>
                            :
                            aucWonOtp != '' && otpStatus == true && salesStatus == 'SaleConfirm' && paymentStatus == true ?
                                < View style={[styles.innerverification, { backgroundColor: colours.primaryGreen }]}>
                                    <Text style={styles.fontText5}> Verified</Text>
                                </View>
                                :
                                aucWonOtp != null && otpStatus == null && salesStatus == null && paymentStatus == true ?
                                    < View style={[styles.innerverification, { backgroundColor: colours.lightGreen }]}>
                                        <Text style={styles.fontText5}>OTP :{aucWonOtp}</Text>
                                    </View>
                                    :
                                    salesStatus == 'Rejected' && paymentStatus == true ?
                                        < View style={[styles.innerverification, { backgroundColor: colours.lightRed }]}>
                                            <Text style={[styles.fontText5]}>Rejected</Text>
                                        </View>
                                        :
                                            null
                    }
                </View>

                <View style={styles.innerContainer1}>


                    <View style={{ width: windowWidth * (45 / 100) }}>
                        <Text style={styles.fontText3}>Auction Name</Text>
                        <Text onPress={onpress} numberOfLines={2} style={[styles.fontText1, { color: salesStatus != 'Rejected' ? colours.secondaryBlue : colours.primaryBlack }]}>{brandName}</Text>
                        <Text style={styles.fontText3}>Auction Status</Text>
                        <Text style={styles.fontText2}>{salesStatus ? salesStatus : '---'}</Text>
                        <Text style={styles.fontText3}>Balance Status</Text>
                        {
                            salesStatus == "SaleConfirm" ?
                                <Text style={[styles.fontText2]}>Paid</Text>
                                :
                                <Text style={[styles.fontText2, { color: colours.primaryRed }]}>Pending</Text>
                        }

                    </View>

                    <View style={styles.amountBox}>
                        <Text style={styles.fontText3}>Win Amount</Text>
                        <Text style={styles.fontText2}>₹{bidAmount}</Text>
                        <Text style={styles.fontText3}>Token Amount</Text>
                        <Text style={styles.fontText2}>₹{tokenAmount}</Text>
                        <Text style={styles.fontText3}>Balance Amount</Text>
                        <Text style={styles.fontText2}>₹{balanceAmount}</Text>
                    </View>
                </View>

                <View style={styles.innerContainer2}>

                    {
                        otpStatus == null && salesStatus == 'Rejected' && paymentStatus == true ?

                            <AuthButton
                                ButtonHeight={5}
                                ButtonWidth={85}
                                ButtonText={'Rejected'}
                                BackgroundColor={colours.primaryRed}
                                FirstColor={colours.primaryRed}
                                SecondColor={colours.primaryRed}
                                disabled={true}

                            />
                            :

                            null
                    }
                    {
                        aucWonOtp != '' && otpStatus && salesStatus == null && paymentStatus == true ?
                            <AuthButton
                                ButtonHeight={5}
                                ButtonWidth={85}
                                ButtonText={'Reject'}
                                BackgroundColor={colours.primaryRed}
                                FirstColor={colours.primaryRed}
                                SecondColor={colours.primaryRed}
                                OnPress={() => rejectToggle()}
                                disabled={false}

                            />
                            :
                            ''
                    }
                    {
                        aucWonOtp != '' && otpStatus == true && salesStatus == 'SaleConfirm' && paymentStatus == true ?
                            <AuthButton
                                ButtonHeight={5}
                                ButtonWidth={85}
                                ButtonText={'Completed'}
                                disabled={true}
                                BackgroundColor={colours.primaryGreen}
                                FirstColor={colours.primaryGreen}
                                SecondColor={colours.primaryGreen}
                            />

                            :
                            null
                    }
                    {
                        aucWonOtp == null && otpStatus == null && salesStatus == null && paymentStatus == null ?
                            <AuthButton
                                ButtonHeight={5}
                                ButtonWidth={85}
                                ButtonText={'Pay Token'}
                                OnPress={() => { toggleModal() }}
                            />
                            : ''
                    }
                    {
                        salesStatus == null && paymentStatus == true && aucWonOtp == null && otpStatus == null ?
                        <AuthButton
                            ButtonHeight={5}
                            ButtonWidth={85}
                            ButtonText={'Generate OTP'}
                            OnPress={() => { getGenerateOTP() }}
                            SecondColor={colours.primaryGreen}
                        />
                        // < TouchableOpacity style={[styles.innerverification, { backgroundColor: colours.primaryGreen }]} onPress={() => getGenerateOTP()} >
                        //     <Text style={[styles.fontText5]}>Generate OTP</Text>
                        // </TouchableOpacity>
                        :
                        null
                    }

                </View>
                <Modal
                    isVisible={isModalVisible} >
                    <View style={styles.modalView}>

                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} >
                                <View style={{
                                    width: windowWidth * (5 / 100),
                                    height: windowWidth * (5 / 100),
                                    right: windowWidth * (4 / 100),
                                    top: 10
                                }}>{showIcon('close', colours.lightRed, windowWidth * (6 / 100))}</View>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.fontText2}>
                            Redeem Package
                        </Text>

                        <View style={{ width: windowWidth * (90 / 100), padding: 10, alignItems: 'flex-end' }}>
                            <Text style={{
                                fontFamily: 'Poppins-SemiBold',
                                fontSize: getFontontSize(16),
                                color: colours.primaryBlack
                            }}>Token Amount :₹{tokenAmount}</Text>
                        </View>

                        {
                            claimAmount != '' ?
                                <>
                                    <View style={styles.boxHeadings}>

                                        <Text numberOfLines={2} style={[styles.fontText10, { fontFamily: 'Poppins-SemiBold', color: colours.primaryWhite }]}>Pack Name</Text>
                                        <Text numberOfLines={2} style={[styles.fontText10, { fontFamily: 'Poppins-SemiBold', color: colours.primaryWhite }]}>Pack Amount</Text>
                                        <Text numberOfLines={2} style={[styles.fontText10, { fontFamily: 'Poppins-SemiBold', color: colours.primaryWhite }]}>Pack Date</Text>

                                    </View>
                                    <FlatList
                                        style={{ width: windowWidth * (80 / 100), paddingBottom: windowHeight * (2 / 100) }}
                                        data={claimAmount}
                                        keyExtractor={item => item.id}
                                        renderItem={({ item }) => (
                                            <View style={[styles.subboxText, {backgroundColor: item.isActive == 1 ? colours.lowGreen : colours.primaryWhite }]}>
                                                <Text numberOfLines={1} style={styles.fontText10}>{item?.packName}</Text>
                                                <Text numberOfLines={1} style={styles.fontText10}>₹{item?.packAmount}</Text>
                                                <View>
                                                    <Text numberOfLines={2} style={styles.fontText10}>{moment(item?.packDate).format('DD-MMM-YYYY')}</Text>
                                                    <Text numberOfLines={2} style={styles.fontText10}>{moment(item?.packDate).format('hh:mm a')}</Text>
                                                </View>

                                                <View style={{ marginBottom: windowHeight * (1 / 100) }}>
                                                    <CheckBox
                                                        style={{ flex: 1, padding: 10, }}

                                                        isChecked={selectedItems.includes(item.phHistoryId)}
                                                        onClick={() => toggleItem(item?.phHistoryId, item?.packAmount, item?.packId)}

                                                    />
                                                </View>
                                            </View>
                                        )}
                                    />
                                </>
                                :
                                <Text>No claim Amount is available</Text>
                        }
                        {
                            claimStatus ?
                                <>
                                    <View style={{ marginTop: windowWidth * (2 / 100) }}>
                                        {
                                            selectedAmount >= tokenAmount ?
                                                <Text style={[styles.fontText4, { color: colours.primaryRed }]}>Claim amount cannot exceed token amount ₹{tokenAmount}</Text>
                                                :

                                                <Text style={styles.fontText4}>Amount ₹{selectedAmount} will reduced from token amount. Amount to pay ₹{tokenAmount - selectedAmount} </Text>
                                        }


                                    </View>
                                </>
                                : ''
                        }
                        <View style={styles.bottomContainer}>

                            <AuthButton
                                OnPress={() => {
                                    setClaimStatus(false);
                                    clearSelection()
                                }}
                                ButtonText={'Clear'}
                                ButtonWidth={40}
                            />
                            <AuthButton
                                OnPress={() => getRazorpayInfo()}
                                ButtonText={'Confirm'}
                                ButtonWidth={40}
                                FirstColor={colours.primaryGreen}
                                SecondColor={colours.primaryGreen}
                                disabled={selectedAmount >= tokenAmount?true:false}
                            />

                        </View>

                    </View>
                </Modal>


                <Modal
                    isVisible={isModalReject} >
                    <View style={styles.modalView}>

                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={() => setModalReject(false)} >
                                <View style={{
                                    width: windowWidth * (5 / 100),
                                    height: windowWidth * (5 / 100),
                                    right: windowWidth * (2 / 100)
                                }}>{showIcon('close', colours.lightRed, windowWidth * (6 / 100))}</View>
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.fontText2, { color: colours.primaryRed }]}>
                            ! Warning
                        </Text>

                        <Text style={[styles.fontText2, { fontSize: getFontontSize(16) }]}>
                            Reason for Rejection
                        </Text>
                        <TextInputMultiLineComponent
                            OnChangeText={(text) => {
                                setReason(text);
                            }}
                            Width={80}
                            Placeholder={'Enter Reason '}
                            value={reason}
                        />


                        <View style={{ alignItems: 'flex-end', width: windowWidth * (80 / 100) }}>
                            <AuthButton
                                ButtonText={'Confirm'}
                                ButtonWidth={30}
                                ButtonHeight={6}
                                backgroundColor={colours.primaryRed}
                                FirstColor={colours.primaryRed}
                                SecondColor={colours.primaryRed}
                                OnPress={() => handleRejection()}
                            />
                        </View>
                    </View>
                </Modal>

            </TouchableOpacity>
        </View >

    )
}

export default WinCard

const styles = StyleSheet.create({
    container: {
        width: windowWidth * (90 / 100),
        height: windowHeight * (28 / 100),
        borderRadius: 20,
        backgroundColor: colours.primaryWhite,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.16,
        shadowRadius: 6.68,
        shadowColor: colours.primaryBlack,
        elevation: 7,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    innerContainer1: {
        width: windowWidth * (85 / 100),
        height: windowHeight * (15 / 100),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
    },
    innerContainer2: {
        width: windowWidth * (85 / 100),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: windowHeight * (2 / 100),

    },
    fontText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: getFontontSize(16),
        color: colours.primaryBlack,
        width: windowWidth * (45 / 100)
    },
    amountBox: {
        width: windowWidth * (35 / 100),
    },

    fontText2: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(14),
        color: colours.primaryBlack
    },
    fontText3: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(12),
        color: colours.lightGrey
    },

    modalView: {
        width: windowWidth * (90 / 100),
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
    boxHeadings: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colours.primaryColor,
        width: windowWidth * (80 / 100),
        height: windowHeight * (6 / 100),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 5,
        paddingRight: windowWidth * (20 / 100),
        marginTop: windowHeight * (2 / 100),
    },
    fontText10: {
        fontFamily: 'Poppins-Regular',
        fontSize: getFontontSize(12),
        color: colours.primaryBlack,
        paddingRight: windowWidth * (1 / 100),
        width: windowWidth * (23 / 100),
        textAlign: 'center'
    },
    subboxText: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: colours.primaryWhite,
        width: windowWidth * (80 / 100),
        // height: windowHeight * (6 / 100),
        borderColor: colours.lightGrey,
        borderWidth: 0.6,
    },
    fontText4: {
        fontFamily: 'Poppins-Regular',
        fontSize: getFontontSize(14),
        color: colours.primaryBlack,
        width: windowWidth * (70 / 100)
    },
    bottomContainer: {
        width: windowWidth * (90 / 100),
        padding: 10,
        marginTop: 15,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
    },
    reasonInput: {
        width: windowWidth * (80 / 100),
        height: windowHeight * (10 / 100),
        borderWidth: 0.8,
        borderRadius: 3,
        textAlignVertical: 'top',
        padding: 5,
        borderColor: colours.lightGrey,
        marginTop: windowHeight * (2 / 100)
    },
    verificationBox: {
        height: windowHeight * (3 / 100),
        width: windowWidth * (90 / 100),
        flexDirection:'row',
        justifyContent:'flex-end'
    },
    innerverification: {
        height: windowHeight * (3 / 100),
        width: windowWidth * (40 / 100),
        alignItems: 'center',
        top: -10,
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 20
    },
    fontText5: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(16),
        color: colours.primaryWhite
    },
})