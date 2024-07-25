import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Text, RefreshControl, Dimensions, FlatList, Image } from 'react-native';
import { getVendorLostAuction, reAuction } from '../api';
import Header from '../components/Header';
import LostCard from '../components/LostCard';
import { AppContext } from '../Context/appContext';
import { LoaderContext } from '../Context/loaderContext';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import Toast from 'react-native-simple-toast';
import SupportButton from '../components/SupportButton';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Lost = ({ navigation }) => {

  const [lostAuction, setLostAuction] = useState([]);
  const { showLoader, loading } = React.useContext(LoaderContext);
  const { profile } = React.useContext(AppContext);
  const [aucId, setAucID] = useState('');

  useEffect(() => {
    getVendorLostDetails();
  }, [])

  const getVendorLostDetails = async () => {
    showLoader(true);
    try {
      let res1 = await getVendorLostAuction()
      setLostAuction(res1);
      showLoader(false)
    } catch (e) {
      showLoader(false)
    }

  }


  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />

      <>

        <View style={styles.head}>
          <Text style={styles.fontText1}>Lost Auction</Text>
        </View>

        {
          lostAuction != '' ?
            <>
              <FlatList
                refreshControl={<RefreshControl refreshing={loading} onRefresh={()=>getVendorLostDetails()} />}
                contentContainerStyle={{ paddingBottom: 50, paddingTop: 15 }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                data={lostAuction}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <>
                    {setAucID(item?.aucId)}
                    <LostCard
                      brandname={item?.aucName}
                      registerno={item?.vehRegNo}
                      price={item?.vehPrice}
                      topbid={item?.latestBid}
                      minwin={item?.aucMinWinAmount}
                      startDate={item?.aucDate}
                      EndDate={item?.aucEndDate}
                      auctionStatus={item?.reauctionStatus}
                      isRequested={item?.isRequsted}
                      aucId={item?.aucId}
                      onFresh={()=>getVendorLostDetails()}
                    />
                  </>
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
                {'No data found'}
              </Text>
            </View>
        }

      </>
      <SupportButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundColor,
    alignItems: 'center'
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

export default Lost;