import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, } from 'react-native'
import React, { useState, useEffect } from 'react'
import colours from '../globals/colours';
import { getFontontSize, getImage } from '../globals/functions';
import { showIcon } from '../globals/icons';
import TimerCard from './TimerCard';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const DetailCard = ({
    navigation,
    image,
    name,
    detailName,
    location,
    speedtimer,
    timer,
    onPress,
}) => {

    const [givenDate, setGivenDate] = useState(new Date(timer)); // Given date and time
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const currentDate = new Date(); // Current date and time
        setIsExpired(currentDate > givenDate);
    }, []);

    return (

        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={styles.box1}>
                {image ?
                    <Image source={{ uri: getImage(image) }} style={styles.imageStyle}/>
                    :
                    <Image source={require('../asset/images/car.jpg')} style={styles.imageStyle}/>
                }
                <View style={styles.detailBox}>
                    <View >
                        <Text numberOfLines={1} style={styles.text1}>{name ? name : ''}</Text>
                        <Text numberOfLines={1} style={styles.text2}>{detailName ? detailName : ''}</Text>
                    </View>
                    <View style={[styles.speedBox]}>
                        <View style={styles.iconCon}>{showIcon('speedtime', colours.primaryBlue, 16)}</View>
                        <Text numberOfLines={1} style={{ color: '#000', fontSize: 12, marginLeft: 4 }}>{speedtimer ? speedtimer : ''}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.box2}>
                <View style={[styles.innerBox2]}>
                    <View style={styles.iconCon}>{showIcon('location', colours.primaryBlue, 16)}</View>
                    <Text numberOfLines={1} style={styles.text2}>{location}</Text>
                </View>
                <View style={[styles.innerBox2,]}>
                    <View style={styles.iconCon}>{showIcon('timer', colours.primaryBlue, 16)}</View>
                    {
                        isExpired ?
                            <Text style={[styles.text1, { marginLeft: windowWidth * (2 / 100) }]}>Auction Expired</Text>
                            :
                            <TimerCard DealTo={timer} />
                    }
                </View>
            </View>

        </TouchableOpacity>
    )
}

export default DetailCard

const styles = StyleSheet.create({
    container: {
        width: windowWidth * (44 / 100),
        padding: windowWidth * (1 / 100),
        backgroundColor: colours.primaryWhite,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4
    },
    imageStyle: {
        width: windowWidth*(15/100),
        height: windowWidth*(15/100),
        resizeMode:'cover',
        borderRadius:5,
    },
    box1: {
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        width: windowWidth * (45 / 100),
        padding: 5
    },
    carContainer: {
        width: windowWidth * (20 / 100),
        height: windowWidth * (20 / 100),
        borderRadius: 10,
    },
    detailBox: {
        width: windowWidth * (25 / 100),
        height: windowWidth * (15 / 100),
    },
    iconCon: {
        width: windowWidth*(5/100),
        height: windowWidth*(5/100),
        alignItems: 'center',
        justifyContent: 'center',
    },
    text1: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(12),
        color: colours.primaryBlack,
    },
    text2: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(12),
        color: colours.textGray,
    },
    speedBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    box2: {
        width: windowWidth * (43 / 100),
        paddingHorizontal: windowWidth * (2 / 100),
        paddingTop: windowWidth * (2 / 100),
    },
    innerBox2: {
        flexDirection: "row",
        alignItems: 'center',
    },

})
