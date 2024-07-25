import { View, Text, SafeAreaView, RefreshControl, StyleSheet, Dimensions, FlatList, Image } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import { LoaderContext } from '../Context/loaderContext';
import { getPaymentHistory } from '../api';
import moment from 'moment';
import SupportButton from '../components/SupportButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ClaimHistory = ({ navigation }) => {

  const [paymenyHistory, setPaymenyHistory] = useState('');
  const { showLoader } = React.useContext(LoaderContext);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getHistoryDetails();
  }, [])

  const getHistoryDetails = async () => {
    try {
      showLoader(true);
      let res1 = await getPaymentHistory()
      setPaymenyHistory(res1);
      showLoader(false)
    } catch (error) {
      showLoader(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefresh(true),
      getHistoryDetails();
    setTimeout(() => {
      setRefresh(false)
    }, 1000);
  })

  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />

      <View style={styles.head}>
        <Text style={styles.fontText1}>Package Redeem History</Text>
      </View>

      {
        paymenyHistory != '' ?
          <>
            <View style={styles.boxHeadings}>
            <Text style={[styles.fontText11, { width: windowWidth * (10 / 100) }]}>Id</Text>
              <Text style={[styles.fontText11, { width: windowWidth * (25 / 100) }]}>Redeem date</Text>
              <Text style={[styles.fontText11, { width: windowWidth * (30 / 100) }]}>Package Name</Text>
              <Text style={[styles.fontText11, { width: windowWidth * (25 / 100) }]}>Redeem Amount</Text>

            </View>
            <FlatList
              refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
              style={{ width: windowWidth * (96 / 100), }}
              data={paymenyHistory}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.subboxText}>
                  <Text numberOfLines={2} style={[styles.fontText10,{ width: windowWidth * (10 / 100) }]}>{item?.phHistoryId}</Text>
                  <Text numberOfLines={2} style={[styles.fontText10,{ width: windowWidth * (25/ 100) }]}>{moment(item?.packClaimDate).format('DD-MMM-YYYY hh:mm a')}</Text>
                  <Text numberOfLines={2} style={[styles.fontText10,{ width: windowWidth * (30 / 100) }]}>{item?.packName}</Text>
                  <Text numberOfLines={2} style={[styles.fontText10,{ width: windowWidth * (25 / 100) }]}>₹{item?.packAmount}</Text>

                </View>
              )}
            />
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
      <SupportButton />
    </SafeAreaView>
  )
}

export default ClaimHistory
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundColor,
    alignItems: "center",
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
    marginTop: windowHeight * (2 / 100)
  },
  fontText10: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryBlack,
    textAlign:'center',
  },
  fontText11: {
    fontSize: getFontontSize(14),
    fontFamily: 'Poppins-SemiBold',
    color: colours.primaryWhite,
    textAlign:'center'
  },
  subboxText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.primaryWhite,
    width: windowWidth * (96 / 100),
    borderColor: colours.lightGrey,
    borderWidth: 0.6,
    paddingVertical:5
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