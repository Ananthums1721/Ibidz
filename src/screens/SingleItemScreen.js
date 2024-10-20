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
  PermissionsAndroid,
  Animated,
  Platform,
  Share,
  Alert,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import colours from '../globals/colours';
import {
  getBidNow,
  getItemDetails,
  getVechileType,
  biddedCustomerListForDetaislScreen,
} from '../api';
import Header from '../components/Header';
import {getFontontSize, getImage} from '../globals/functions';
import AuthButton from '../components/AuthButton';
import {showIcon, showImage} from '../globals/icons';
import {LoaderContext} from '../Context/loaderContext';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import {AppContext} from '../Context/appContext';
import FastImage from 'react-native-fast-image';
import TimerCard from '../components/TimerCard';
// import Carousel from 'react-native-snap-carousel';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {MaskedText} from 'react-native-mask-text';
import {formatCurrency} from 'react-native-format-currency';
import moment from 'moment';
import CurrencyInput from 'react-native-currency-input';
import LottieView from 'lottie-react-native';
import Carousel from 'react-native-reanimated-carousel';
import SupportButton from '../components/SupportButton';
import CONFIG from '../globals/config';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SingleItemScreen = ({navigation, route}) => {
  const acuname = route?.params?.name ? route?.params?.name : '';

  const scrollY = useRef(new Animated.Value(0)).current;
  const animationDuration = 30000; // Adjust this to control the scroll speed
  useEffect(() => {
    const startAutoScroll = () => {
      Animated.timing(scrollY, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: false,
      }).start(() => {
        scrollY.setValue(0);
        startAutoScroll();
      });
    };

    startAutoScroll();

    return () => {
      // Clean up the animation if the component unmounts
      scrollY.setValue(0);
    };
  }, []); // Em

  const [itemDetails, setItemDetails] = useState('');
  const [bidUserHistory, setBidUserHistory] = useState(null);
  const [vehicleData, setVehicleData] = useState('');
  const {showLoader} = React.useContext(LoaderContext);
  const [bidAmount, setBidAmount] = useState('');
  const [navOptions, setnavOptions] = useState('options');
  const [vehRegister, setvehRegister] = useState(0);

  const {profile} = useContext(AppContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [bidSuccessModal, setBidSuccessModal] = React.useState(false);

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    getDetails();
  }, []);
  const checkPermission = async value => {
    if (Platform.OS === 'ios') {
      downloadPDF(value);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'Storage Permission needed for download invoices',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadPDF(value);
        } else {
          Toast.show('Storage Permission Not Granted');
        }
      } catch (err) {}
    }
  };

  const downloadPDF = value => {
    const {config, fs} = ReactNativeBlobUtil;
    const {
      dirs: {DownloadDir, DocumentDir},
    } = ReactNativeBlobUtil.fs;
    const PictureDir = ReactNativeBlobUtil.fs.dirs.PictureDir;
    let date = new Date();
    let image_URL = getImage(value);
    let ext = '.pdf';
    const aPath = Platform.select({ios: DocumentDir, android: DownloadDir});
    const fPath =
      aPath + '/' + Math.floor(date.getTime() + date.getSeconds() / 2) + '.pdf';
    const options = Platform.select({
      ios: {
        fileCache: true,
        path: fPath,
        notification: true,
      },
      android: {
        fileCache: true,
        path: ReactNativeBlobUtil.fs.dirs.PictureDir + '/iBidz' + '.pdf',
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: 'iBidz Car Details PDF',
          description: 'PDF',
        },
      },
    });
    ReactNativeBlobUtil.config(options)
      .fetch('GET', image_URL)
      .then(res => {
        Toast.show('Download Completed');
        if (Platform.OS === 'ios') {
          RNFetchBlob.ios.openDocument(res.data);
        }
      });
  };
  const getDetails = async () => {
    setItemDetails('');
    showLoader(true);
    const iD = profile[0]?.customerId ? profile[0]?.customerId : 0;
    let res = await getItemDetails(acuname, iD);
    setItemDetails(res);
    let regNo = res[0]?.vehRegNo.split(' ');
    if (regNo.length === 3) {
      regNo[2] = '****';
      const regNumber = regNo.join('');
      setvehRegister(regNumber);
    }
    let stringifiedAmt = String(res[0]?.aucMinBid);
    setBidAmount(stringifiedAmt);
    let data = JSON.parse(res[0]?.vehicleImageList);
    setVehicleData(Object.values(data[0]));
    let res1 = await biddedCustomerListForDetaislScreen(acuname);
    setBidUserHistory(res1);

    const currentDate = new Date(); // Current date and time
    setIsExpired(currentDate > new Date(res[0]?.actualMaturityDate));
    showLoader(false);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const onRefresh = useCallback(() => {
    setRefresh(true), getDetails();
    setTimeout(() => {
      setRefresh(false);
    }, 1000);
  });

  const getbidNow = async () => {
    let bidAmt = parseInt(bidAmount);
    let aucMin = parseInt(itemDetails[0]?.aucMinBid);
    let aucMax = parseInt(itemDetails[0]?.aucMaxBid);
    if (bidAmt > aucMax) {
      Toast.show(
        `Bid amount should be less than or equal to maximum bid amount ${aucMax}`,
      );
    } else if (bidAmt < aucMin) {
      Toast.show(
        `Bid amount should be greater than or equal to minimum bid amount ${aucMin}`,
      );
    } else {
      let sumOfBidAmount = parseInt(itemDetails[0]?.latestBidAmount) + bidAmt;
      try {
        showLoader(true);
        if (bidAmt != '') {
          let res = await getBidNow({
            sp: 'spBid',
            custId: profile[0]?.customerId,
            aucId: itemDetails[0]?.aucId,
            bidAmount: sumOfBidAmount,
            userId: 0,
          });
          showLoader(false);
          // Toast.show('Successfully added bid');
          // setModalVisible(false);
          setBidSuccessModal(true);
          onRefresh();
          setTimeout(funCloseModal, 3000);
        }
      } catch (error) {
        showLoader(false);
        if (
          error.Message ==
          'Someone else might have placed a bid, Please refresh the page'
        ) {
          Toast.show(error?.Message ? error?.Message : 'Something went wrong');
          onRefresh();
        } else {
          Toast.show(error?.Message ? error?.Message : 'Something went wrong');
          setModalVisible(false);
          navigation.navigate('Packages');
        }
      }
    }
  };

  const funCloseModal = async () => {
    setModalVisible(false);
    setBidSuccessModal(false);
  };

  const _renderItem = ({item, index}) => {
    return (
      <View
        style={{
          height: windowHeight * (5 / 100),
          justifyContent: 'center',
          width: windowWidth * (83 / 100),
          justifyContent: 'center',
        }}>
        <Text
          style={[
            styles.fontStyle3,
            {
              color:
                bidUserHistory && bidUserHistory.length + 2 == index
                  ? colours.primaryGreen
                  : colours.primaryBlack,
              fontSize:
                bidUserHistory && bidUserHistory.length + 2 == index
                  ? getFontontSize(15)
                  : getFontontSize(12),
            },
          ]}>
          {bidUserHistory.length}.{index}
          {item.notificationName}
        </Text>
      </View>
    );
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'Share bid details',
        message: CONFIG.siteUrl + 'CarDetails/' + acuname,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
        style={{padding: windowWidth * (2 / 100)}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 20,
        }}>
        <View style={{width: windowWidth * (90 / 100)}}>
          {vehicleData && vehicleData.length > 0 ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: windowWidth,
              }}>
              <Carousel
                loop
                width={windowWidth * (90 / 100)}
                height={windowWidth * (60 / 100)}
                autoPlay={true}
                data={vehicleData}
                scrollAnimationDuration={1000}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ImageViewScreen', {
                        images: vehicleData,
                      });
                    }}>
                    <FastImage
                      style={{
                        width: windowWidth * (90 / 100),
                        height: windowWidth * (60 / 100),
                        borderRadius: 6,
                        resizeMode: 'contain',
                        backgroundColor: colours.primaryWhite,
                      }}
                      source={{
                        uri: getImage(item),
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  </TouchableOpacity>
                )}
              />
              {/* <Carousel
                  autoplay
                  data={vehicleData}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {
                      navigation.navigate('ImageViewScreen', { images: vehicleData })
                    }}>
                      <FastImage
                        style={{
                          width: windowWidth * (90 / 100),
                          height: windowWidth * (60 / 100),
                          borderRadius: 6,
                          resizeMode: 'contain',
                          backgroundColor: colours.primaryWhite
                        }}
                        source={{
                          uri: getImage(item),
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </TouchableOpacity>
                  )}
                  sliderWidth={windowWidth}
                  loop={true}
                  itemWidth={windowWidth}
                /> */}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: windowWidth * (10 / 100),
                  bottom: 0,
                }}
                onPress={() =>
                  navigation.navigate('ImageViewScreen', {images: vehicleData})
                }>
                {showIcon('expand', colours.blue, 20)}
              </TouchableOpacity>
            </View>
          ) : (
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
          )}
        </View>

        {/* <View > */}
        <Text style={styles.fontText1}>
          {itemDetails[0]?.brandName ? itemDetails[0]?.brandName : ''}
          <Text style={styles.fontText2}>
            {' '}
            {itemDetails[0]?.modelName ? itemDetails[0]?.modelName : ''}
          </Text>
          <Text style={[styles.fontText3]}> {itemDetails[0]?.manYear}</Text>
        </Text>

        {route?.params?.from !== 'Upcoming' && (
          <View style={styles.bidInfoContainer}>
            <View style={styles.bidView1}>
              <Text style={styles.fontText3}>BID INFORMATION</Text>
              <TouchableOpacity
                onPress={() => onShare()}
                style={{marginLeft: 10}}>
                {showImage('Share', 10)}
              </TouchableOpacity>
            </View>
            <View style={styles.bidView2}>
              <Text style={styles.fontText3}>Current Bid Amount </Text>
              <View style={{width: windowWidth * (40 / 100)}}>
                {/* <Text style={[styles.fontText3]}> {itemDetails[0]?.latestBidAmount ? itemDetails[0]?.latestBidAmount : ''} </Text> */}
                <Text style={[styles.fontText3]}>
                  {' '}
                  {
                    formatCurrency({
                      amount: itemDetails[0]?.latestBidAmount
                        ? itemDetails[0]?.latestBidAmount
                        : 0,
                      code: 'INR',
                    })[0]
                  }
                </Text>
              </View>
            </View>
            <View style={styles.bidView2}>
              <Text style={styles.fontText3}>Time Remaning</Text>

              {isExpired ? (
                <Text style={[styles.fontText3, {color: colours.primaryRed}]}>
                  Auction Expired
                </Text>
              ) : (
                itemDetails &&
                itemDetails[0]?.actualMaturityDate && (
                  <View
                    style={{
                      width: windowWidth * (40 / 100),
                      paddingVertical: 10,
                    }}>
                    <TimerCard
                      DealTo={itemDetails[0]?.actualMaturityDate}
                      FSize={15}
                    />
                    {/* <Text>{itemDetails[0]?.actualMaturityDate}</Text> */}
                  </View>
                )
              )}
            </View>
            <View
              style={[
                styles.bidView2,
                {
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                },
              ]}>
              <Text style={[styles.fontText3]}>Current Bids</Text>
              <View style={{width: windowWidth * (40 / 100)}}>
                <Text style={[styles.fontText3]}>
                  {itemDetails[0]?.bidzCount ? itemDetails[0]?.bidzCount : ''}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.bidView2,
                {
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                },
              ]}>
              <Text style={[styles.fontText3]}>Auction End Date</Text>
              <View style={{width: windowWidth * (40 / 100)}}>
                <Text style={[styles.fontText3]}>
                  {itemDetails[0]?.aucExtDate
                    ? moment(itemDetails[0]?.aucExtDate).format(
                        'DD-MMM-YYYY hh:mm a',
                      )
                    : ''}
                </Text>
              </View>
            </View>
          </View>
        )}
        {route?.params?.from == 'Upcoming' && (
          <View style={styles.bidView2}>
            <Text style={styles.fontText3}>Bid Starts From </Text>
            <View style={{width: windowWidth * (40 / 100)}}>
              {/* <Text style={[styles.fontText3]}> {itemDetails[0]?.latestBidAmount ? itemDetails[0]?.latestBidAmount : ''} </Text> */}
              <Text style={[styles.fontText3]}>
                {' '}
                {moment(
                  itemDetails[0]?.aucDate ? itemDetails[0]?.aucDate : 0,
                ).format('DD-MM-YYYY hh:mm a')}
              </Text>
            </View>
          </View>
        )}
        {/* </View> */}
        {bidUserHistory && bidUserHistory.length > 0 && (
          <View
            style={[
              styles.bidView2,
              {borderRadius: 10, height: windowHeight * (7 / 100)},
            ]}>
            <Carousel
              vertical={true}
              loop
              width={windowWidth * 90}
              height={windowHeight * (5 / 100)}
              autoPlay={true}
              // mode="parallax"
              data={bidUserHistory}
              scrollAnimationDuration={1000}
              renderItem={({item, index}) => (
                <View
                  style={{
                    paddingVertical: windowHeight * (0.5 / 100),
                    justifyContent: 'center',
                    width: windowWidth * (85 / 100),
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={[
                      styles.fontStyle3,
                      {
                        color:
                          bidUserHistory && bidUserHistory.length - 1 == index
                            ? colours.primaryGreen
                            : colours.primaryBlack,
                        fontSize:
                          bidUserHistory && bidUserHistory.length - 1 == index
                            ? getFontontSize(15)
                            : getFontontSize(12),
                      },
                    ]}>
                    {item.notificationName}
                  </Text>
                </View>
              )}
            />
            {/* <ScrollView nestedScrollEnabled contentContainerStyle={{paddingTop: windowHeight*(3/100)}}>
                {bidUserHistory.map((item, index) => (
                  <Animated.View key={index} style={{ transform: [{ translateY: Animated.multiply(scrollY, -(50*bidUserHistory.length)) }]}}>
                    <View style={{ paddingVertical: windowHeight*(0.5/100), justifyContent:
                    'center', width: windowWidth*(83/100), justifyContent:'center'}}>
                        <Text style={[styles.fontStyle3,{color: bidUserHistory && bidUserHistory.length-1 == index? colours.primaryGreen : colours.primaryBlack, fontSize: bidUserHistory && bidUserHistory.length-1 == index? getFontontSize(15):getFontontSize(12)  }]}>{ item.notificationName }</Text>
                    </View>
                  </Animated.View>
                ))}
              </ScrollView> */}
          </View>
        )}

        <View style={styles.vechileDescriptionBox}>
          <View
            style={[
              styles.bidView2,
              {
                borderTopWidth: 0.6,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              },
            ]}>
            <Text style={styles.fontText3}>Make</Text>
            <View style={{width: windowWidth * (40 / 100)}}>
              <Text style={[styles.fontText3]}>
                {itemDetails[0]?.brandName}
              </Text>
            </View>
          </View>

          <View style={styles.bidView2}>
            <Text style={styles.fontText3}>Model</Text>
            <View style={{width: windowWidth * (40 / 100)}}>
              <Text style={[styles.fontText3]}>
                {itemDetails[0]?.modelName}
              </Text>
            </View>
          </View>

          <View style={styles.bidView2}>
            <Text style={styles.fontText3}>Variant</Text>
            <View style={{width: windowWidth * (40 / 100)}}>
              <Text style={[styles.fontText3]}>{itemDetails[0]?.variant}</Text>
            </View>
          </View>

          <View style={styles.bidView2}>
            <Text style={styles.fontText3}>Registration</Text>
            <View style={{width: windowWidth * (40 / 100)}}>
              {/* <Text style={[styles.fontText3]}>{itemDetails[0]?.vehRegNo}</Text> */}
              <MaskedText
                mask={
                  isNaN(itemDetails[0]?.vehRegNo.charAt(2))
                    ? 'AAA ******'
                    : 'AA 99****'
                }
                style={styles.fontText2}>
                {itemDetails[0]?.vehRegNo}
              </MaskedText>
            </View>
          </View>

          <View style={styles.bidView2}>
            <Text style={styles.fontText3}>Insurance Type</Text>
            <View style={{width: windowWidth * (40 / 100)}}>
              <Text style={[styles.fontText3]}>
                {itemDetails[0]?.insuranceType}
              </Text>
            </View>
          </View>
          <View style={styles.bidView2}>
            <Text style={styles.fontText3}>Body Type</Text>
            <View style={{width: windowWidth * (40 / 100)}}>
              <Text style={[styles.fontText3]}>
                {itemDetails[0]?.vehTypeName}
              </Text>
            </View>
          </View>

          <View style={styles.bidView2}>
            <Text style={styles.fontText3}>Location</Text>
            <View style={{width: windowWidth * (40 / 100)}}>
              <Text style={[styles.fontText3]}>{itemDetails[0]?.locName}</Text>
            </View>
          </View>

          <View style={styles.bidView2}>
            <Text style={styles.fontText3}>KMs Driven</Text>
            <View style={{width: windowWidth * (40 / 100)}}>
              <Text style={[styles.fontText3]}>
                {itemDetails[0]?.kmClocked} KM
              </Text>
            </View>
          </View>

          <View style={[styles.bidView2]}>
            <Text style={styles.fontText3}>Year Of Make</Text>
            <View style={{width: windowWidth * (40 / 100)}}>
              <Text style={[styles.fontText3]}>{itemDetails[0]?.manYear}</Text>
            </View>
          </View>
          <View style={[styles.bidView2]}>
            <Text style={styles.fontText3}>Fuel Type</Text>
            <View style={{width: windowWidth * (40 / 100)}}>
              <Text style={[styles.fontText3]}>
                {itemDetails[0]?.fuelTypeName}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.bidView2,
              {
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderRadius: 10,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              },
            ]}>
            <Text style={styles.fontText3}>Ownership</Text>
            <View style={{width: windowWidth * (40 / 100)}}>
              <Text style={[styles.fontText3]}>
                {itemDetails[0]?.ownership
                  ? itemDetails[0].ownership
                  : 'Not Available'}
              </Text>
            </View>
          </View>
          {itemDetails[0]?.vehicleHistoryUrl ? (
            <View style={[styles.bidView2, {borderRadius: 10, marginTop: 10}]}>
              <Text style={styles.fontText3}>Vehicle History</Text>
              <TouchableOpacity
                style={{
                  width: windowWidth * (40 / 100),
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
                onPress={() =>
                  checkPermission(itemDetails[0]?.vehicleHistoryUrl)
                }>
                <Text style={[styles.fontText2, {color: colours.primaryGreen}]}>
                  Download{' '}
                </Text>
                <View
                  style={{
                    width: windowWidth * (3 / 100),
                    height: windowWidth * (3 / 100),
                    transform: [{rotate: '270deg'}],
                  }}>
                  {showIcon('download', colours.primaryBlue, 14)}
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <View style={styles.vechileDescriptionBox}>
          <View style={styles.innervechileDescription}>
            <Text style={styles.vechileText}>Vehicle Description</Text>
            {itemDetails[0]?.vehdescription ? (
              <Text style={styles.fontStyle7}>
                {itemDetails[0]?.vehdescription}
              </Text>
            ) : (
              ''
            )}

            <View style={styles.navView}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  {
                    backgroundColor:
                      navOptions == 'options'
                        ? colours.primaryColor
                        : colours.lowGrey,
                  },
                ]}
                onPress={() => setnavOptions('options')}>
                <Text
                  style={[
                    styles.navText,
                    {
                      color:
                        navOptions == 'options'
                          ? colours.primaryWhite
                          : colours.primaryBlack,
                    },
                  ]}>
                  Options and Features
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  {
                    backgroundColor:
                      navOptions != 'options'
                        ? colours.primaryColor
                        : colours.lowGrey,
                  },
                ]}
                onPress={() => setnavOptions('features')}>
                <Text
                  style={[
                    styles.navText,
                    {
                      color:
                        navOptions != 'options'
                          ? colours.primaryWhite
                          : colours.primaryBlack,
                    },
                  ]}>
                  Technical Specification
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {navOptions == 'options' ? (
            <>
              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>AC</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.AC != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>
              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Alloy Wheels</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.alloyWheels != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>

              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Anti Theft Device</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.antiTheftDevice != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>

              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Power Window</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.auxCompatibility != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>

              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Rear Wiper</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.bluetooth != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>

              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>
                  Comprehensive Navigation System
                </Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.navigationSystem != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>

              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Parking Sensors</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.parkingSensors != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>
              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Power steering</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.powerSteering != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>
              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Service History</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.serviceHistory != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>
              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Music System</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.FMRadio != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>
              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Rear Parking Camera</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.rearParkingCamera != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>
              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Sunroof</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.sunroof != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>
              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Under Warranty</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.underWarantee != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>
              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Accidental</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.accidental != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>
              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Roof AC</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.adjustableSteering != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>

              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Keyless Entry</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.keyLessEntry != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>
              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Remote Control</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.remoteControl != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>
              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>Certified Vehicle</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.vehicleCertified != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.bidView2,
                  {
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    borderRadius: 10,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  },
                ]}>
                <Text style={styles.fontText3}>Cruise Control</Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.usb != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.bidView2}>
                <Text style={styles.fontText3}>ABS </Text>
                <View style={{width: windowWidth * (10 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.abs != true ? 'No' : 'Yes'}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.bidView2,
                  {
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    borderRadius: 10,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  },
                ]}>
                <Text style={styles.fontText3}>Transmission</Text>
                <View style={{width: windowWidth * (20 / 100)}}>
                  <Text style={[styles.fontText3]}>
                    {itemDetails[0]?.HP ? itemDetails[0]?.HP : 'NA'}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
        <Modal isVisible={isModalVisible}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false), setBidSuccessModal(false);
                }}
                style={{
                  width: windowWidth * (8 / 100),
                  height: windowWidth * (8 / 100),
                }}>
                <View
                  style={{
                    width: windowWidth * (4 / 100),
                    height: windowHeight * (4 / 100),
                  }}>
                  {showIcon('close', colours.lightRed, windowWidth * (6 / 100))}
                </View>
              </TouchableOpacity>
            </View>
            {bidSuccessModal ? (
              <>
                <LottieView
                  source={require('../asset/lottie/bid.json')}
                  style={{
                    height: windowWidth * (30 / 100),
                    width: windowWidth * (30 / 100),
                  }}
                  autoPlay
                  loop
                />
                <Text style={styles.fontStyle2}>Bid Placed Successfully</Text>
              </>
            ) : (
              <>
                <Text style={styles.fontStyle2}>Enter your Bid Amount</Text>
                <View style={styles.buttonContainer}>
                  {itemDetails[0]?.latestBidAmount && (
                    <Text style={[styles.fontStyle6]}>
                      {
                        formatCurrency({
                          amount: itemDetails[0]?.latestBidAmount,
                          code: 'INR',
                        })[0]
                      }{' '}
                      +{' '}
                    </Text>
                  )}
                  <CurrencyInput
                    value={bidAmount}
                    placeholder={'Bid amount'}
                    onChangeValue={v => setBidAmount(v)}
                    prefix="₹"
                    delimiter=","
                    separator="."
                    precision={0}
                    style={styles.textImputStyle}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <AuthButton
                    OnPress={() => setModalVisible(false)}
                    ButtonText={'Cancel'}
                    ButtonWidth={40}
                  />
                  <AuthButton
                    OnPress={() =>
                      bidAmount == ''
                        ? Toast.show('Please enter an amount')
                        : getbidNow()
                    }
                    ButtonText={'Submit'}
                    ButtonWidth={40}
                  />
                </View>
              </>
            )}
          </View>
        </Modal>
        {/* <Modal isVisible={bidSuccessModal}>
          <View style={styles.modalView}>

            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setBidSuccessModal(false)} style={{
                width: windowWidth * (8 / 100),
                height: windowWidth * (8 / 100),
              }}>
                <View style={{ width: windowWidth * (4 / 100), height: windowHeight * (4 / 100) }}>{showIcon('close', colours.lightRed, windowWidth * (6 / 100))}</View>
              </TouchableOpacity>
            </View>

          </View>
        </Modal> */}
      </ScrollView>

      {route?.params?.from !== 'Upcoming' &&
        (profile[0]?.customerId ? (
          <View
            style={{
              paddingHorizontal: windowWidth * (5 / 100),
              paddingBottom: windowHeight * (2 / 100),
            }}>
            <AuthButton
              OnPress={() => toggleModal()}
              ButtonText={'Bid Now'}
              ButtonWidth={90}
            />
          </View>
        ) : (
          <View
            style={{
              paddingHorizontal: windowWidth * (5 / 100),
              paddingBottom: windowHeight * (2 / 100),
            }}>
            <AuthButton
              OnPress={() => navigation.navigate('LoginScreen')}
              ButtonText={'Bid Now'}
              ButtonWidth={90}
            />
          </View>
        ))}
      <SupportButton />
    </SafeAreaView>
  );
};

export default SingleItemScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fontText1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(22),
    color: colours.primaryBlack,
    marginTop: 10,
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
    marginVertical: windowHeight * (2 / 100),
  },
  textImputStyle: {
    width: windowWidth * (35 / 100),
    height: windowHeight * (6 / 100),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colours.lightWhite,
    borderRadius: 5,
    fontFamily: 'Proxima Nova Alt Bold',
    fontSize: getFontontSize(15),
    color: colours.primaryBlack,
    paddingHorizontal: 15,
  },
  bidView1: {
    width: windowWidth * (90 / 100),
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colours.backgroundColor,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  fontText3: {
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(16),
    color: colours.primaryBlack,
    width: windowWidth * (40 / 100),
  },
  fontStyle3: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontontSize(13),
    textAlign: 'center',
    color: colours.primaryGreen,
  },
  bidView2: {
    width: windowWidth * (90 / 100),
    backgroundColor: colours.backgroundColor,
    // borderBottomWidth: 0.6,
    // borderRightWidth: 0.6,
    // borderLeftWidth: 0.6,
    borderWidth: 0.5,
    borderColor: colours.lightWhite,
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
    justifyContent: 'space-between',
  },
  fontText4: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(12),
    color: colours.primaryBlack,
    left: 5,
  },
  modalView: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (30 / 100),
    backgroundColor: colours.primaryWhite,
    borderRadius: 10,
    padding: windowWidth * (2 / 100),
    alignItems: 'center',
  },

  modalHeader: {
    // flexDirection:"row",
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: windowWidth * (90 / 100),
    height: windowHeight * (4 / 100),
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colours.lowGrey,
  },
  fontStyle4: {
    fontSize: getFontontSize(16),
    color: colours.primaryBlack,
    fontFamily: 'Poppins-Medium',
  },
  fontStyle2: {
    fontSize: getFontontSize(18),
    color: colours.primaryBlack,
    fontFamily: 'Poppins-Bold',
    width: windowWidth * (80 / 100),
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: windowHeight * (2 / 100),
    flexDirection: 'row',
    width: windowWidth * (85 / 100),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  fontStyle6: {
    fontSize: getFontontSize(16),
    color: colours.primaryBlack,
    fontFamily: 'Proxima Nova Alt Semibold',
  },
  bidmodal: {
    width: windowWidth * (90 / 100),
    flexDirection: 'row',
    marginTop: windowWidth * (2 / 100),
    alignItems: 'center',
    paddingHorizontal: windowWidth * (5 / 100),
    justifyContent: 'space-around',
    // backgroundColor:'red'
  },
  bidText: {
    right: windowWidth * (30 / 100),
    width: windowWidth * (25 / 100),
    height: windowHeight * (4 / 100),

    borderWidth: 0.5,
    color: colours.primaryBlack,
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(8),
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: colours.lightWhite,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  vechileText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.primaryBlack,
    marginVertical: windowWidth * (2 / 100),
  },
  navView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: windowHeight * (2 / 100),
  },
  navButton: {
    width: windowWidth * (40 / 100),
    height: windowHeight * (5 / 100),
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(12),
  },
  fontStyle7: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryBlack,
    textAlign: 'justify',
  },
});
