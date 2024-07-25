import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Dimensions, RefreshControl, FlatList, Image } from 'react-native';
import { getVendorAuctionHistory } from '../api';
import Header from '../components/Header';
import VendorAuctionCard from '../components/VendorAuctionCard';
import { LoaderContext } from '../Context/loaderContext';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import { showIcon } from '../globals/icons';
import SupportButton from '../components/SupportButton';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AuctionHistory = ({ navigation }) => {

  const [auctionsHistory, setAuctionsHistory] = useState(null);
  const { showLoader, loading } = React.useContext(LoaderContext);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getAuctionHistory();
  }, [])

  const getAuctionHistory = async () => {
    try {
      showLoader(true);
      let res1 = await getVendorAuctionHistory()
      setAuctionsHistory(res1);
      showLoader(false)
    } catch (error) {
      showLoader(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />

      <View style={styles.head}>
        <Text style={styles.fontText1}>Auction History</Text>
      </View>

      <FlatList
        refreshControl={<RefreshControl refreshing={loading} onRefresh={()=>getAuctionHistory()} />}
        contentContainerStyle={{ paddingBottom: 50, paddingTop: 15 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsHorizontalScrollIndicator={false}
        data={auctionsHistory&&auctionsHistory}
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
          <VendorAuctionCard
            image={item?.vehImage1}
            brandName={item?.brandName}
            highBid={item.custName}
            modelName={item?.modelName}
            registerNumber={item?.vehRegNo}
            kmClocked={item.kmClocked}
            bidAmounts={item?.latestBidAmount}
            bidCount={item?.bidzCount}
            date={item?.actualMaturityDate}
            time={item?.actualMaturityDate}
            IncAmount={item?.aucMinBid}
            location={item?.locName}
            FromVendor
          />
        )} />

      <SupportButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colours.backgroundColor,

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
  flatListView: {
    // paddingHorizontal: 10,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: windowHeight * (3 / 100)
  },
});

export default AuctionHistory;