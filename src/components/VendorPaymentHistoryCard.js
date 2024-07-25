import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import { showImage } from '../globals/icons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VendorPaymentHistoryCard = ({ navigation,
    brandname,
    winAmount,
   commissionstatus,
    commission,
    balanceAmount,
}) => {
    return (
        <View style={{  width: windowWidth, alignItems: 'center' }}>
            <View style={styles.containers}>
                <View style={{width: windowWidth * (86 / 100),}}>
                    <Text style={styles.fontText2} >Auction Name</Text>
                    <Text style={styles.fontText1}>{brandname}</Text>
                </View>
                <View style={styles.box1}>
                    <View style={styles.box3}>
                        <Text style={[styles.fontText2, { width: windowWidth * (28 / 100), textAlign:'center' }]}>Win Amount</Text>
                        <Text style={[styles.fontText2, { width: windowWidth * (28 / 100), textAlign:'center' }]}>Balance</Text>
                        <Text style={[styles.fontText2, { width: windowWidth * (28 / 100), textAlign:'center' }]}>Commission</Text>
                    </View>

                    <View style={styles.box3}>
                        <Text style={[styles.fontText1, { width: windowWidth * (28 / 100), textAlign:'center' }]} >₹{winAmount}</Text>
                        <Text style={[styles.fontText1, { width: windowWidth * (28 / 100), textAlign:'center' }]} >₹{balanceAmount}</Text>
                        <Text style={[styles.fontText1,{ width: windowWidth * (28 / 100), textAlign:'center' }]} >₹{commission}</Text>
                    </View>
                </View>
                <View style={[styles.box2,{marginTop:windowHeight*(1/100)}]}>
                    <Text style={styles.fontText2} >Commission Payment Status</Text>
                    <Text style={styles.fontText1} >{commissionstatus}</Text>
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containers: {
        width: windowWidth * (90 / 100),
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
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
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
    box1: {
        width: windowWidth * (90 / 100),
        // height: windowHeight * (6/ 100),
        alignItems: "center",
        justifyContent: "space-between",
        padding: 5,
        borderBottomColor: colours.lowGrey,
        borderBottomWidth: 0.6,
        marginTop:windowHeight*(1/100),
    },
    box2: {
        width: windowWidth * (90 / 100),
        height: windowHeight * (4/ 100),
        alignItems: 'center',
        justifyContent: 'center',
    },
    box3: {
        width: windowWidth * (90 / 100),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: windowWidth * (2 / 100)

    },
});

export default VendorPaymentHistoryCard;