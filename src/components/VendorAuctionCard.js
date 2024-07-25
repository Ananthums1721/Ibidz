import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import colours from '../globals/colours';
import { getFontontSize, getImage } from '../globals/functions';
import { showIcon } from '../globals/icons';
import TimerCard from './TimerCard';
import moment from 'moment';
import AuthButton from './AuthButton';
import Modal from "react-native-modal";
import Toast from 'react-native-simple-toast';
import { getBidNow, getItemDetails } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';
import { formatCurrency } from "react-native-format-currency";
import { MaskedText } from "react-native-mask-text";
import FastImage from 'react-native-fast-image';
import CurrencyInput from 'react-native-currency-input';
import LottieView from "lottie-react-native";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VendorAuctionCard = ({
    navigation,
    brandName,
    modelName,
    bidAmounts,
    location,
    time,
    kmClocked,
    date,
    bidCount,
    registerNumber,
    IncAmount,
    image,
    onpress,
    highBid,
    auctionName,
    onRefresh,
    Data,
    FromVendor,
    YourLastBid

}) => {
    const [givenDate, setGivenDate] = useState(new Date(time)); // Given date and time
    const [isExpired, setIsExpired] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [vehicleData, setVehicleData] = useState('');
    const [bidAmount, setBidAmount] = useState(JSON.stringify(IncAmount));
    const [itemDetails, setItemDetails] = useState('');
    const { showLoader } = useContext(LoaderContext);
    const [vehRegister, setvehRegister] = useState(0)
    const { profile } = useContext(AppContext);
    const [ bidSuccessModal, setBidSuccessModal ] = React.useState(false)


    useEffect(() => {
        const currentDate = new Date(); // Current date and time
        setIsExpired(currentDate > givenDate);
        // getDetails();
    }, []);


    const getDetails = async () => {
        // showLoader(true)
        let res = await getItemDetails(auctionName)
        setItemDetails(res)
        let regNo = res[0]?.vehRegNo.split(' ');
        if (regNo.length === 3) {
            regNo[2] = '****'
            const regNumber = regNo.join('');
            setvehRegister(regNumber);
        }
        let stringifiedAmt = String(res[0]?.aucMinBid)
        setBidAmount(stringifiedAmt)
        let data = JSON.parse(res[0]?.vehicleImageList)
        setVehicleData(Object.values(data[0]))
        // showLoader(false)
    }


    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const getbidNow = async () => {

        let bidAmt = parseInt(bidAmount);
        let aucMin = parseInt(Data.aucMinBid);
        let aucMax = parseInt(Data.aucMaxBid)
        if (bidAmt > aucMax) {
            Toast.show(`Bid amount should be less than or equal to maximum bid amount ${aucMax}`,)
        } else if (bidAmt < aucMin) {
            Toast.show(`Bid amount should be greater than or equal to minimum bid amount ${aucMin}`)
        }
        else {
            let sumOfBidAmount = parseInt(Data.latestBidAmount) + bidAmt
            try {
                showLoader(true)
                if (bidAmt != '') {
                    let res = await getBidNow({
                        sp: "spBid",
                        custId: profile[0]?.customerId,
                        aucId: Data.aucId,
                        bidAmount: sumOfBidAmount,
                        userId: 0
                    })
                    showLoader(false);
                    // Toast.show('Successfully added bid');
                    // setModalVisible(false);
                    setBidSuccessModal(true);
                    onRefresh();
                    setTimeout(funCloseModal, 3000);
                }
            } catch (error) {
                showLoader(false)
                if (error.Message == 'Someone else might have placed a bid, Please refresh the page') {
                    Toast.show(error.Message);
                    onRefresh()
                } else {
                    Toast.show(error.Message);
                    navigation.navigate('Packages')
                }
            }

        }
    }
    
    const funCloseModal = async() => {
      setModalVisible(false);
      setBidSuccessModal(false);
    }


    return (
        <>
            <TouchableOpacity onPress={onpress} style={styles.outerCon}>
                <View style={styles.container} >
                    <View style={styles.carRow} >
                        {image ?
                            // <Image style={styles.carContainer}
                            //     resizeMode='contain'
                            //     source={{ uri: getImage(image) }} />
                            
                            <FastImage
                                style={styles.carContainer}
                                source={{
                                    uri: getImage(image),
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                            :
                            <Image style={styles.carContainer}
                                resizeMode='contain'
                                source={require('../asset/images/noimg.png')} />
                        }
                        <View style={styles.carLabelContainer} >
                            <Text style={styles.fontText1}>{brandName} {modelName}</Text>
                            {
                                highBid&&(
                                    <View style={{ flexDirection: 'row', }}>
                                        <View style={{ width: windowWidth * (4 / 100), height: windowWidth * (4 / 100) }}>{showIcon('bid', colours.primaryGreen, 16)}</View>
                                        <Text style={[styles.fontText2, { marginLeft: windowWidth * (2 / 100) }]}>Top Bid by : {highBid}</Text>
                                    </View>
                                    // <Text style={[styles.fontText2, { color: colours.primaryBlue, paddingVertical:5}]}>Top Bid by : {highBid}</Text>
                                )
                            }
                            <View>
                                <View style={{ flexDirection: 'row', marginTop:5 }}>
                                    <View style={{ width: windowWidth * (4 / 100), height: windowWidth * (4 / 100) }}>{showIcon('speedometer', colours.primaryBlack, 16)}</View>
                                    <Text style={[styles.fontText2, { marginLeft: windowWidth * (2 / 100) }]}>{kmClocked} KM</Text>
                                </View>


                                <View style={{ flexDirection: 'row', marginTop:5 }}>
                                    <View style={{ width: windowWidth * (4 / 100), height: windowWidth * (4 / 100) }}>{showIcon('location', colours.primaryBlack, 16)}</View>
                                    <Text style={[styles.fontText2, { marginLeft: windowWidth * (2 / 100) }]}>{location}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.box1}>
                        <View style={{ flexDirection: 'row', alignItems:'center' }}>
                            <View style={{ width: windowWidth * (2 / 100), height: windowWidth * (4 / 100) }}>{showIcon('calendar', colours.primaryBlack, 16)}</View>
                            <Text style={[styles.fontText2, { marginLeft: windowWidth * (1 / 100) }]}>{moment(date).format(' DD-MMM-YYYY, h:mm a')}   </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                            <View style={{ width: windowWidth * (4 / 100), height: windowWidth * (4 / 100) }}>{showIcon('timer', colours.primaryBlack, 16)}</View>
                            {
                                isExpired ?
                                    <Text style={[styles.fontText2, { marginLeft: windowWidth * (2 / 100) }]}>Auction Ended</Text>
                                    :

                                    <TimerCard
                                        DealTo={time}
                                    />
                            }
                        </View>
                    </View>
                    <View style={styles.box2} >
                        <Text style={styles.fontText2}>Inc {formatCurrency({ amount: IncAmount, code: "INR" })[0]}</Text>
                        {
                            FromVendor?
                            <Text style={styles.fontText2}>{registerNumber}</Text>
                            :
                            <MaskedText mask= {isNaN(registerNumber.charAt(2))? "AAA ******" : "AA 99****" } style={styles.fontText2}>
                                {registerNumber}
                            </MaskedText>
                            
                        }
                        <Text style={styles.fontText2}>{bidCount} Bids</Text>
                    </View>


                    <View style={{ flexDirection: "row", alignItems: "center", width: windowWidth * (90 / 100), height: windowHeight*(6/100), justifyContent: 'center' }}>
                        <View style={{ width: windowWidth * (50 / 100), alignItems: 'center', marginTop: 5 }}>
                            <Text style={styles.fontText2}>Current Bid Amount</Text>

                            {/* <Text style={styles.fontText3}>₹{bidAmounts}</Text> */}
                            {
                                bidAmounts&&(
                                    <Text style={styles.fontText3}>{formatCurrency({ amount: bidAmounts, code: "INR" })[0]}</Text>
                                )
                            }
                        </View>
                        
                        {
                            !FromVendor&&(
                                isExpired ?
    
                                    <AuthButton
                                        ButtonText={'Bid Expired'}
                                        ButtonWidth={40}
                                        ButtonHeight={5}
                                        FirstColor={colours.lightGrey}
                                        SecondColor={colours.lightGrey}
                                        disabled
                                    />
                                    :
                                    <AuthButton
                                        ButtonText={'Bid Now'}
                                        ButtonHeight={5}
                                        ButtonWidth={40}
                                        OnPress={() => toggleModal()}
                                    />
                            )
                        }

                    </View>
                    {
                        YourLastBid&&(
                            <View style={[styles.box1,{justifyContent:'center',}]}>
                                <Text style={[styles.fontText2,{color:YourLastBid>=bidAmounts ? colours.primaryGreen : colours.primaryRed }]}>Your Last Bid Amount : {formatCurrency({ amount: YourLastBid, code: "INR" })[0]}</Text>
                            </View>
                        )
                    }

                </View>
            </TouchableOpacity>

            <Modal isVisible={isModalVisible}>
                <View style={styles.modalView}>

                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={{
                            width: windowWidth * (8 / 100),
                            height: windowWidth * (8 / 100),
                        }}>
                            <View style={{ width: windowWidth * (4 / 100), height: windowHeight * (4 / 100) }}>{showIcon('close', colours.lightRed, windowWidth * (6 / 100))}</View>
                        </TouchableOpacity>
                    </View>
                    
                    {
                        bidSuccessModal?
                        <>
                            <LottieView 
                            source={require('../asset/lottie/bid.json')} 
                            style={{
                                height: windowWidth * (30 / 100),
                                width: windowWidth * (30 / 100),
                            }} 
                            autoPlay
                            loop
                            />
                            <Text style={styles.fontStyle2}>
                            Bid Placed Successfully
                            </Text>
                        </>
                        :
                        <>
                            <Text style={styles.fontStyle2}>
                                Enter your Bid Amount
                            </Text>
                            <View style={styles.buttonContainer}>
                                {
                                    bidAmounts&&(
                                        <Text style={[styles.fontStyle6]}>{formatCurrency({ amount: bidAmounts, code: "INR" })[0]}  +</Text>
                                    )
                                }
                                    <CurrencyInput
                                        value={bidAmount}
                                        placeholder={'enter bid amount'}
                                        onChangeValue={(v) => setBidAmount(v)}
                                        prefix="₹"
                                        delimiter=","
                                        separator="."
                                        precision={0}
                                        style={styles.textImputStyle}           
                                    />
                            </View>
                            <View style={styles.buttonContainer}>
                                <AuthButton
                                    OnPress={() => setModalVisible(false)}
                                    ButtonText={"Cancel"}
                                    ButtonWidth={40}
                                />
                                <AuthButton
                                    OnPress={() => getbidNow()}
                                    ButtonText={'Submit'}
                                    ButtonWidth={40}
                                />
                            </View>
                        </>
                    }
                </View>
            </Modal>
        </>
    )
}

export default VendorAuctionCard

const styles = StyleSheet.create({
    outerCon: {
        // height: windowHeight * (28 / 100),
        width: windowWidth,
        paddingHorizontal: windowWidth * (4 / 100)
    },
    container: {
        width: windowWidth * (92 / 100),
        // height: windowHeight * (28 / 100),
        backgroundColor: colours.primaryWhite,
        borderRadius: 20,
        alignItems: "center",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.16,
        shadowRadius: 6.68,
        shadowColor: colours.primaryBlack,
        elevation: 7,
        padding: 8,
    },
    carRow: {
        width: windowWidth * (92 / 100),
        // height: windowHeight * (12 / 100),
        flexDirection: 'row'
    },
    carContainer: {
        height: windowHeight * (11 / 100),
        width: windowWidth * (35 / 100),
        backgroundColor: colours.primaryWhite,
        borderRadius: 12,
        marginRight: 5,
        marginLeft: 5
    },
    carLabelContainer: {
        // height: windowHeight * (12 / 100),
        width: windowWidth * (52 / 100),
        justifyContent: 'space-around',

    },
    textImputStyle: {
      width: windowWidth * (35 / 100),
      height: windowHeight * (6 / 100),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colours.lightWhite,
      borderRadius: 5,
      fontFamily: 'Proxima Nova Alt Bold',
      fontSize: getFontontSize(15),
      color: colours.primaryBlack,
      paddingHorizontal: 15,
    },
    fontText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: getFontontSize(18),
        color: colours.primaryBlack
    },
    fontText2: {
        fontFamily: 'Proxima Nova Alt Regular',
        fontSize: getFontontSize(14),
        color: colours.primaryGrey
    },
    fontText3: {
        fontFamily: 'Proxima Nova Alt Semibold',
        fontSize: getFontontSize(18),
        color: colours.primaryBlack,
    },

    box1: {
        width: '100%',
        height: windowHeight * (5 / 100),
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
        padding: 5,
    },
    box2: {
        width: '100%',
        marginTop: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBlockColor: '#000'
    },
    modalView: {
        width: windowWidth * (90 / 100),
        height: windowHeight * (30 / 100),
        backgroundColor: colours.primaryWhite,
        borderRadius: 10,
        padding: windowWidth * (2 / 100),
        alignItems: "center"
    },

    modalHeader: {
        // flexDirection:"row",
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: windowWidth * (90 / 100),
        height: windowHeight * (4 / 100),
        marginBottom: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: colours.lowGrey
    },
    fontStyle4: {
        fontSize: getFontontSize(16),
        color: colours.primaryGrey,
        fontFamily: 'Poppins-Medium',
    },
    fontStyle2: {
        fontSize: getFontontSize(18),
        color: colours.primaryGrey,
        fontFamily: 'Poppins-Bold',
        width: windowWidth * (80 / 100),
        textAlign: 'center'
    },
    buttonContainer: {
        marginTop: windowHeight * (2 / 100),
        flexDirection: 'row',
        width: windowWidth * (85 / 100),
        justifyContent: 'space-around',
        alignItems:'center'
    },
    fontStyle6: {
        fontSize: getFontontSize(16),
        color: colours.primaryGrey,
        fontFamily: 'Poppins-SemiBold',

    },
    bidmodal: {
        width: windowWidth * (90 / 100),
        flexDirection: 'row',
        marginTop: windowWidth * (2 / 100),
        alignItems: 'center',
        paddingHorizontal: windowWidth * (5 / 100),
        justifyContent: 'space-around',
        // backgroundColor:'red'
    },
    bidText: {
        right: windowWidth * (30 / 100),
        width: windowWidth * (25 / 100),
        height: windowHeight * (4 / 100),

        borderWidth: 0.6,
        color: colours.primaryBlack,
        fontFamily: 'Poppins-Regular',
        fontSize: getFontontSize(8),
        alignItems: 'center',
        justifyContent: 'center'
    },
})