

import { View, Text, Dimensions, StyleSheet, Image, TouchableOpacity, FlatList, TextInput } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import colours from '../globals/colours';
import { getFontontSize, getImage } from '../globals/functions';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Refundcard = ({
    navigation,
    packName,
    date,
    amount,
    balanceAmount,
    transactionid,
    id,
    status,
    aucName

}) => {
    return (
        <View style={{ width: windowWidth, paddingHorizontal: 20, alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity style={styles.container}>
                <View style={styles.innerContainer1}>
                    <View style={styles.amountBox}>
                        <View>
                            <Text style={[styles.fontText3,{width:windowWidth*(30/100)}]}>Id</Text>
                            <Text style={[styles.fontText1]}>{id}</Text>
                        </View>
                        <View>
                            <Text style={styles.fontText3}>Auction Name</Text>
                            <Text style={[styles.fontText1]}>{aucName}</Text>
                        </View>
                    </View>
                    {
                        date&&(
                            <View style={styles.amountBox}>
                                <View>
                                    <Text style={styles.fontText3}>Refunded date</Text>
                                    <Text style={styles.fontText2}>{date}</Text>
                                </View>
                            </View>
                        )
                    }
                    <View style={[styles.amountBox,{borderBottomColor:colours.lightGrey,borderBottomWidth:0.8}]}>
                        <View>
                            <Text style={[styles.fontText3,{width:windowWidth*(18/100)}]}>Pack Amount</Text>
                            <Text style={styles.fontText2}>₹{amount}</Text>
                        </View>
                        <View>
                            <Text style={styles.fontText3}>Refund Amount</Text>
                            <Text style={styles.fontText2}>₹{balanceAmount}</Text>
                        </View>
                        <View>
                            <Text style={styles.fontText3}>Transaction Id</Text>
                            <Text style={styles.fontText2}>{transactionid}</Text>
                        </View>
                    </View>
                    <View style={[styles.amountBox, { justifyContent: "center", paddingTop:5 }]}>
                        <View>
                            <Text style={styles.fontText3}>Refund Status</Text>
                            <Text style={[styles.fontText2, { color:status==='Pending'? colours.primaryRed:colours.primaryBlack }]}>{status}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View >

    )
}

export default Refundcard

const styles = StyleSheet.create({
    container: {
        width: windowWidth * (90 / 100),
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
        padding: 5,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    innerContainer1: {
        width: windowWidth * (90 / 100),
        // flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
    },

    fontText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: getFontontSize(16),
        color: colours.primaryBlack,
        // width: windowWidth * (30 / 100)
    },
    amountBox: {
        width: windowWidth * (90/ 100),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        paddingHorizontal:15
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

})