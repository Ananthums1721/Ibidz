import {
  View,
  Text,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import React, {useContext, useEffect, useState, useCallback} from 'react';
import Header from '../components/Header';
import colours from '../globals/colours';
import {getFontontSize} from '../globals/functions';
import {showIcon} from '../globals/icons';
import {LoaderContext} from '../Context/loaderContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppContext} from '../Context/appContext';
import Toast from 'react-native-simple-toast';
import {
  getIsPackageActive,
  getPackageListData,
  getVendorDashBoardData,
  getVendorProfile,
} from '../api';
import Modal from 'react-native-modal';
import AuthButton from '../components/AuthButton';
import {useFocusEffect} from '@react-navigation/native';
import SupportButton from '../components/SupportButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Profile = ({navigation}) => {
  const {showLoader} = React.useContext(LoaderContext);
  const [profiledata, setProfileData] = useState('');
  const [dashBoardData, setDashBoardData] = useState('');
  const {loadProfile} = useContext(AppContext);
  const [refresh, setRefresh] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [packageList, setPackageList] = useState([]);
  const [isPackage, setIsPackage] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getProfile();
      getDashBoardDetails();
      getPackageList();
      getPackageIsActive();
    }, []),
  );

  const getPackageIsActive = async () => {
    try {
      let response = await getIsPackageActive();
      console.log('getIsPackageActiveresponse===>', response);
      setIsPackage(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = async () => {
    try {
      showLoader(true);
      let res = await getVendorProfile();
      setProfileData(res);
      showLoader(false);
    } catch (e) {
      showLoader(false);
    }
  };

  const getDashBoardDetails = async () => {
    try {
      showLoader(true);
      let res1 = await getVendorDashBoardData();
      setDashBoardData(res1.result1);
      showLoader(false);
    } catch (e) {
      showLoader(false);
    }
  };

  const getPackageList = async () => {
    try {
      showLoader(true);
      let res = await getPackageListData();
      setPackageList(res);
      showLoader(false);
    } catch (e) {
      showLoader(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefresh(true), getProfile();
    getDashBoardDetails();
    setTimeout(() => {
      setRefresh(false);
    }, 1000);
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('profile');
    await AsyncStorage.removeItem('isOpenedBefore');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userType');
    await loadProfile();
    navigation.reset({
      index: 0,
      routes: [{name: 'SplashScreen'}],
    });
  };

  const reDirectPage = () => {
    if (isPackage[0]?.isPackageActive == 0) {
      Toast.show('Please buy a package to continue');
      navigation.navigate('Packages');
    } else {
      navigation.navigate('AddVehicle');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header logo navigation={navigation} />
      <ScrollView
        style={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 150,
        }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileView}>
          <View style={styles.iconView}>
            <View style={styles.profileIconView}>
              <Image
                style={styles.profileIconView}
                source={require('../asset/images/user2.png')}
              />
            </View>
            <View style={{marginLeft: windowWidth * (2 / 100)}}>
              <Text style={styles.fontText1}>
                {profiledata[0]?.sellerName ? profiledata[0]?.sellerName : ''}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('VendorEditProfile')}>
            <View
              style={{
                width: windowWidth * (5 / 100),
                height: windowHeight * (5 / 100),
                marginBottom: windowHeight * (5 / 100),
              }}>
              {showIcon('edit', colours.primaryGrey, 20)}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.contactBox}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 5,
            }}>
            <View style={styles.menuCon}>
              {showIcon('call', colours.primaryGrey, 18)}
            </View>
            <Text style={styles.fontText3}>
              {profiledata[0]?.sellerPhone ? profiledata[0]?.sellerPhone : ''}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 5,
            }}>
            <View style={styles.menuCon}>
              {showIcon('mail', colours.primaryGrey, 18)}
            </View>
            <Text style={styles.fontText3}>
              {profiledata[0]?.sellerEmail ? profiledata[0]?.sellerEmail : ''}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={styles.menuCon}>
              {showIcon('home', colours.primaryGrey, 18)}
            </View>
            <Text style={[styles.fontText3, {textAlign: 'justify'}]}>
              {profiledata[0]?.address ? profiledata[0]?.address : '---------'}
            </Text>
          </View>
        </View>

        <View style={styles.profileDataView}>
          <TouchableOpacity
            style={styles.profileDtatViewCon}
            onPress={() => navigation.navigate('ActiveAuction')}>
            <Text style={styles.fontText4}>{dashBoardData[0]?.active}</Text>
            <View>
              <Text style={styles.fontText5}>Active</Text>
              <Text style={styles.fontText5}>Auctions</Text>
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.profileDtatViewCon} >
            <Text style={styles.fontText4}>{dashBoardData[0]?.processWinning}</Text>
            <View>
              <Text style={styles.fontText5}>Process</Text>
              <Text style={styles.fontText5}>Winnings</Text>
            </View>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.profileDtatViewCon}
            onPress={() => navigation.navigate('WonCustomers')}>
            <Text style={styles.fontText4}>{dashBoardData[0]?.Won}</Text>
            <View>
              <Text style={styles.fontText5}>Won</Text>
              <Text style={styles.fontText5}>Customers</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileDtatViewCon}
            onPress={() => navigation.navigate('PendingPayment')}>
            <Text style={styles.fontText4}>
              {dashBoardData[0]?.paymentDues}
            </Text>
            <View>
              <Text style={styles.fontText5}>Pending</Text>
              <Text style={styles.fontText5}>Payments</Text>
            </View>
          </TouchableOpacity>
        </View>

        {packageList != '' ? (
          <View style={styles.packageBox}>
            <Text style={styles.fontText5}>
              {packageList[0]?.balancePackage}/{packageList[0]?.packAuctions}{' '}
              Auctions remaining
            </Text>
            <TouchableOpacity
              style={styles.package}
              onPress={() => {
                navigation.navigate('Packages');
              }}>
              <Text style={[styles.fontText5, {color: colours.primaryWhite}]}>
                Upgrade Now
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.packageBox}>
            <Text style={styles.fontText5}>No Package Available</Text>
            <TouchableOpacity
              style={styles.package}
              onPress={() => {
                navigation.navigate('Packages');
              }}>
              <Text style={[styles.fontText5, {color: colours.primaryWhite}]}>
                Purchase New
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.componentView}
          onPress={() => reDirectPage()}>
          <View style={styles.menuCon}>
            {showIcon('carPlus', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Add Vehicles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.componentView}
          onPress={() => navigation.navigate('Vehicle')}>
          <View style={styles.menuCon}>
            {showIcon('car', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Vehicles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.componentView}
          onPress={() => navigation.navigate('Packages')}>
          <View style={styles.menuCon}>
            {showIcon('packages', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Packages</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.componentView}
          onPress={() => navigation.navigate('PackagePurchaseHistory')}>
          <View style={styles.menuCon}>
            {showIcon('claim', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Package Purchase History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.componentView}
          onPress={() => navigation.navigate('ActiveAuction')}>
          <View style={styles.menuCon}>
            {showIcon('sandtimer', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Active Auctions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.componentView}
          onPress={() => navigation.navigate('AuctionHistory')}>
          <View style={styles.menuCon}>
            {showIcon('claim', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Auction History</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.componentView} onPress={() => navigation.navigate('ProcessWinners')} >
          <View style={styles.menuCon}>{showIcon('payment', colours.primaryBlack, 16)}</View>
          <Text style={styles.componentText}>Process Winners</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.componentView}
          onPress={() => navigation.navigate('WonCustomers')}>
          <View style={styles.menuCon}>
            {showIcon('winnings', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Won Customers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.componentView}
          onPress={() => navigation.navigate('PendingPayment')}>
          <View style={styles.menuCon}>
            {showIcon('pendingpayment', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Pending Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.componentView}
          onPress={() => navigation.navigate('ClaimHistory')}>
          <View style={styles.menuCon}>
            {showIcon('claim', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Package Redeem History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.componentView}
          onPress={() => navigation.navigate('PaymentHistory')}>
          <View style={styles.menuCon}>
            {showIcon('claim', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Payment History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.componentView}
          onPress={() => navigation.navigate('Lost')}>
          <View style={styles.menuCon}>
            {showIcon('lost', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Lost</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.componentView}
          onPress={() => navigation.navigate('VendorChangePassword')}>
          <View style={styles.menuCon}>
            {showIcon('changepwd', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.componentView}
          onPress={() => {
            toggleModal();
          }}>
          <View style={[styles.menuCon, {backgroundColor: colours.lightRed}]}>
            {showIcon('logout', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
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
          <Text style={styles.fontStyle2}>Do you want to logout?</Text>
          <View style={styles.buttonContainer}>
            <AuthButton
              OnPress={() => setModalVisible(false)}
              ButtonText={'Cancel'}
              ButtonWidth={40}
            />
            <AuthButton
              OnPress={() => {
                handleLogout();
                navigation.navigate('SplashScreen');
                Toast.show('Logout successfully');
              }}
              ButtonText={'Logout'}
              ButtonWidth={40}
              FirstColor={colours.primaryRed}
              SecondColor={colours.primaryRed}
            />
          </View>
        </View>
      </Modal>
      <SupportButton />
    </SafeAreaView>
  );
};

export default Profile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colours.backgroundColor,
    backgroundColor: '#E3E3E3',
    alignItems: 'center',
  },
  profileView: {
    width: windowWidth * (90 / 100),
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    windowWidth: windowWidth * (20 / 100),
    padding: 2,
  },
  profileIconView: {
    width: windowWidth * (15 / 100),
    height: windowWidth * (15 / 100),
    borderRadius: 30,
    backgroundColor: colours.blue,
  },
  fontText1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.primaryBlue,
  },
  fontText2: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontontSize(13),
    color: colours.textGray,
  },
  fontText3: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontontSize(14),
    color: colours.textGray,
    marginLeft: windowWidth * (2 / 100),
  },
  contactBox: {
    width: windowWidth * (90 / 100),
  },
  profileDataView: {
    width: windowWidth * (95 / 100),
    paddingVertical: windowHeight * (2 / 100),
    paddingHorizontal: windowWidth * (2.5 / 100),
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colours.lightBlue,
    marginTop: windowHeight * (2 / 100),
    marginBottom: windowHeight * (2 / 100),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileDtatViewCon: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: colours.primaryWhite,
    width: windowWidth * (28 / 100),
    height: windowWidth * (25 / 100),
    borderRadius: 3,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 6.68,
    shadowColor: colours.primaryColor,
    elevation: 7,
  },
  fontText4: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(24),
    color: colours.primaryBlack,
  },
  fontText5: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontontSize(13),
    textAlign: 'center',
    color: colours.blue,
  },
  package: {
    width: windowWidth * (50 / 100),
    height: windowHeight * (4 / 100),
    borderRadius: 5,
    backgroundColor: colours.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  componentView: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (6 / 100),
    marginTop: windowHeight * (1 / 100),
    backgroundColor: colours.primaryWhite,
    paddingHorizontal: windowHeight * (0.5 / 100),
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuCon: {
    width: windowHeight * (5 / 100),
    height: windowHeight * (5 / 100),
    marginRight: windowWidth * (3 / 100),
    backgroundColor: colours.lowBlue,
    borderRadius: 3,
  },
  componentText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(16),
    color: colours.primaryBlack,
    marginLeft: 5,
  },
  packagehistView: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (6 / 100),
    padding: 5,
    flexDirection: 'row',
    backgroundColor: colours.primaryColor,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fontText6: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontontSize(14),
    color: colours.primaryWhite,
    width: windowWidth * (15 / 100),
  },
  fontText7: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(12),
    color: colours.primaryBlack,
    width: windowWidth * (20 / 100),
  },
  fontText8: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(16),
    color: colours.primaryBlack,
    padding: 5,
  },
  historyBox: {
    width: windowWidth * (90 / 100),
    paddingVertical: windowHeight * (1 / 100),
    backgroundColor: colours.primaryWhite,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontText9: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(12),
    color: colours.primaryBlue,
  },
  navView: {
    width: windowWidth * (85 / 100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  boxHeadings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.lightGrey,
    width: windowWidth * (85 / 100),
    height: windowHeight * (6 / 100),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 5,
  },
  fontText10: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryBlack,
    width: windowWidth * (30 / 100),
  },
  subboxText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.primaryWhite,
    width: windowWidth * (85 / 100),
    height: windowHeight * (6 / 100),
    borderColor: colours.lightGrey,
    borderWidth: 0.6,
    padding: 5,
  },

  modalView: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (20 / 100),
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
    color: colours.primaryGrey,
    fontFamily: 'Poppins-Medium',
  },
  fontStyle2: {
    fontSize: getFontontSize(18),
    color: colours.primaryGrey,
    fontFamily: 'Poppins-Bold',
    width: windowWidth * (80 / 100),
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: windowHeight * (2 / 100),
    flexDirection: 'row',
    width: windowWidth * (85 / 100),
    justifyContent: 'space-around',
  },
  fontStyle6: {
    fontSize: getFontontSize(16),
    color: colours.primaryGrey,
    fontFamily: 'Poppins-SemiBold',
    width: windowWidth * (80 / 100),
  },
  packageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    width: windowWidth * (90 / 100),
  },
});
