import { View, Text, Image, SafeAreaView, RefreshControl, StyleSheet, Dimensions, FlatList } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import BidCard from '../components/BidCard';
import { LoaderContext } from '../Context/loaderContext';
import { getMyBidData } from '../api';
import { getFontontSize } from '../globals/functions';
import colours from '../globals/colours';
import VendorAuctionCard from '../components/VendorAuctionCard';
import SupportButton from '../components/SupportButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Bids = ({ navigation }) => {
  const [bids, setBids] = useState('');
  const { showLoader } = React.useContext(LoaderContext);
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    getDashBoardDetails();
  }, [])

  const getDashBoardDetails = async () => {
    try {
      showLoader(true);
      let res1 = await getMyBidData()
      setBids(res1);
      showLoader(false)
    } catch (error) {
      showLoader(false)
    }
  }


  const onRefresh = useCallback(() => {
    setRefresh(true),
      getDashBoardDetails()
    setTimeout(() => {
      setRefresh(false)
    }, 1000);
  })

  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />

      <View style={styles.head}>
        <Text style={styles.fontText1}>My Bids</Text>
      </View>

      <FlatList
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 50, paddingTop: 15 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsHorizontalScrollIndicator={false}
        data={bids}
        keyExtractor={item => item.id}
        ListEmptyComponent={
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
              {'No Data Found'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <>
            <VendorAuctionCard
              Data={item}
              auctionName={item?.aucName}
              image={item?.vehImage1}
              brandName={item?.brandName}
              modelName={item?.modelName}
              location={item?.locName}
              time={item?.actualMaturityDate}
              registerNumber={item?.vehRegNo}
              kmClocked={item.kmClocked}
              bidAmounts={item?.latestBidAmount}
              bidCount={item?.bidzCount}
              date={item?.actualMaturityDate}
              IncAmount={item?.aucMinBid}
              YourLastBid={item.myBidAmount}
              onRefresh={getDashBoardDetails}
              onpress={() => navigation.navigate('BidHistory', { name: item?.aucName })}
            />
          </>
        )} />



      <SupportButton />
    </SafeAreaView>
  )
}

export default Bids
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundColor,
    alignItems: 'center',
    // paddingHorizontal:10
  },
  flatListView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    //paddingHorizontal:10,
  },
  head: {
    flexDirection: 'row',
    width: windowWidth * (90 / 100),
    marginTop: windowHeight * (1 / 100),
  },
  fontText1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(20),
    color: colours.primaryBlack,
  },
})