import {
  View,
  Text,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import Header from '../components/Header';
import colours from '../globals/colours';
import {getFontontSize} from '../globals/functions';
import {showIcon} from '../globals/icons';
import {
  getDashBoardData,
  getPackageHis,
  getPackageListData,
  getProfileDetails,
  loginUser,
  deleteAccount,
  getNotification,
} from '../api';
import {LoaderContext} from '../Context/loaderContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppContext} from '../Context/appContext';
import Toast from 'react-native-simple-toast';
import LoginScreen from '../screens/LoginScreen';
import Modal from 'react-native-modal';
import AuthButton from '../components/AuthButton';
import {useFocusEffect} from '@react-navigation/native';
import RNRestart from 'react-native-restart';
import AutoScroll from '@homielab/react-native-auto-scroll';
import SupportButton from '../components/SupportButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Profile = ({navigation}) => {
  const {showLoader} = React.useContext(LoaderContext);
  const {profile} = React.useContext(AppContext);

  const [profiledata, setProfileData] = useState('');
  const [notificationData, setNotificationData] = useState('');
  const [dashBoardData, setDashBoardData] = useState('');
  const [packageList, setPackageList] = useState('');
  const {loadProfile} = useContext(AppContext);
  const [refresh, setRefresh] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // getProfile();
      // getDashBoardDetails();
      getPackageList();
    }, []),
  );

  const getProfile = async () => {
    try {
      showLoader(true);
      let res = await getProfileDetails();
      setProfileData(res);
      showLoader(false);
      let res1 = await getNotification();
      setNotificationData(
        res1[0]?.notificationName ? res1[0]?.notificationName : '',
      );
    } catch (e) {
      showLoader(false);
    }
  };

  const getPackageList = async () => {
    try {
      showLoader(true);
      let res = await getPackageListData();
      console.log('res============>', res);
      setPackageList(res);
      showLoader(false);
    } catch (e) {
      showLoader(false);
    }
  };

  const getDashBoardDetails = async () => {
    try {
      showLoader(true);
      let res1 = await getDashBoardData();
      setDashBoardData(res1.result1);
      showLoader(false);
    } catch (e) {
      showLoader(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefresh(true), getProfile();
    getDashBoardDetails();
    getPackageList();
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

  const deleteUser = async () => {
    try {
      let res = await deleteAccount();
      Toast.show('Account deleted successfully');
      await AsyncStorage.clear();
      RNRestart.Restart();
    } catch (error) {
      Toast.show('SOMETHING WENT WRONG');
    }
  };

  if (!profile[0]?.customerId) {
    return <LoginScreen navigation={navigation} />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <Header logo navigation={navigation} drawer />
      <ScrollView
        style={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 150,
        }}>
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
                {profiledata[0]?.custName ? profiledata[0]?.custName : ''}
              </Text>
              {packageList[0] != [] && packageList[0]?.packName ? (
                <Text style={styles.fontText2}>
                  Package:{packageList[0]?.packName}
                </Text>
              ) : null}
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
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
            }}>
            <View
              tyle={{
                width: windowWidth * (5 / 100),
                height: windowHeight * (5 / 100),
              }}>
              {showIcon('call', colours.primaryGrey, 18)}
            </View>
            <Text style={styles.fontText3}>
              {profiledata[0]?.custPhone ? profiledata[0]?.custPhone : ''}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              tyle={{
                width: windowWidth * (5 / 100),
                height: windowHeight * (5 / 100),
              }}>
              {showIcon('mail', colours.primaryGrey, 18)}
            </View>
            <Text style={styles.fontText3}>
              {profiledata[0]?.custEmail ? profiledata[0]?.custEmail : ''}
            </Text>
          </View>
        </View>

        <View style={styles.profileDataView}>
          <TouchableOpacity
            style={styles.profileDtatViewCon}
            onPress={() => navigation.navigate('Wishlist')}>
            <Text style={styles.fontText4}>{dashBoardData[0]?.Wishlisted}</Text>
            <View>
              <Text style={styles.fontText5}>Wishlisted</Text>
              <Text style={styles.fontText5}>Auctions</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileDtatViewCon}
            onPress={() => navigation.navigate('Winnings')}>
            <Text style={styles.fontText4}>{dashBoardData[0]?.Won}</Text>
            <View>
              <Text style={styles.fontText5}>Won</Text>
              <Text style={styles.fontText5}>Auctions</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileDtatViewCon}
            onPress={() => navigation.navigate('PaymentDues')}>
            <Text style={styles.fontText4}>
              {dashBoardData[0]?.paymentDues}
            </Text>
            <View>
              <Text style={styles.fontText5}>Payment</Text>
              <Text style={styles.fontText5}>Dues</Text>
            </View>
          </TouchableOpacity>
        </View>
        {notificationData && notificationData !== '' && (
          <AutoScroll style={styles.scrolling1} endPadding={50}>
            <Text style={[styles.fontText5, {color: colours.primaryBlack}]}>
              {notificationData}
            </Text>
          </AutoScroll>
        )}

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
          onPress={() => navigation.navigate('Bids')}>
          <View style={styles.menuCon}>
            {showIcon('bid', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Bids</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.componentView}
          onPress={() => navigation.navigate('Wishlist')}>
          <View style={styles.menuCon}>
            {showIcon('wishlist', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Wishlist</Text>
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
          onPress={() => navigation.navigate('Winnings')}>
          <View style={styles.menuCon}>
            {showIcon('winnings', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Winnings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.componentView}
          onPress={() => navigation.navigate('PaymentDues')}>
          <View style={styles.menuCon}>
            {showIcon('payment', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Payment Dues</Text>
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
          onPress={() => navigation.navigate('RefundHistory')}>
          <View style={styles.menuCon}>
            {showIcon('process', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Refund History</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.componentView}
          onPress={() => navigation.navigate('TestScreen')}>
          <View style={styles.menuCon}>
            {showIcon('process', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Test Scree</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.componentView}
          onPress={() => navigation.navigate('ChangePassword')}>
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
        <TouchableOpacity
          style={styles.componentView}
          onPress={() => setDeleteModal(true)}>
          <View style={[styles.menuCon, {backgroundColor: colours.primaryRed}]}>
            {showIcon('bin', colours.primaryBlack, 16)}
          </View>
          <Text style={styles.componentText}>Delete Account</Text>
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
      <Modal animationType="slide" visible={deleteModal} transparent={true}>
        <View style={{width: windowWidth, height: windowHeight}}>
          <View style={styles.updateModalView}>
            <Image
              source={require('../asset/logo/LogoB.png')}
              style={{
                height: windowWidth * (15 / 100),
                width: windowWidth * (80 / 100),
                resizeMode: 'contain',
              }}
            />
            <Text style={styles.headerText}>
              Are you sure, want to delete this account?
            </Text>
            <Text style={[styles.fontStyle2, {color: colours.primaryRed}]}>
              ( We will delete this account permanently )
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: windowWidth * (90 / 100),
                justifyContent: 'space-around',
              }}>
              <AuthButton
                BackgroundColor={colours.primaryRed}
                OnPress={() => {
                  setDeleteModal(false);
                }}
                ButtonText={'No'}
                ButtonWidth={40}
                ButtonHeight={5}
              />
              <AuthButton
                BackgroundColor={colours.primaryColor}
                OnPress={() => deleteUser()}
                ButtonText={'Yes'}
                ButtonWidth={40}
                ButtonHeight={5}
              />
            </View>
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
    backgroundColor: colours.backgroundColor,
    alignItems: 'center',
  },
  profileView: {
    width: windowWidth * (90 / 100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrolling1: {
    width: windowWidth,
    backgroundColor: colours.primaryYellow,
    padding: 10,
    marginBottom: 10,
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
    backgroundColor: colours.primaryYellow,
  },
  packageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    width: windowWidth * (90 / 100),
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
    height: windowHeight * (6 / 100),
    padding: windowWidth * (1 / 100),
    justifyContent: 'space-between',
    marginBottom: windowHeight * (4 / 100),
  },
  profileDataView: {
    width: windowWidth * (95 / 100),
    paddingVertical: windowHeight * (2 / 100),
    paddingHorizontal: windowWidth * (2.5 / 100),
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colours.lightBlue,
    marginTop: windowHeight * (4 / 100),
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
    fontSize: getFontontSize(14),
    color: colours.blue,
    textAlign: 'center',
  },
  package: {
    width: windowWidth * (40 / 100),
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
  updateModalView: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (30 / 100),
    marginTop: windowHeight * (70 / 100),
    paddingTop: windowHeight * (1 / 100),
    paddingBottom: windowHeight * (2 / 100),
    backgroundColor: colours.lowRed,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
