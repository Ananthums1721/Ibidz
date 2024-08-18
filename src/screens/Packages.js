import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Header from '../components/Header';
import {getFontontSize} from '../globals/functions';
import colours from '../globals/colours';
import LinearGradient from 'react-native-linear-gradient';
import {getAllPackages, razorPayInfo} from '../api';
import RazorpayCheckout from 'react-native-razorpay';
import {AppContext} from '../Context/appContext';
import {LoaderContext} from '../Context/loaderContext';
import Packagecard from '../components/Packagecard';
import SupportButton from '../components/SupportButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Packages = ({navigation}) => {
  const [packages, setPackages] = useState([]);
  const [packId, setPackId] = useState('');
  const [razorpayRes, setRazorpayRes] = useState('');
  const {showLoader} = React.useContext(LoaderContext);

  const {profile} = useContext(AppContext);

  useEffect(() => {
    getPackages();
  }, []);

  const getPackages = async () => {
    try {
      showLoader(true);
      let res = await getAllPackages();
      console.log(res, 'RESPONSE---->');
      setPackages(res);
      showLoader(false);
    } catch (error) {
      showLoader(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />

      <View style={styles.head}>
        <Text style={styles.fontText1}>Choose Packages</Text>
      </View>
      <FlatList
        contentContainerStyle={{
          width: windowWidth,
          paddingHorizontal: windowWidth * (5 / 100),
          paddingBottom: 50,
        }}
        ItemSeparatorComponent={
          <View style={{height: windowHeight * (2 / 100)}} />
        }
        data={packages}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <Packagecard
            packageName={item?.packName}
            packageAuction={item?.packAuctions}
            packageValidity={item?.packagValidityInDays}
            packageAmount={item?.packAmount}
            packageId={item?.packid}
            navigation={navigation}
            redemable={item.isRedeemable}
            packageMessage={item.packageMessage}
            packageTitleMessage={item.packTitleMsg}
            // onpress={()=>getPackages()}
          />
        )}
      />
      <SupportButton />
    </SafeAreaView>
  );
};

export default Packages;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundColor,
    alignItems: 'center',
  },
  head: {
    width: windowWidth * (90 / 100),
    marginVertical: windowHeight * (1 / 100),
    // paddingHorizontal: 10,
  },
  fontText1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(20),
    color: colours.primaryBlack,
  },
  fontText2: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(12),
    paddingVertical: 5,
    color: colours.lightBlue,
  },
  flatListView: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },

  packageBox: {
    width: windowWidth * (90 / 100),
    padding: 10,
    backgroundColor: colours.primaryWhite,
    borderRadius: 10,
    elevation: 2,
  },
  box1: {
    width: windowWidth * (85 / 100),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  linerBox: {
    width: windowWidth * (30 / 100),
    height: windowHeight * (10 / 100),
    backgroundColor: 'red',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontText3: {
    fontFamily: 'Poppins-Bold',
    fontSize: getFontontSize(20),
    color: colours.primaryWhite,
  },
  fontText4: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(16),
    color: colours.primaryBlack,
  },
  fontText5: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(14),
    color: colours.lightGrey,
  },
  fontText6: {
    fontFamily: 'Poppins-Bold',
    fontSize: getFontontSize(14),
    color: colours.lightGrey,
  },
});
