import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList, ScrollView, Dimensions, Image, RefreshControl } from 'react-native';
import { getVendorProcessWin } from '../api';
import Header from '../components/Header';
import { LoaderContext } from '../Context/loaderContext';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import SupportButton from '../components/SupportButton';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ProcessWinners = ({ navigation }) => {

  const [processWinners, setProcessWinners] = useState([]);
  const { showLoader } = React.useContext(LoaderContext);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getVendorProcessDetails();
  }, [])

  const getVendorProcessDetails = async () => {
    try {
      showLoader(true);
      let res1 = await getVendorProcessWin()
      setProcessWinners(res1);
      showLoader(false)
    } catch (e) {
      showLoader(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefresh(true),
      getVendorProcessDetails();
    setTimeout(() => {
      setRefresh(false)
    }, 1000);
  })

  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />
      <ScrollView style={{ flex: 1, }}
        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 150 }}
      >
        <>

          <View style={styles.head}>
            <Text style={styles.fontText1}>Process Winners</Text>
          </View>

          {
            processWinners != '' ?
              <>
                <View style={styles.boxHeadings}>
                  <Text style={[styles.fontText11, { width: windowWidth * (35 / 100) }]}>Auction Name</Text>
                  <Text style={[styles.fontText11, { width: windowWidth * (25 / 100) }]}>Bid Amount</Text>
                  <Text style={[styles.fontText11, { width: windowWidth * (30 / 100) }]} numberOfLines={2}>Modal Name</Text>

                </View>
                <FlatList
                  refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                  style={{ width: windowWidth * (90 / 100), }}
                  data={processWinners}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.subboxText}>
                      <Text style={[styles.fontText10, { width: windowWidth * (35 / 100) }]} numberOfLines={2}>{item?.aucName}</Text>
                      <Text numberOfLines={1} style={[styles.fontText10, { width: windowWidth * (25 / 100) }]}>₹{item?.LatestBidAmount}</Text>
                      <Text style={[styles.fontText10, { width: windowWidth * (30 / 100), }]}>{item?.modelName}</Text>
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
                  {'No data found'}
                </Text>
              </View>
          }

        </>
      </ScrollView>
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
  boxHeadings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.primaryColor,
    width: windowWidth * (90 / 100),
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
    width: windowWidth * (90 / 100),
    paddingVertical: windowHeight * (1 / 100),
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

export default ProcessWinners;