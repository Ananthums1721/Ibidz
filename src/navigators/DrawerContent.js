import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState, useContext, useCallback, useEffect } from 'react';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { getFontontSize, getImage } from '../globals/functions';
import colours from '../globals/colours';
import { showIcon } from '../globals/icons';
import { AppContext } from '../Context/appContext';
import { getProfileDetails, getVendorProfile } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import Modal from "react-native-modal";
import AuthButton from '../components/AuthButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default DrawerContent = ({ navigation }) => {

    const [account, setaccount] = useState('account');
    const [isModalVisible, setModalVisible] = useState(false);
    const { loadProfile } = useContext(AppContext);
    const { showLoader } = useContext(LoaderContext)


    const [profileData, setProfileData] = useState('');
    const [vendorProfile, setvendorProfile] = useState('');

    useEffect(() => {
        getProfile();
        getVendorProfileDetails();
    }, [])
    const handleLogout = async () => {
        await AsyncStorage.removeItem('profile');
        await AsyncStorage.removeItem('isOpenedBefore');
        await AsyncStorage.removeItem('token');
        await loadProfile();
        navigation.reset({
            index: 0,
            routes: [{ name: 'SplashScreen' }],
        });
        Toast.show('Logout successfully')
    }

    const getProfile = async () => {
        try {
            showLoader(true)
            let res = await getProfileDetails()
            setProfileData(res)
            showLoader(false)
        } catch (e) {
            showLoader(false);
        }
    }

    const getVendorProfileDetails = async () => {
        try {
            showLoader(true)
            let res = await getVendorProfile()
            setvendorProfile(res)
            showLoader(false)
        } catch (e) {
            showLoader(false);
        }
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
      };

    return (
        <View style={styles.container}>
            <DrawerContentScrollView >
                <View style={styles.drawerContent}>
                    <View style={styles.profileView}>

                        <View style={styles.iconView}>
                            <View style={styles.profileIconView}>
                                <Image style={styles.profileIconView} source={require('../asset/images/user2.png')} />
                            </View>

                            {
                                profileData[0]?.custToken ?
                                    <View style={{ marginLeft: windowWidth * (2 / 100) }}>
                                        <Text style={styles.fontText1}>{profileData[0]?.custName ? profileData[0]?.custName : ''}</Text>
                                        <Text style={styles.fontText2}>{profileData[0]?.custEmail ? profileData[0]?.custEmail : ''}</Text>

                                    </View>
                                    :
                                    vendorProfile[0]?.sellerToken ?
                                        <View style={{ marginLeft: windowWidth * (2 / 100) }}>
                                            <Text style={styles.fontText1}>{vendorProfile[0]?.sellerName ? vendorProfile[0]?.sellerName : ''}</Text>
                                            <Text style={styles.fontText2}>{vendorProfile[0]?.sellerEmail ? vendorProfile[0]?.sellerEmail : ''}</Text>

                                        </View>
                                        :
                                        <View style={{ marginLeft: windowWidth * (2 / 100) }}>
                                            <Text style={styles.fontText1}>Hello </Text>

                                        </View>
                            }


                        </View>
                        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
                            <View style={{ width: windowWidth * (5 / 100), height: windowHeight * (5 / 100), marginBottom: windowHeight * (5 / 100) }}>{showIcon('close', colours.primaryGrey, 20)}</View>
                        </TouchableOpacity>

                    </View>

                </View>

                <View style={styles.navView} >
                    {
                        profileData[0]?.custToken ?
                            <TouchableOpacity style={[styles.itemBox, { backgroundColor: account == 'account' ? colours.lightBlue : 'white' }]}
                                onPress={() => {
                                    navigation.closeDrawer(),
                                        navigation.navigate('Profile'),
                                        setaccount('account');
                                }}>
                                <View style={{ width: windowWidth * (6 / 100), height: windowWidth * (6 / 100) }}>{showIcon('profile', account == 'account' ? colours.primaryWhite : colours.lightGrey, 24)}</View>
                                <Text style={[styles.menu, { color: account == 'account' ? colours.primaryWhite : colours.primaryBlack, }]} >My Account</Text>
                            </TouchableOpacity>
                            :
                            ''
                    }


                    {
                        profileData[0]?.custToken ?
                            <TouchableOpacity style={[styles.itemBox, { backgroundColor: account == 'bid' ? colours.lightBlue : 'white' }]}
                                onPress={() => {
                                    navigation.closeDrawer(),
                                        navigation.navigate('Bids'),
                                        setaccount('bid');
                                }}>
                                <View style={{ width: windowWidth * (6 / 100), height: windowWidth * (6 / 100) }}>{showIcon('bid', account == 'bid' ? colours.primaryWhite : colours.lightGrey, 20)}</View>
                                <Text style={[styles.menu, { color: account == 'bid' ? colours.primaryWhite : colours.primaryBlack, }]} >Bids</Text>
                            </TouchableOpacity>
                            :
                            ''
                    }


                    {
                        profileData[0]?.custToken ?
                            <TouchableOpacity style={[styles.itemBox, { backgroundColor: account == 'wishlist' ? colours.lightBlue : 'white' }]}
                                onPress={() => {
                                    navigation.closeDrawer(),
                                        navigation.navigate('Wishlist'),
                                        setaccount('wishlist');
                                }
                                }>
                                <View style={{ width: windowWidth * (6 / 100), height: windowWidth * (6 / 100), }}>{showIcon('favorite', account == 'wishlist' ? colours.primaryWhite : colours.primaryGrey, 24)}</View>
                                <Text style={[styles.menu, { color: account == 'wishlist' ? colours.primaryWhite : colours.primaryBlack, }]}>Wishlist</Text>
                            </TouchableOpacity>
                            :
                            ''
                    }


                    <TouchableOpacity style={[styles.itemBox, { backgroundColor: account == 'refund' ? colours.lightBlue : 'white' }]}
                        onPress={() => {
                            navigation.closeDrawer(),
                            navigation.navigate('Terms&Conditions',{
                                Type: 'Refund Policy',
                                fromReg: true,
                            })
                            setaccount('refund');
                        }
                        }>
                        <View style={{ width: windowWidth * (6 / 100), height: windowWidth * (6 / 100), }}>{showIcon('refund', account == 'refund' ? colours.primaryWhite : colours.primaryGrey, 24)}</View>
                        <Text style={[styles.menu, { color: account == 'refund' ? colours.primaryWhite : colours.primaryBlack, }]} >Refund Policy</Text>
                    </TouchableOpacity>



                    <TouchableOpacity style={[styles.itemBox, { backgroundColor: account == 'privacy' ? colours.lightBlue : 'white' }]}
                        onPress={() => {
                            navigation.closeDrawer(),
                            navigation.navigate('Terms&Conditions',{
                                Type: 'Privacy Policy',
                                fromReg: true,
                            })
                            setaccount('privacy');
                        }
                        }>
                        <View style={{ width: windowWidth * (6 / 100), height: windowWidth * (6 / 100), }}>{showIcon('privacypolicy', account == 'privacy' ? colours.primaryWhite : colours.primaryGrey, 24)}</View>
                        <Text style={[styles.menu, { color: account == 'privacy' ? colours.primaryWhite : colours.primaryBlack, }]} >Privacy Policy</Text>
                    </TouchableOpacity>



                    <TouchableOpacity style={[styles.itemBox, { backgroundColor: account == 'terms' ? colours.lightBlue : 'white' }]}
                        onPress={() => {
                            navigation.closeDrawer(),
                            navigation.navigate('Terms&Conditions',{
                                Type: 'Customer Terms and Conditions',
                                fromReg: true,
                            })
                            setaccount('terms');
                        }
                        }>
                        <View style={{ width: windowWidth * (6 / 100), height: windowWidth * (6 / 100), }}>{showIcon('terms', account == 'terms' ? colours.primaryWhite : colours.primaryGrey, 24)}</View>
                        <Text style={[styles.menu, { color: account == 'terms' ? colours.primaryWhite : colours.primaryBlack, }]} >Terms & Conditions</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={[styles.itemBox, { backgroundColor: account == 'feedback' ? colours.lightBlue : 'white' }]}
                        onPress={() => {
                            navigation.closeDrawer(),
                                navigation.navigate('FeedBack'),
                                setaccount('feedback');
                        }
                        }>
                        <View style={{ width: windowWidth * (6 / 100), height: windowWidth * (6 / 100), }}>{showIcon('contact', account == 'feedback' ? colours.primaryWhite : colours.primaryGrey, 24)}</View>
                        <Text style={[styles.menu, { color: account == 'feedback' ? colours.primaryWhite : colours.primaryBlack, }]} >Share FeedBack</Text>
                    </TouchableOpacity>


                    {/* <TouchableOpacity style={[styles.itemBox, { backgroundColor: account == 'about' ? colours.lightBlue : 'white' }]}
                        onPress={() => {
                            navigation.closeDrawer(),
                                navigation.navigate('AboutUs'),
                                setaccount('about');
                        }
                        }>
                        <View style={{ width: windowWidth * (6 / 100), height: windowWidth * (6 / 100), }}>{showIcon('about', account == 'about' ? colours.primaryWhite : colours.primaryGrey, 24)}</View>
                        <Text style={[styles.menu, { color: account == 'about' ? colours.primaryWhite : colours.primaryBlack, }]} >About Us</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={[styles.itemBox, { backgroundColor: account == 'contact' ? colours.lightBlue : 'white' }]}
                        onPress={() => {
                            navigation.closeDrawer(),
                                navigation.navigate('ContactUs'),
                                setaccount('contact');
                        }
                        }>
                        <View style={{ width: windowWidth * (6 / 100), height: windowWidth * (6 / 100), }}>{showIcon('call', account == 'contact' ? colours.primaryWhite : colours.primaryGrey, 18)}</View>
                        <Text style={[styles.menu, { color: account == 'contact' ? colours.primaryWhite : colours.primaryBlack, }]} >Contact Us</Text>
                    </TouchableOpacity>

                    {
                        profileData[0]?.custToken || vendorProfile[0]?.sellerToken ?
                            <TouchableOpacity style={[styles.itemBox, { backgroundColor: account == 'logout' ? colours.lightBlue : 'white' }]}
                                onPress={() => {
                                 toggleModal()
                                }}>
                                <View style={{ width: windowWidth * (6 / 100), height: windowWidth * (6 / 100), }}>{showIcon('logout', account == 'logout' ? colours.primaryWhite : colours.primaryGrey,18)}</View>
                                <Text style={[styles.menu, { color: account == 'logout' ? colours.primaryWhite : colours.primaryBlack, }]} >Logout</Text>
                            </TouchableOpacity>
                            :

                            <TouchableOpacity style={[styles.itemBox, { backgroundColor: account == 'login' ? colours.lightBlue : 'white' }]}
                                onPress={() => {
                                    navigation.closeDrawer(),
                                        navigation.navigate('LoginScreen');
                                    setaccount('login');
                                }}>
                                <View style={{ width: windowWidth * (6 / 100), height: windowWidth * (6 / 100), }}>{showIcon('login', account == 'login' ? colours.primaryWhite : colours.primaryGrey, 24)}</View>
                                <Text style={[styles.menu, { color: account == 'login' ? colours.primaryWhite : colours.primaryBlack, }]} >Sign In</Text>
                            </TouchableOpacity>
                    }

                </View>
            </DrawerContentScrollView>
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
                    <Text style={styles.fontStyle2}>
                        Do you want to logout?
                    </Text>
                    <View style={styles.buttonContainer}>
                        <AuthButton
                            OnPress={() => setModalVisible(false)}
                            ButtonText={"Cancel"}
                            ButtonWidth={40}
                        />
                        <AuthButton
                            OnPress={() =>handleLogout() }
                            ButtonText={'Logout'}
                            ButtonWidth={40}
                            FirstColor={colours.primaryRed}
                            SecondColor={colours.primaryRed}
                        />
                    </View>
                </View>
            </Modal>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.primaryWhite,
    },
    drawerContent: {
        flex: 1,
        backgroundColor: colours.primaryWhite,
        alignItems: "center"
    },
    profileView: {
        width: windowWidth * (60 / 100),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        windowWidth: windowWidth * (20 / 100),
        padding: 2,

    },
    profileIconView: {
        width: windowWidth * (10 / 100),
        height: windowWidth * (10 / 100),
        borderRadius: 20,
        backgroundColor: colours.primaryWhite
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
    profileBox: {
        flexDirection: 'row',
        margin: 10,
        // left: 5,
        borderRadius: 10,
        elevation: 4,
        width: windowWidth * (60 / 100),
        height: windowHeight * (22 / 100),
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: colours.primaryBlue,

    },
    profileImg: {
        width: windowWidth * (20 / 100),
        height: windowHeight * (10 / 100),
        resizeMode: 'contain',
        borderRadius: 40,
        borderWidth: 2,
        backgroundColor: colours.primaryWhite,
        marginLeft: 10
    },

    title: {
        fontSize: getFontontSize(16),
        marginTop: 3,
        fontFamily: 'Poppins-Bold',
        color: colours.primaryWhite,
        // backgroundColor:'orange',
        width: 130
    },
    caption: {
        fontSize: getFontontSize(12),
        lineHeight: 14,
        fontFamily: 'Poppins-Regular',
        color: colours.primaryWhite,
        width: 140,
    },
    navView: {
        margin: 10,
        left: 5,
        borderRadius: 10,
        //  elevation:4,
        padding: 10,
        width: windowWidth * (70 / 100),
        //  backgroundColor:Colors.lightRose,
        // borderColor:Colors.borderGray,
        // borderWidth:1
    },
    itemBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        borderRadius: 10,
        height: windowHeight * (4 / 100),
        right: 10,
        paddingLeft: 15
    },
    menu: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: getFontontSize(16),
        left: 10

    },
    bottomView: {
        margin: 10,
        left: 5,
        borderRadius: 10,
        padding: 10,
        width: windowWidth * (70 / 100),
        // backgroundColor:Colors.lightblue
        // backgroundColor: 'pink'
    },
    modalView: {
        width: windowWidth * (90 / 100),
        height: windowHeight * (20 / 100),
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
        justifyContent: 'space-around'
      },
      fontStyle6: {
        fontSize: getFontontSize(16),
        color: colours.primaryGrey,
        fontFamily: 'Poppins-SemiBold',
        width: windowWidth * (80 / 100),
    
      },
})