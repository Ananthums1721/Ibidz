import { View, Text, SafeAreaView, RefreshControl, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { getPaymentDues } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import SupportButton from '../components/SupportButton';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PaymentDues = ({ navigation }) => {

  const [paymenydues, setPaymenydues] = useState('');
  const { showLoader } = React.useContext(LoaderContext);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getPaymentDetails();
  }, [])

  const getPaymentDetails = async () => {
    try {
      showLoader(true);
      let res1 = await getPaymentDues()
      setPaymenydues(res1);
      showLoader(false)
    } catch (error) {
      showLoader(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefresh(true),
      getPaymentDetails();
    setTimeout(() => {
      setRefresh(false)
    }, 1000);
  })

  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />


      <View style={styles.head}>
        <Text style={styles.fontText1}>Payment Dues</Text>
      </View>
      {
        paymenydues != '' ?
          <>
            <View style={styles.boxHeadings}>
              <Text style={[styles.fontText11, { width: windowWidth * (9 / 100) }]}>Id</Text>
              <Text numberOfLines={2} style={[styles.fontText11, { width: windowWidth * (30 / 100) }]}>Auction Name</Text>
              <Text numberOfLines={2} style={[styles.fontText11, { width: windowWidth * (25 / 100) }]}>Bid Amount</Text>
              <Text numberOfLines={2} style={[styles.fontText11, { width: windowWidth * (30 / 100) }]}>Model Name</Text>

            </View>
            <FlatList
              refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
              style={{ width: windowWidth * (96 / 100), }}
              data={paymenydues}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.subboxText}>
                  <Text numberOfLines={2} style={[styles.fontText10, { width: windowWidth * (9 / 100) , paddingHorizontal:1 }]}>{item?.aucId}</Text>
                  <Text numberOfLines={2} style={[styles.fontText10, { width: windowWidth * (30 / 100), paddingHorizontal:2 }]}>{item?.aucName}</Text>
                  <Text numberOfLines={2} style={[styles.fontText10, { width: windowWidth * (25 / 100) }]}>₹{item?.latestBidAmount}</Text>
                  <Text numberOfLines={2} style={[styles.fontText10, { width: windowWidth * (30 / 100) }]}>{item?.modelName}</Text>
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

export default PaymentDues
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundColor,
    alignItems: 'center'
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
    fontSize: getFontontSize(12),
    color: colours.primaryBlack,
    textAlign: 'center',
  },
  fontText11: {
    fontSize: getFontontSize(13),
    fontFamily: 'Poppins-SemiBold',
    color: colours.primaryWhite,
    textAlign: 'center'
  },
  subboxText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.primaryWhite,
    width: windowWidth * (96 / 100),
    paddingVertical: windowHeight * (1 / 100),
    borderColor: colours.lightGrey,
    borderWidth: 0.6,
  },
  head: {
    flexDirection: 'row',
    width: windowWidth * (96 / 100),
    marginTop: windowHeight * (5 / 100),
    // paddingHorizontal: 10,
  },
  fontText1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(20),
    color: colours.primaryBlack,
  },
})