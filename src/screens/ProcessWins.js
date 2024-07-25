import { View, Text, SafeAreaView, ScrollView, StyleSheet, Dimensions, FlatList, Image, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Header from '../components/Header';
import { LoaderContext } from '../Context/loaderContext';
import { getProcessWin } from '../api';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import SupportButton from '../components/SupportButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ProcessWins = ({ navigation }) => {

  const [process, setProcess] = useState([]);
  const { showLoader } = React.useContext(LoaderContext);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getProcessDetails();
  }, [])

  const getProcessDetails = async () => {
    try {
      showLoader(true);
      let res1 = await getProcessWin()
      setProcess(res1);
      showLoader(false)
    } catch (e) {
      showLoader(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefresh(true),
      getProcessDetails();
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
            <Text style={styles.fontText1}>Process Winnings</Text>
          </View>

          {
            process != '' ?
              <>
                <View style={styles.boxHeadings}>

                  <Text style={[styles.fontText11, { width: windowWidth * (35 / 100) }]}>Auction Name</Text>
                  <Text style={[styles.fontText11, { width: windowWidth * (25 / 100) }]}>Bid Amount</Text>
                  <Text style={[styles.fontText11, { width: windowWidth * (30 / 100) }]}>Modal Name</Text>

                </View>
                <FlatList
                  refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                  style={{ width: windowWidth * (90 / 100), }}
                  data={process}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.subboxText}>
                      <Text numberOfLines={2} style={[styles.fontText10, { width: windowWidth * (35 / 100) }]}>{item?.aucName}</Text>
                      <Text numberOfLines={1} style={[styles.fontText10, { width: windowWidth * (25 / 100) }]}>₹{item?.LatestBidAmount}</Text>
                      <Text style={[styles.fontText10, { width: windowWidth * (30 / 100), }]} numberOfLines={2}>{item?.modelName}</Text>
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
      <SupportButton/>
    </SafeAreaView>
  )
}

export default ProcessWins
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