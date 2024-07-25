import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { getPaymentDues } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import { showIcon } from '../globals/icons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ContactUs = ({ navigation }) => {

    const [paymenydues, setPaymenydues] = useState('');
    const { showLoader } = React.useContext(LoaderContext);


    return (
        <SafeAreaView style={styles.container}>
            <Header backarrow logo navigation={navigation} />
            <ScrollView style={{ flex: 1, }}
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 150 }}
            >

                <View style={styles.head}>
                    <Text style={styles.fontText1}>Contact Us</Text>
                </View>

                <View style={styles.subboxText}>
                    <Text style={styles.fontText2}>Address</Text>
                    <Text> : </Text>
                    <View>
                        <Text style={styles.fontText3}>FOURO TECH Pvt. Ltd.</Text>
                        <Text style={styles.fontText3}>2nd Floor, 2F, Vattoly Annexe, </Text>
                        <Text style={styles.fontText3}>SRM Road, North, Ernakulam</Text>
                        <Text style={styles.fontText3}>GSTIN:32AAECF7684E1ZM</Text>
                    </View>
                </View>

                <View style={styles.subboxText}  >
                    <Text style={styles.fontText2}>Call Us</Text>
                    <Text> : </Text>
                    <TouchableOpacity style={[styles.fontText3,{color:colours.secondaryBlue}]} onPress={() => Linking.openURL(`tel:${9544509000}`)}><Text style={styles.fontText3}>+91 9544509000</Text></TouchableOpacity>
                </View>


                <View style={styles.subboxText}  >
                    <Text style={styles.fontText2}>Email</Text>
                    <Text> : </Text>
                    <TouchableOpacity  onPress={() => Linking.openURL('mailto:mail@fourotech.com')} style={[styles.fontText3,{color:colours.secondaryBlue}]}><Text style={styles.fontText3}>mail@fourotech.com</Text></TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ContactUs
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: colours.backgroundColor,

    },
    subboxText: {
        flexDirection: 'row',
        width: '100%',
        padding:10,    
        
    },
    fontText2: {
        fontFamily: 'Poppins-Regular',
        fontSize: getFontontSize(16),
        color: colours.gray, 
        width:windowWidth*(20/100) ,
    },
    fontText3: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(16),
        color: colours.primaryBlack,
        width: 250,
        paddingLeft:6

    },
    head: {
        flexDirection: 'row',
        width: windowWidth * (90 / 100),
        marginTop: windowHeight * (5 / 100),
        // paddingHorizontal: 10,
    },
    fontText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: getFontontSize(20),
        color: colours.primaryBlack,
    },

})