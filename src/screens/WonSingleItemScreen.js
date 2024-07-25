import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Dimensions,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    RefreshControl,
    TextInput,
    Linking,
} from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import colours from '../globals/colours';
import { generateOTP, getwonItemDetails } from '../api';
import Header from '../components/Header';
import { getFontontSize, getImage } from '../globals/functions';
import AuthButton from '../components/AuthButton';
import { showIcon } from '../globals/icons';
import { LoaderContext } from '../Context/loaderContext';
import Modal from "react-native-modal";
import Toast from 'react-native-simple-toast';
import { AppContext } from '../Context/appContext';
import FastImage from 'react-native-fast-image';
import TimerCard from '../components/TimerCard';
import Carousel from 'react-native-snap-carousel';
import SupportButton from '../components/SupportButton';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const WonSingleItemScreen = ({ navigation, route }) => {

    const acuname = route?.params?.name ? route?.params?.name : '';
    const id = route?.params?.id ? route?.params?.id : '';

    const [itemDetails, setItemDetails] = useState('');
    const [vehicleData, setVehicleData] = useState('');
    const { showLoader } = React.useContext(LoaderContext);
    const [bidAmount, setBidAmount] = useState('');
    const [navOptions, setnavOptions] = useState('options');


    const { profile } = useContext(AppContext)
    const [isModalVisible, setModalVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const [givenDate, setGivenDate] = useState(new Date(itemDetails[0]?.actualMaturityDate)); // Given date and time
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const currentDate = new Date(); // Current date and time
        setIsExpired(currentDate > givenDate);
    }, []);

    useEffect(() => {
        getDetails()
    }, [])

    const getDetails = async () => {
        showLoader(true)
        let res = await getwonItemDetails(acuname)
        setItemDetails(res)
        if(res.length>0){
            let data = res[0]?.vehicleImageList?JSON.parse(res[0]?.vehicleImageList):null
            setVehicleData(Object.values(data[0]))
        }
        showLoader(false)
    }

    const getGenerateOTP = async () => {
        try {
            showLoader(true);
            let res1 = await generateOTP({
                sp: "generateWonOtp",
                custId: profile[0].customerId,
                aucId: id
            })
            showLoader(false)
            onRefresh()
        } catch (e) {
            showLoader(false)
        }
    }


    const onRefresh = useCallback(() => {
        setRefresh(true),
            getDetails();
        setTimeout(() => {
            setRefresh(false)
        }, 1000);
    })


    return (
        <SafeAreaView style={styles.container}>
            <Header backarrow logo navigation={navigation} />
            <ScrollView
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                style={{ padding: windowWidth * (2 / 100) }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>

                <View style={{ width: windowWidth * (90 / 100), height: windowWidth * (90 / 100) }}>
                    {
                        vehicleData && vehicleData.length > 0 ?
                            < View style={{
                                flexDirection: 'row',
                                justifyContent: "space-between",
                                width: windowWidth,

                            }}>
                                <Carousel
                                    autoplay
                                    data={vehicleData}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate('ImageViewScreen', { images: vehicleData })
                                        }}>
                                            <Image style={{
                                                width: windowWidth * (85 / 100),
                                                height: windowWidth * (90 / 100),
                                                borderRadius: 6,
                                                resizeMode: 'contain',
                                            }}
                                                source={{ uri: getImage(item) }}
                                            />
                                        </TouchableOpacity>
                                    )}
                                    sliderWidth={windowWidth}
                                    loop={true}
                                    itemWidth={windowWidth}
                                />
                                <TouchableOpacity
                                    style={{ position: 'absolute', right: windowWidth * (8 / 100), bottom: 0 }}
                                    onPress={() =>
                                        navigation.navigate('ImageViewScreen', { images: vehicleData })
                                    }
                                >
                                    {showIcon('expand', '#0009', 20)}
                                </TouchableOpacity>
                            </View>

                            :
                            <TouchableOpacity
                                style={{
                                    alignItems: 'center',
                                    padding: 20,
                                    height: windowWidth * (50 / 100),
                                }}>
                                <FastImage
                                    style={{
                                        width: windowWidth,
                                        height: windowWidth * (50 / 100),
                                        resizeMode: 'contain',
                                    }}
                                    source={{
                                        uri: getImage(vehicleData.item),
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />

                            </TouchableOpacity>
                    }
                </View>

                <Text style={styles.fontText1}>{itemDetails[0]?.brandName ? itemDetails[0]?.brandName : ''}
                    <Text style={styles.fontText2}> {itemDetails[0]?.modelName ? itemDetails[0]?.modelName : ''}</Text>
                    <Text style={[styles.fontText3]}> {itemDetails[0]?.manYear}</Text></Text>


                <View style={styles.bidInfoContainer}>
                    <View style={styles.bidView1}>
                        <Text style={styles.fontText3}>Vendor Details</Text>
                    </View>
                    <View style={styles.bidView2}>
                        <Text style={styles.fontText3}>Current Bid Amount</Text>
                        <View style={{ width: windowWidth * (40 / 100), }}>
                            <Text style={[styles.fontText3]}>₹{itemDetails[0]?.latestBidAmount ? itemDetails[0]?.latestBidAmount : ''}</Text>
                        </View>
                    </View>

                    <View style={styles.bidView2}>
                        <Text style={styles.fontText3}>Name</Text>
                        <View style={{ width: windowWidth * (40 / 100), }}>
                            <Text style={[styles.fontText3]}>{itemDetails[0]?.sellerName ? itemDetails[0]?.sellerName : ''}</Text>
                        </View>
                    </View>
                    <View style={styles.bidView2}>
                        <Text style={styles.fontText3}>Ownership</Text>
                        <View style={{ width: windowWidth * (40 / 100), }}>
                            <Text style={[styles.fontText3]}>{itemDetails[0]?.ownership}</Text>
                        </View>
                    </View>
                    {
                        itemDetails[0]?.aucWonOtp === null && itemDetails[0]?.otpStatus === null && itemDetails[0]?.paymentStatus === null ?
                            <>
                                <View style={styles.bidView2}>
                                    <View style={{ width: windowWidth * (90 / 100), }}>
                                        <Text style={{ color: colours.primaryOrange, fontFamily: 'Poppins-Medium', fontSize: getFontontSize(14) }}>! Please pay the token amount to view seller details.</Text>
                                    </View>
                                </View>
                            </>
                            :
                            <>
                                <View style={styles.bidView2}>
                                    <Text style={styles.fontText3}>Phone</Text>
                                    <View style={{ width: windowWidth * (40 / 100), }}>
                                        <Text style={[styles.fontText3]} onPress={() => Linking.openURL(`tel:${itemDetails[0]?.sellerPhone}`)}>{itemDetails[0]?.sellerPhone ? itemDetails[0]?.sellerPhone : ''}</Text>
                                    </View>
                                </View>

                                <View style={[styles.bidViewTest,]}>
                                    <Text style={styles.fontText3}>Address</Text>
                                    <View style={{ width: windowWidth * (40 / 100), }}>
                                        <Text style={[styles.fontText3]}>{itemDetails[0]?.sellerAddress ? itemDetails[0]?.sellerAddress : 'NA'}</Text>
                                    </View>
                                </View></>
                    }


                    {
                        itemDetails[0]?.paymentStatus === true && itemDetails[0]?.aucWonOtp != '' && itemDetails[0]?.aucWonOtp != null && itemDetails[0]?.otpStatus === null ?

                            <View style={styles.conditionBox}>
                                <Text style={{ color: colours.primaryOrange, fontFamily: 'Poppins-Medium', fontSize: getFontontSize(14) }}>! Please provide this otp to the vendor in order for them to confirm the vehicle. Do not give out the OTP over the phone; only give it out after meeting with the seller.</Text>


                                <View style={styles.ButtonView}>
                                    <Text style={styles.fontText4}>OTP:{itemDetails[0]?.aucWonOtp}</Text>
                                </View>
                            </View>
                            :
                            itemDetails[0]?.paymentStatus === true && itemDetails[0]?.aucWonOtp != '' && itemDetails[0]?.otpStatus === true ?
                                <View style={styles.conditionBox}>
                                    <View style={styles.ButtonView}>
                                        <Text style={styles.fontText4}>Verified</Text>
                                    </View>
                                </View>
                                :
                                ''

                    }
                    {itemDetails[0]?.paymentStatus === true && itemDetails[0]?.aucWonOtp === null && itemDetails[0]?.otpStatus === null ?
                        <View style={styles.conditionBox} >

                            <TouchableOpacity style={styles.ButtonView} onPress={() => getGenerateOTP()}>
                                <Text style={styles.fontText4}>Generate OTP</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        ''}

                </View>


                <View style={styles.vechileDescriptionBox}>
                    <View style={[styles.bidView2, { borderTopWidth: 0.6, borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
                        <Text style={styles.fontText3}>Make</Text>
                        <View style={{ width: windowWidth * (40 / 100), }}>
                            <Text style={[styles.fontText3]}>{itemDetails[0]?.brandName}</Text>
                        </View>
                    </View>

                    <View style={styles.bidView2}>
                        <Text style={styles.fontText3}>Model</Text>
                        <View style={{ width: windowWidth * (40 / 100), }}>
                            <Text style={[styles.fontText3]}>{itemDetails[0]?.modelName}</Text>
                        </View>
                    </View>

                    <View style={styles.bidView2}>
                        <Text style={styles.fontText3}>Registration</Text>
                        <View style={{ width: windowWidth * (40 / 100), }}>
                            <Text style={[styles.fontText3]}>{itemDetails[0]?.vehRegNo}</Text>
                        </View>
                    </View>

                    <View style={styles.bidView2}>
                        <Text style={styles.fontText3}>Body Type</Text>
                        <View style={{ width: windowWidth * (40 / 100), }}>
                            <Text style={[styles.fontText3]}>{itemDetails[0]?.vehTypeName}</Text>
                        </View>
                    </View>

                    <View style={styles.bidView2}>
                        <Text style={styles.fontText3}>Location</Text>
                        <View style={{ width: windowWidth * (40 / 100), }}>
                            <Text style={[styles.fontText3]}>{itemDetails[0]?.locName}</Text>
                        </View>
                    </View>

                    <View style={styles.bidView2}>
                        <Text style={styles.fontText3}>KMs Driven</Text>
                        <View style={{ width: windowWidth * (40 / 100), }}>
                            <Text style={[styles.fontText3]}>{itemDetails[0]?.kmClocked} KM</Text>
                        </View>
                    </View>

                    <View style={styles.bidView2}>
                        <Text style={styles.fontText3}>Fuel Type</Text>
                        <View style={{ width: windowWidth * (40 / 100), }}>
                            <Text style={[styles.fontText3]}>{itemDetails[0]?.fuelTypeName}</Text>
                        </View>
                    </View>

                    <View style={[styles.bidView2, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderRadius: 10, borderTopLeftRadius: 0, borderTopRightRadius: 0 }]}>
                        <Text style={styles.fontText3}>Year Of Make</Text>
                        <View style={{ width: windowWidth * (40 / 100), }}>
                            <Text style={[styles.fontText3]}>{itemDetails[0]?.manYear}</Text>
                        </View>
                    </View>

                </View>



                <View style={styles.vechileDescriptionBox}>

                    <View style={styles.innervechileDescription}>
                        <Text style={styles.vechileText}>Vehicle Description</Text>

                        <View style={styles.navView}>
                            <TouchableOpacity style={[styles.navButton, { backgroundColor: navOptions == 'options' ? colours.primaryColor : colours.lowGrey, }]} onPress={() => setnavOptions('options')}>
                                <Text style={[styles.navText, { color: navOptions == 'options' ? colours.primaryWhite : colours.primaryBlack }]}>Options and Features</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.navButton, { backgroundColor: navOptions != 'options' ? colours.primaryColor : colours.lowGrey }]} onPress={() => setnavOptions('features')}>
                                <Text style={[styles.navText, { color: navOptions != 'options' ? colours.primaryWhite : colours.primaryBlack }]}>Technical Specification</Text>
                            </TouchableOpacity>
                        </View>

                    </View>



                    {
                        navOptions == 'options' ?
                            <>
                                <View style={[styles.bidView2]}>
                                    <Text style={styles.fontText3}>Roof AC</Text>
                                    <View style={{ width: windowWidth * (10 / 100), }}>
                                        <Text style={[styles.fontText3]}>{itemDetails[0]?.adjustableSteering != true ? 'No' : 'Yes'}</Text>
                                    </View>
                                </View>

                                <View style={styles.bidView2}>
                                    <Text style={styles.fontText3}>Alloy Wheels</Text>
                                    <View style={{ width: windowWidth * (10 / 100), }}>
                                        <Text style={[styles.fontText3]}>{itemDetails[0]?.alloyWheels != true ? 'No' : 'Yes'}</Text>
                                    </View>
                                </View>

                                <View style={styles.bidView2}>
                                    <Text style={styles.fontText3}>Anti Theft Device</Text>
                                    <View style={{ width: windowWidth * (10 / 100), }}>
                                        <Text style={[styles.fontText3]}>{itemDetails[0]?.antiTheftDevice != true ? 'No' : 'Yes'}</Text>
                                    </View>
                                </View>

                                <View style={styles.bidView2}>
                                    <Text style={styles.fontText3}>Power Window</Text>
                                    <View style={{ width: windowWidth * (10 / 100), }}>
                                        <Text style={[styles.fontText3]}>{itemDetails[0]?.auxCompatibility != true ? 'No' : 'Yes'}</Text>
                                    </View>
                                </View>

                                <View style={styles.bidView2}>
                                    <Text style={styles.fontText3}>Rear Wiper</Text>
                                    <View style={{ width: windowWidth * (10 / 100), }}>
                                        <Text style={[styles.fontText3]}>{itemDetails[0]?.bluetooth != true ? 'No' : 'Yes'}</Text>
                                    </View>
                                </View>

                                <View style={styles.bidView2}>
                                    <Text style={styles.fontText3}>Comprehensive Navigation System</Text>
                                    <View style={{ width: windowWidth * (10 / 100), }}>
                                        <Text style={[styles.fontText3]}>{itemDetails[0]?.navigationSystem != true ? 'No' : 'Yes'}</Text>
                                    </View>
                                </View>

                                <View style={styles.bidView2}>
                                    <Text style={styles.fontText3}>Parking Sensors</Text>
                                    <View style={{ width: windowWidth * (10 / 100), }}>
                                        <Text style={[styles.fontText3]}>{itemDetails[0]?.parkingSensors != true ? 'No' : "Yes"}</Text>
                                    </View>
                                </View>
                                <View style={styles.bidView2}>
                                    <Text style={styles.fontText3}>Power steering</Text>
                                    <View style={{ width: windowWidth * (10 / 100), }}>
                                        <Text style={[styles.fontText3]}>{itemDetails[0]?.powerSteering != true ? 'No' : "Yes"}</Text>
                                    </View>
                                </View>
                                <View style={styles.bidView2}>
                                    <Text style={styles.fontText3}>Music System</Text>
                                    <View style={{ width: windowWidth * (10 / 100), }}>
                                        <Text style={[styles.fontText3]}>{itemDetails[0]?.FMRadio != true ? 'No' : "Yes"}</Text>
                                    </View>
                                </View>
                                <View style={styles.bidView2}>
                                    <Text style={styles.fontText3}>Rear Parking Camera</Text>
                                    <View style={{ width: windowWidth * (10 / 100), }}>
                                        <Text style={[styles.fontText3]}>{itemDetails[0]?.rearParkingCamera != true ? 'No' : "Yes"}</Text>
                                    </View>
                                </View>
                                <View style={styles.bidView2}>
                                    <Text style={styles.fontText3}>Sunroof</Text>
                                    <View style={{ width: windowWidth * (10 / 100), }}>
                                        <Text style={[styles.fontText3]}>{itemDetails[0]?.sunroof != true ? 'No' : 'Yes'}</Text>
                                    </View>
                                </View>
                                <View style={[styles.bidView2, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderRadius: 10, borderTopLeftRadius: 0, borderTopRightRadius: 0 }]}>
                                    <Text style={styles.fontText3}>Cruise Control</Text>
                                    <View style={{ width: windowWidth * (10 / 100), }}>
                                        <Text style={[styles.fontText3]}>{itemDetails[0]?.usb != true ? 'No' : 'Yes'}</Text>
                                    </View>
                                </View>
                            </>
                            :
                            <>
                                <View style={styles.bidView2}>
                                    <Text style={styles.fontText3}>ABS	</Text>
                                    <View style={{ width: windowWidth * (10 / 100), }}>
                                        <Text style={[styles.fontText3]}>{itemDetails[0]?.abs != true ? 'No' : 'Yes'}</Text>
                                    </View>
                                </View>
                                <View style={[styles.bidView2, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderRadius: 10, borderTopLeftRadius: 0, borderTopRightRadius: 0 }]}>
                                    <Text style={styles.fontText3}>Transmission</Text>
                                    <View style={{ width: windowWidth * (10 / 100), }}>
                                        <Text style={[styles.fontText3]}>{itemDetails[0]?.HP ? itemDetails[0]?.HP : 'NA'}</Text>
                                    </View>
                                </View>
                            </>
                    }


                </View>


            </ScrollView>
            <SupportButton />
        </SafeAreaView >
    )
}

export default WonSingleItemScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fontText1: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: getFontontSize(22),
        color: colours.primaryBlack,
        marginTop: 10
    },
    fontText2: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(16),
        color: colours.primaryBlack,
    },
    bidInfoContainer: {
        width: windowWidth * (90 / 100),
        borderRadius: 10,
        backgroundColor: colours.primaryWhite,
        alignItems: 'center',
        justifyContent: 'center',

    },
    fontText4: {
        fontFamily: 'Poppins-Regular',
        fontSize: getFontontSize(16),
        color: colours.primaryWhite,
    },
    bidView1: {
        width: windowWidth * (89 / 100),
        height: windowHeight * (5 / 100),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: colours.backgroundColor,
        borderWidth: 0.6,
        borderColor: colours.primaryGrey,
        justifyContent: 'center',
        padding: 10
    },
    fontText3: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(16),
        color: colours.primaryBlack
    },
    ButtonView: {
        height: windowHeight * (4 / 100),
        width: windowWidth * (30 / 100),
        backgroundColor: colours.secondaryBlue,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',

    }, bidViewTest: {
        width: windowWidth * (89 / 100),
        backgroundColor: colours.backgroundColor,
        borderBottomWidth: 0.6,
        borderRightWidth: 0.6,
        borderLeftWidth: 0.6,
        borderColor: colours.primaryGrey,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colours.primaryWhite,
        alignItems: 'center',
    },
    bidView2: {
        width: windowWidth * (89 / 100),
        height: windowHeight * (6 / 100),
        backgroundColor: colours.backgroundColor,
        borderBottomWidth: 0.6,
        borderRightWidth: 0.6,
        borderLeftWidth: 0.6,
        // borderWidth: 0.6,
        borderColor: colours.primaryGrey,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colours.primaryWhite,
        alignItems: 'center',
    },
    bidView3: {
        width: windowWidth * (89 / 100),
        height: windowHeight * (5 / 100),
        backgroundColor: colours.backgroundColor,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },


    vechileDescriptionBox: {
        width: windowWidth * (90 / 100),
        marginVertical: windowHeight * (2 / 100),

    },
    innervechileDescription: {
        width: windowWidth * (89 / 100),
        backgroundColor: colours.primaryWhite,
        padding: 10,
        borderWidth: 0.6,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    vechileText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: getFontontSize(18),
        color: colours.primaryBlack,
        marginVertical: windowWidth * (2 / 100)
    },
    navView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: windowHeight * (2 / 100)
    },
    navButton: {
        width: windowWidth * (40 / 100),
        height: windowHeight * (5 / 100),
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    navText: {
        fontFamily: 'Poppins-Regular',
        fontSize: getFontontSize(12),

    },
    conditionBox: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        width: windowWidth * (89 / 100),
        // height: windowHeight * (20 / 100),
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: colours.backgroundColor,
        borderBottomWidth: 0.6,
        borderRightWidth: 0.6,
        borderLeftWidth: 0.6,
        paddingBottom: 15,
        borderColor: colours.primaryGrey,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff'

    }
})