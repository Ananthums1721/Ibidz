

import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import colours from '../globals/colours';
import { getFontontSize, getImage } from '../globals/functions';
import { showIcon } from '../globals/icons';
import TimerCard from './TimerCard';
import { Alert } from 'react-native';
import WishIcon from './wishIcon';
import { MaskedText } from "react-native-mask-text";
import { formatCurrency } from "react-native-format-currency";
import FastImage from 'react-native-fast-image';
import moment from 'moment';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BidCard = ({
    navigation,
    image,
    brandName,
    modelName,
    bidAmount,
    location,
    time,
    onpress,
    onWishPress,
    id,
    premium,
    registeration,
    year,
    onRefresh,
    AucStartDate,
    YOM,
    bidzCount,
    fromUpcoming


}) => {

    const [givenDate, setGivenDate] = useState(new Date(time)); // Given date and time
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const currentDate = new Date(); // Current date and time
        setIsExpired(currentDate > givenDate);
    }, []);

    return (

        <Pressable onPress={onpress} style={{ width: windowWidth, paddingHorizontal: 15 }}>
            <View style={styles.container}>
                {image ?
                    <>
                      <FastImage
                        style={styles.imgContainer}
                        source={{
                            uri: getImage(image),
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        />
                        {premium === true ?
                            <Image 
                                style={styles.imgPremiumContainer}
                                source={require('../asset/images/Premium.png')} 
                            />
                            :
                            null
                        }

                    </>

                    :
                    <Image style={styles.imgContainer}
                        source={require('../asset/images/noimg.png')} />
                }

                <View style={styles.detailContainer}>
                    <View style={{ width: windowWidth * (60 / 100), flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: windowWidth*(55/100) }}>
                            <Text style={[styles.fontText1, {width: windowWidth*(45/100) }]} numberOfLines={2}>{brandName ? brandName : ''} <Text numberOfLines={2} style={[styles.fontText2, {width: windowWidth*(45/100) }]}>{modelName ? modelName : ''} </Text></Text>
                            
                        </View>
                        <WishIcon
                            vehId={id} 
                            onRefresh={onRefresh}
                        />
                    </View>
                    <View style={{ width: windowWidth * (60 / 100), flexDirection: 'row', justifyContent: 'space-between' }}>
                    {
                        YOM&&(
                            <View style={styles.locationView}>
                                <View style={styles.iconStyle}>{showIcon('calendar', colours.primaryGreen, 18)}</View>
                                <Text style={styles.fontText3}>{YOM}</Text>
                            </View>
                        )
                    }
                    {
                        bidzCount > 0 &&(
                            <View style={styles.locationView}>
                                {/* <View style={styles.iconStyle}>{showIcon('bid', colours.primaryRed, 18)}</View> */}
                                <Text style={[styles.fontText3,{color: colours.primaryRed}]}>No. Bids : {bidzCount}</Text>
                            </View>
                        )
                    }
                    </View>
                    {location ?
                        <View style={[styles.locationView,{ width: windowWidth * (60 / 100)}]}>
                            <View style={styles.iconStyle}>{showIcon('location', colours.primaryRed, 18)}</View>
                            <Text style={[styles.fontText3, { width: windowWidth*(55/100)}]}>{location} </Text>
                        </View>
                        :
                        <View style={styles.locationView}>
                            <View style={styles.iconStyle}>{showIcon('numPlate', colours.primaryBlack, 18)}</View>
                            <MaskedText mask="AA 99****" style={styles.fontText3}>
                                {registeration}
                            </MaskedText>
                            {/* <Text style={styles.fontText3}>{registeration}</Text> */}
                        </View>
                    }
                    {time ?
                        <View style={[styles.locationView, { right: 0 }]}>
                            <View style={styles.iconStyle}>{showIcon('timer', colours.primaryGreen, 18)}</View>
                            {
                                isExpired ?

                                    <Text style={[styles.fontText5, { marginLeft: windowWidth * (2 / 100) }]}>Auction Expired</Text>
                                    :
                                    <TimerCard DealTo={time} />
                                // <Text>{time}</Text>

                            }

                        </View>
                        :
                        <View style={styles.locationView}>
                            <View style={styles.iconStyle}>{showIcon('year', colours.primaryRed, 18)}</View>
                            <Text style={styles.fontText3}>{year}</Text>
                        </View>
                    }
                    {
                        AucStartDate&&(
                            <View style={styles.locationView}>
                                <View style={styles.iconStyle}>{showIcon('calendar', colours.primaryGreen, 18)}</View>
                                <Text style={styles.fontText3}>{moment(AucStartDate).format('DD-MM-YYYY hh:mm a')}</Text>
                            </View>
                        )
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: windowHeight * (4 / 100) }}>
                        <Text style={styles.fontText5}>{fromUpcoming? 'Price Start From : ':'Current Price :'}</Text>
                        {bidAmount ? <Text style={styles.fontText4}>{formatCurrency({ amount: bidAmount, code: "INR" })[0]}</Text> : <Text style={styles.fontText4}>₹0</Text>}
                    </View>
                </View>

            </View>
        </Pressable>

    )
}

export default BidCard

const styles = StyleSheet.create({
    container: {
        width: windowWidth * (92 / 100),
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
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    imgContainer: {
        width: windowWidth * (25 / 100),
        height: windowWidth * (25 / 100),
        borderRadius: 10,
        resizeMode: 'contain',
        elevation: 2,
        backgroundColor: colours.lightWhite
    },
    imgPremiumContainer: {
        width: windowWidth * (25 / 100),
        height: windowWidth * (25 / 100),
        left: -windowWidth * (2 / 100),
        top: -windowWidth * (1 / 100),
        borderRadius: 10,
        resizeMode: 'contain',
        elevation: 2,
        position: 'absolute'
    },
    iconStyle: {
        width: windowWidth * (5 / 100),
        height: windowWidth * (5 / 100),
        alignItems: 'center',
        justifyContent: 'center',

    },
    detailContainer: {
        width: windowWidth * (63 / 100),
        justifyContent: 'space-between',
    },
    fontText1: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(16),
        color: colours.primaryBlack,
    },
    fontText2: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(13),
        color: colours.primaryBlack,
    },
    detailContainer1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        height: windowHeight * (4 / 100),
    },
    locationView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3
        // backgroundColor: 'green'
    },
    fontText3: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(12),
        color: colours.primaryBlack,
        marginLeft: 5
    },
    fontText4: {
        fontFamily: 'Proxima Nova Alt Bold',
        fontSize: getFontontSize(15),
        color: colours.primaryBlack,
        marginLeft: 5
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingHorizontal: windowWidth * (2 / 100),
        height: windowHeight * (3 / 100),
        backgroundColor: colours.primaryOrange, // Semi-transparent background for the overlay 
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    overlayText: {
        color: colours.primaryWhite,
        fontSize: getFontontSize(14),
        fontFamily: 'Poppins-Regular'
    },
    fontText5: {
        fontFamily: 'Poppins-Regular',
        fontSize: getFontontSize(12),
        color: colours.primaryBlack,
    }


})