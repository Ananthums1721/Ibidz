import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native';
import Header from "../components/Header";
import { getFontontSize } from "../globals/functions";
import colours from "../globals/colours";
import { showIcon } from "../globals/icons";
import { LoaderContext } from "../Context/loaderContext";
import { getVendorProfile } from "../api";
import SupportButton from "../components/SupportButton";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const VendorCMS = ({ navigation }) => {


    const { showLoader } = React.useContext(LoaderContext);
    const [profiledata, setProfileData] = useState('');

    useEffect(() => {
        getProfile();
    }, [])

    const getProfile = async () => {
        try {
            showLoader(true)
            let res = await getVendorProfile()
            setProfileData(res)
            showLoader(false)
        } catch (e) {
            showLoader(false);
        }

    }
    return (
        <SafeAreaView style={styles.container}>
            <Header logo navigation={navigation} />
            <ScrollView style={{ flex: 1, }}
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 150 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.profileView}>

                    <View style={styles.iconView}>
                        <View style={styles.profileIconView}>
                            <Image style={styles.profileIconView} source={require('../asset/images/user2.png')} />
                        </View>


                        <View style={{ marginLeft: windowWidth * (2 / 100) }}>
                            <Text style={styles.fontText1}>{profiledata[0]?.sellerName ? profiledata[0]?.sellerName : ''}</Text>

                        </View>
                    </View>
                </View>
                <View style={styles.contactBox}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 5
                    }}>
                        <View style={styles.menuCon}>{showIcon('call', colours.primaryGrey, 18)}</View>
                        <Text style={styles.fontText3}>{profiledata[0]?.sellerPhone ? profiledata[0]?.sellerPhone : ''}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 5
                    }}>
                        <View style={styles.menuCon}>{showIcon('mail', colours.primaryGrey, 18)}</View>
                        <Text style={styles.fontText3}>{profiledata[0]?.sellerEmail ? profiledata[0]?.sellerEmail : ''}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <View style={styles.menuCon}>{showIcon('home', colours.primaryGrey, 18)}</View>
                        <Text style={[styles.fontText3, { textAlign: 'justify' }]}>{profiledata[0]?.address ? profiledata[0]?.address : ''}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.componentView} onPress={() => navigation.navigate('Terms&Conditions',{
                                Type: 'Refund Policy',
                                fromReg: true,
                            })} >
                    <View style={styles.menuCon}>{showIcon('refund', colours.primaryBlack, 16)}</View>
                    <Text style={styles.componentText}>Refund Policy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.componentView} onPress={() => navigation.navigate('Terms&Conditions',{
                                Type: 'Privacy Policy',
                                fromReg: true,
                            })} >
                    <View style={styles.menuCon}>{showIcon('privacypolicy', colours.primaryBlack, 16)}</View>
                    <Text style={styles.componentText}>Privacy Policy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.componentView} onPress={() => navigation.navigate('Terms&Conditions',{
                                Type: 'Vendor Terms and Conditions',
                                fromReg: true,
                            })}>
                    <View style={styles.menuCon}>{showIcon('terms', colours.primaryBlack, 16)}</View>
                    <Text style={styles.componentText}>Terms & Conditions</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.componentView} onPress={() => navigation.navigate('FeedBack')} >
                    <View style={styles.menuCon}>{showIcon('contact', colours.primaryBlack, 16)}</View>
                    <Text style={styles.componentText}>Share Feedback</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.componentView} onPress={() => navigation.navigate('Terms&Conditions',{
                                Type: 'About Us',
                                fromReg: true,
                            })} >
                    <View style={styles.menuCon}>{showIcon('about', colours.primaryBlack, 16)}</View>
                    <Text style={styles.componentText}>About Us</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.componentView} onPress={() => navigation.navigate('ContactUs')} >
                    <View style={styles.menuCon}>{showIcon('call', colours.primaryBlack, 16)}</View>
                    <Text style={styles.componentText}>Contact Us</Text>
                </TouchableOpacity>
            </ScrollView>
            <SupportButton />
        </SafeAreaView>
    )
}
export default VendorCMS
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.backgroundColor,
        alignItems: 'center',
    },
    profileView: {
      width: windowWidth * (90 / 100),
      marginTop:20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    iconView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        windowWidth: windowWidth * (20 / 100),
        padding: 2
    },
    profileIconView: {
        width: windowWidth * (15 / 100),
        height: windowWidth * (15 / 100),
        borderRadius: 30,
        backgroundColor: colours.primaryYellow
    },
    fontText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: getFontontSize(18),
        color: colours.primaryBlue
    },
    fontText2: {
        fontFamily: "Poppins-Medium",
        fontSize: getFontontSize(13),
        color: colours.textGray
    },
    fontText3: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(14),
        color: colours.textGray,
        marginLeft: windowWidth * (2 / 100)
    },
    contactBox: {
        width: windowWidth * (90 / 100),
        borderBottomWidth:0.5,
        borderBlockColor: colours.primaryBlue,
        paddingBottom: windowHeight*(2/100)
    },
    componentView: {
        width: windowWidth * (90 / 100),
        height: windowHeight * (6 / 100),
        marginTop: windowHeight * (2 / 100),
        backgroundColor: colours.primaryWhite,
        paddingHorizontal: windowHeight*(0.5/100),
        borderRadius:3,
        flexDirection: 'row',
        alignItems: "center",
    },
    menuCon: { 
      width: windowHeight * (5 / 100), 
      height: windowHeight * (5 / 100),
      marginRight: windowWidth*(3/100),
      backgroundColor: colours.lowBlue,
      borderRadius:3,
    },
    componentText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: getFontontSize(16),
        color: colours.primaryBlack,
        marginLeft: 5
    },
})