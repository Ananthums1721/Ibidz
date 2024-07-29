import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import Header from '../components/Header';
import colours from '../globals/colours';
import {getFontontSize} from '../globals/functions';
import {LoaderContext} from '../Context/loaderContext';
import {getPackageHis} from '../api';
import moment from 'moment';
import SupportButton from '../components/SupportButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const PackagePurchaseHistory = ({navigation}) => {
  const [paymenyHistory, setPaymenyHistory] = useState(null);
  const {showLoader} = React.useContext(LoaderContext);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getHistoryDetails();
  }, []);

  const getHistoryDetails = async () => {
    try {
      showLoader(true);
      let res1 = await getPackageHis();
      console.log(res1, 'RESPONSEEE');
      setPaymenyHistory(res1);
      showLoader(false);
    } catch (error) {
      showLoader(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />

      <View style={styles.head}>
        <Text style={styles.fontText1}>Package Purchase History</Text>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={getHistoryDetails} />
        }
        data={paymenyHistory}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              height: windowHeight * (65 / 100),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: windowWidth * (70 / 100),
                height: windowWidth * (50 / 100),
              }}
              source={require('../asset/images/nodata1.webp')}
            />
            <Text
              style={{
                fontFamily: 'Poppins-Bold',
                marginTop: '4%',
                color: colours.primaryBlack,
              }}>
              {'No Data Available'}
            </Text>
          </View>
        }
        renderItem={({item}) => (
          <View
            style={[
              styles.subboxText,
              {
                backgroundColor:
                  item.packValidity == 'Expired'
                    ? colours.lowRed
                    : colours.lowWhite,
              },
            ]}>
            <View style={styles.rowStyle}>
              <Text style={styles.fontText1}>{item.packName}</Text>
              <Text style={styles.fontText11}>{item.packValidity}</Text>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.fontText11}>₹{item.packAmount}</Text>
              <Text style={styles.fontText11}>
                {moment(item.orderDate).format('DD-MM-YYYY hh:mm a')}
              </Text>
            </View>
          </View>
        )}
      />
      <SupportButton />
    </SafeAreaView>
  );
};

export default PackagePurchaseHistory;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundColor,
    alignItems: 'center',
  },
  boxHeadings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.primaryColor,
    width: windowWidth * (96 / 100),
    height: windowHeight * (6 / 100),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: windowHeight * (2 / 100),
  },
  fontText10: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryBlack,
  },
  fontText11: {
    fontSize: getFontontSize(14),
    fontFamily: 'Proxima Nova Alt Bold',
    color: colours.primaryBlack,
  },
  subboxText: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.primaryWhite,
    width: windowWidth * (90 / 100),
    marginTop: 10,
    borderRadius: 5,
    borderColor: colours.lightGrey,
    borderWidth: 0.6,
  },
  rowStyle: {
    flexDirection: 'row',
    width: windowWidth * (90 / 100),
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
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
});
