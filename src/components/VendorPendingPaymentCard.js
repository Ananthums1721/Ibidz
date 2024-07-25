import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import { showImage } from '../globals/icons';
import CheckBox from 'react-native-check-box';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VendorPendingPaymentCard = ({ navigation,
    brandname,
    winAmount,
    selected,
    commission,
    balanceAmount,
    item, isSelected, onSelect
}) => {
    const [terms, setTerms] = useState(false);

    return (
        <View style={{ width: windowWidth, alignItems: 'center', paddingHorizontal: 15 }}>

            <View style={styles.containers}>

                <View style={{ flexDirection: "row" }}>
                    <View style={{
                        width: windowWidth * (70 / 100),
                        height: windowHeight * (4 / 100),

                    }}>
                        <Text style={styles.fontText2} >Auction Name</Text>
                        <Text style={styles.fontText1}>{brandname}</Text>
                    </View>

                    <CheckBox
                        style={{ flex: 1, padding: 10, }}
                        // isChecked={isSelected}
                        // onClick ={() => onSelect(item.id)}
                        isChecked={isSelected}
                        onClick={() => onSelect(item.id)}
                
                    />
                </View>





                <View style={styles.box1}>
                    <View style={styles.box3}>
                        <Text style={[styles.fontText2,]}>Win Amount</Text>
                        <Text style={[styles.fontText2]}>Commission</Text>
                        <Text style={styles.fontText2}>Balance</Text>
                    </View>

                    <View style={styles.box3}>
                        <Text style={[styles.fontText1,]} >₹{winAmount}</Text>
                        <Text style={[styles.fontText1,]} >₹{commission}</Text>

                        <Text style={styles.fontText1} >₹{balanceAmount}</Text>

                    </View>

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
    fontText3: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(16),
        color: colours.primaryWhite,
    },
    box1: {
        width: windowWidth * (90 / 100),
        height: windowHeight * (6 / 100),
        alignItems: "center",
        justifyContent: "space-between",
        padding: 5,
        marginTop: windowHeight * (1 / 100)
    },
    box2: {
        width: windowWidth * (90 / 100),
        height: windowHeight * (4 / 100),
        alignItems: 'center',
        justifyContent:'space-between',
        flexDirection:'row',
        padding:5
    },
    box3: {
        width: windowWidth * (90 / 100),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: windowWidth * (2 / 100)

    },
    
});

export default VendorPendingPaymentCard;