import { View, Text, SafeAreaView, ScrollView, StyleSheet, Dimensions, FlatList, Image, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import Header from '../components/Header';
import { LoaderContext } from '../Context/loaderContext';
import { getRefundHistory } from '../api';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import { AppContext } from '../Context/appContext';
import Refundcard from '../components/Refundcard';
import SupportButton from '../components/SupportButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const RefundHistory = ({ navigation }) => {

  const [refund, setRefund] = useState([]);
  const { showLoader } = React.useContext(LoaderContext);
  const [refresh, setRefresh] = useState(false);
  const { profile } = useContext(AppContext);

  useEffect(() => {
    getRefundDetails();
  }, [])

  const getRefundDetails = async () => {
    try {
      showLoader(true);
      let res1 = await getRefundHistory({
        sp: "getRefundList",
        userId:profile[0].customerId,
        isAdmin: 0
    })
      setRefund(res1);
      showLoader(false)
    } catch (e) {
      showLoader(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefresh(true),
      getRefundDetails();
    setTimeout(() => {
      setRefresh(false)
    }, 1000);
  })

  return (
    <SafeAreaView style={styles.container}>
    <Header backarrow logo navigation={navigation} />

    <View style={styles.head}>
      <Text style={styles.fontText1}>Refund History</Text>
    </View>

    <FlatList
      refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingBottom: 50, paddingTop: 15 }}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      showsHorizontalScrollIndicator={false}
      data={refund}
      ListEmptyComponent={
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={{ width: windowWidth * (70 / 100), height: windowWidth * (50 / 100) }}
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
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
       <Refundcard
        packName={item?.packName}
        date={item?.tranactionDate}
        amount={item?.packAmount}
        balanceAmount={item?.balanceAmount}
        transactionid={item?.tranactionId}
        id={item?.phClaimHistoryId}
        status={item?.isBalanceRefunded}
        aucName={item?.aucName}
       />
      )} />

    <SupportButton/>
  </SafeAreaView>
  )
}

export default RefundHistory
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
    width: windowWidth * (90 / 100),
    height: windowHeight * (6 / 100),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 5,
    marginTop: windowHeight * (2 / 100)

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
    width: windowWidth * (90 / 100),
    height: windowHeight * (8 / 100),
    borderColor: colours.lightGrey,
    borderWidth: 0.6,
    padding: 5
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