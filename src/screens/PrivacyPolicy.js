import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { getPaymentDues } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import SupportButton from '../components/SupportButton';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PrivacyPolicy = ({ navigation }) => {

    const [paymenydues, setPaymenydues] = useState('');
    const { showLoader } = React.useContext(LoaderContext);

    //   useEffect(() => {
    //     getPaymentDetails();
    //   }, [])

    //   const getPaymentDetails = async () => {
    //     showLoader(true);
    //     let res1 = await getPaymentDues()
    //     setPaymenydues(res1);
    //     showLoader(false)
    //   }
    const terms = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Itaque nemo aliquid ad ullam corporis recusandae iste doloremque, labore, perferendis incidunt quod blanditiis saepe unde nostrum optio esse voluptates totam? IsteLorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti qui hic maiores explicabo natus atque a sit illo! Voluptate quos enim voluptas quo facere, repellat odio ex blanditiis similique omnis!';

    return (
        <SafeAreaView style={styles.container}>
            <Header backarrow logo navigation={navigation} />
            <ScrollView style={{ flex: 1, }}
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 150 }}
            >

                <View style={styles.head}>
                    <Text style={styles.fontText1}>Privacy Policy</Text>
                </View>
                {
                    terms != '' ?
                        <>
                            <View style={styles.subboxText}>
                                <Text style={[styles.fontText10]}>{terms}</Text>

                            </View>

                        </>
                        :
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Image
                                style={{ width: windowWidth * (70 / 100), height: windowWidth * (50 / 100), resizeMode: 'contain' }}

                                source={require('../asset/images/nodata1.webp')}
                            />
                            <Text
                                style={{
                                    fontFamily: 'Poppins-Bold',
                                    marginTop: '4%',
                                    color: colours.primaryBlack
                                }}>
                                {'No Data Available'}
                            </Text>
                        </View>
                }
            </ScrollView>
            <SupportButton />
        </SafeAreaView>
    )
}

export default PrivacyPolicy
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.backgroundColor,
        alignItems: 'center'
    },
    subboxText: {

        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth * (90 / 100),
        padding: 10
    },
    fontText10: {
        fontFamily: 'Poppins-Regular',
        fontSize: getFontontSize(16),
        color: colours.primaryBlack,
        lineHeight: 20,
        textAlign: "justify"

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