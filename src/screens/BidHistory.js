import { View, Text, SafeAreaView, RefreshControl, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { getBidHistory, } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import { AppContext } from '../Context/appContext';
import moment from 'moment';
import { formatCurrency } from "react-native-format-currency";
import SupportButton from '../components/SupportButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BidHistory = ({ navigation, route }) => {
  const name = route?.params?.name ? route?.params?.name : '';

  const [bidHistory, setbidHistory] = useState('');
  const { showLoader } = React.useContext(LoaderContext);
  const { profile } = React.useContext(AppContext);
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    getBidDetails();
  }, [])

  const getBidDetails = async () => {
    try {
      showLoader(true);
      let res1 = await getBidHistory({
        sp: "getBidHistory",
        custId: profile[0].customerId,
        aucName: name
      })
      setbidHistory(res1);
      showLoader(false)
    } catch (error) {
      showLoader(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefresh(true),
      getBidDetails()
    setTimeout(() => {
      setRefresh(false)
    }, 1000);
  })

  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />


      <View style={styles.head}>
        <Text style={styles.fontText1}>Bid History</Text>
      </View>
      {
        bidHistory != '' ?
          <>
            <View style={styles.boxHeadings}>

              <Text style={[styles.fontText11, { width: windowWidth * (25 / 100) }]}>Bid Amount</Text>
              <Text style={[styles.fontText11, { width: windowWidth * (30 / 100), marginLeft: windowWidth * (2 / 100) }]}>Bid Time</Text>
              <Text style={[styles.fontText11, { width: windowWidth * (35 / 100) }]}>Auction Name</Text>

            </View>
            <FlatList
              refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
              style={{ width: windowWidth * (90 / 100), }}
              data={bidHistory}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.subboxText}>
                  <Text style={[styles.fontText10, { width: windowWidth * (25 / 100) }]} numberOfLines={2}>{formatCurrency({ amount: parseFloat(item?.bidAmount), code: "INR" })[0]}</Text>
                  <View style={{ width: windowWidth * (30 / 100) }}>
                    <Text numberOfLines={2} style={[styles.fontText10, { width: windowWidth * (30 / 100) }]}>{moment(item?.bidDate).format('Do-MMM-YYYY, h:mm a')}</Text>
                  </View>
                  <View style={{ width: windowWidth * (30 / 100), }}>
                    <Text style={[styles.fontText10]} numberOfLines={2}>{item?.auctionName}</Text>
                  </View>
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

export default BidHistory
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colours.backgroundColor,

  },
  boxHeadings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.primaryColor,
    width: windowWidth * (90 / 100),
    height: windowHeight * (6 / 100),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: windowHeight * (2 / 100),
  },
  fontText10: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryBlack,
    textAlign:'center'
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
    width: windowWidth * (90 / 100),
    height: windowHeight * (9 / 100),
    borderColor: colours.lightGrey,
    borderWidth: 0.6,
    padding: 5
  },
  head: {
    flexDirection: 'row',
    width: windowWidth * (90 / 100),
    marginTop: windowHeight * (2 / 100),
    // paddingHorizontal: 10,
  },
  fontText1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(20),
    color: colours.primaryBlack,
  },
})