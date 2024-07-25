import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Dimensions, RefreshControl, FlatList, Image } from 'react-native';
import { getVendorAuction } from '../api';
import Header from '../components/Header';
import VendorAuctionCard from '../components/VendorAuctionCard';
import { LoaderContext } from '../Context/loaderContext';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import { showIcon } from '../globals/icons';
import SupportButton from '../components/SupportButton';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ActiveAuction = ({ navigation }) => {

  const [activeAuctions, setActiveauctions] = useState('');
  const { showLoader } = React.useContext(LoaderContext);
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    getActiveAuctions();
  }, [])

  const getActiveAuctions = async () => {
    try {
      showLoader(true);
      let res1 = await getVendorAuction()
      setActiveauctions(res1);
      showLoader(false)
    } catch (error) {
      showLoader(false);
    }
  }


  const onRefresh = useCallback(() => {
    setRefresh(true),
      getActiveAuctions()
    setTimeout(() => {
      setRefresh(false)
    }, 1000);
  })

  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />

      <View style={styles.head}>
        <Text style={styles.fontText1}>Active Auctions</Text>
      </View>
      <FlatList
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 50, paddingTop: 15 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsHorizontalScrollIndicator={false}
        data={activeAuctions}
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

});

export default ActiveAuction;