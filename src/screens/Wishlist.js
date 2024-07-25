import { View, Text, SafeAreaView, RefreshControl, StyleSheet, Dimensions, Image, FlatList } from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import Header from '../components/Header';
import { getWishList } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import { getFontontSize } from '../globals/functions';
import colours from '../globals/colours';
import BidCard from '../components/BidCard';
import SupportButton from '../components/SupportButton';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Wishlist = ({ navigation }) => {

  const { showLoader } = useContext(LoaderContext);
  const [wishData, setWishData] = useState([]);
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    getWishListData()
  }, [])

  const getWishListData = async () => {
    showLoader(true);
    setWishData([])
    try {
      let res = await getWishList();
      setWishData(res)
    } catch (e) {
    }
    showLoader(false);
  }


  const onRefresh = useCallback(() => {
      setRefresh(true),
      getWishListData()
      setTimeout(() => {
      setRefresh(false)
    }, 1000);
  })


  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />


      <View style={styles.head}>
        <Text style={styles.fontText1}>WishList</Text>
      </View>


      <FlatList
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 50, paddingTop: 15 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsHorizontalScrollIndicator={false}
        data={wishData}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View
            style={{
              width: windowWidth * (90 / 100),
              height: windowHeight * (50 / 100),
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
                // marginTop: '4%',
                color: colours.primaryBlack
              }}>
              {'No Data Available'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <BidCard
            id={item.vehId}
            image={item?.vehImage1}
            brandName={item?.brandName}
            modelName={item?.modelName}
            bidzCount={item?.bidzCount?item.bidzCount : 0}
            location={item?.locName}
            time={item?.actualMaturityDate}
            bidAmount={item.latestBidAmount}
            onRefresh={onRefresh}
            onpress={() => navigation.navigate('SingleItemScreen', { name: item?.aucName })}
          />
        )} />
      <SupportButton />
    </SafeAreaView>
  )
}

export default Wishlist
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colours.backgroundColor,

  },
  head: {
    flexDirection: 'row',
    width: windowWidth * (90 / 100),
    marginTop: windowHeight * (5 / 100),
  },
  fontText1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(20),
    color: colours.primaryBlack,
  },
  flatListView: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25
  },
})