import { View, Text, SafeAreaView, RefreshControl, StyleSheet, Dimensions, TouchableOpacity, FlatList, Image, } from 'react-native';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { getFontontSize } from '../globals/functions';
import colours from '../globals/colours';
import { showIcon } from '../globals/icons';
import WinCard from '../components/WinCard';
import { LoaderContext } from '../Context/loaderContext';
import { getclaimAmount, getWinnings } from '../api';
import SupportButton from '../components/SupportButton';




const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Winnings = ({ navigation }) => {

  const [winnings, setWinnings] = useState([]);
  const [claimAmount, setClaimAmount] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const { showLoader } = useContext(LoaderContext);

  useEffect(() => {
    getWinningsData();
    fetchclaimAmount();
  }, [])

  const getWinningsData = async () => {
    showLoader(true);
    setWinnings(null)
    try {
      let res = await getWinnings();
      setWinnings(res)
    } catch (e) {
    }
    showLoader(false);
  }

  const fetchclaimAmount = async () => {
    showLoader(true);
    try {
      let res = await getclaimAmount();
      const sumPackAmount = res.reduce((sum, item) => sum + item.packAmount, 0);
      setClaimAmount(sumPackAmount)
    } catch (e) {
    }
    showLoader(false);
  }

  const onRefresh = useCallback(() => {
    setRefresh(true),
      getWinningsData();
    fetchclaimAmount();
    setTimeout(() => {
      setRefresh(false)
    }, 1000);
  })
  if (winnings == null) return(
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />

      <View style={styles.head}>
        <Text style={styles.fontText1}>Winnings</Text>
      </View>
    </SafeAreaView>
  )
  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />

      <View style={styles.head}>
        <Text style={styles.fontText1}>Winnings</Text>
      </View>
      {
        winnings && winnings.length>0 && claimAmount >0 &&(
          <View style={styles.head}>
            <View style={styles.claimableBox}>
              <Text style={styles.fontText2}>Redeemable Amount RS {claimAmount}</Text>
            </View>
          </View>
        )
      }
      <FlatList
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 50, paddingTop: 15 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsHorizontalScrollIndicator={false}
        data={winnings}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              height: windowHeight*(70/100),
              alignItems: 'center',
            }}>
            <Image
              style={{ width: windowWidth * (90 / 100), height: windowWidth * (50 / 100) }}
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
          <WinCard
            id={item?.aucId}
            brandName={item?.aucName}
            bidAmount={item?.latestBidAmount}
            tokenAmount={item?.tokenAmount}
            balanceAmount={item?.balance}
            date={item?.actualMaturityDate}
            paymentStatus={item?.paymentStatus}
            salesStatus={item?.saleStatus}
            aucWonOtp={item?.aucWonOtp}
            otpStatus={item?.otpStatus}
            onReload={() => {
              getWinningsData();
              fetchclaimAmount();
            }}
            onpress={() => {
              if (item?.saleStatus != 'Rejected') {
                navigation.navigate('WonSingleItemScreen', { name: item?.aucName,id:item?.aucId })

              }
            }}
          />
        )} />

      <SupportButton />
    </SafeAreaView>
  )
}

export default Winnings
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundColor,
    alignItems: 'center'
  },
  head: {
    flexDirection: 'row',
    width: windowWidth * (90 / 100),
    marginTop: windowHeight * (3 / 100),
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  fontText1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(20),
    color: colours.primaryBlack,
  },
  claimableBox: {
    paddingHorizontal: windowWidth * (2 / 100),
    height: windowHeight * (5 / 100),
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colours.primaryWhite,
    borderColor: colours.secondaryBlue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  printBox: {
    width: windowWidth * (20 / 100),
    height: windowHeight * (5 / 100),
    borderRadius: 8,
    backgroundColor: colours.secondaryBlue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fontText2: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryBlack
  },
  fontText3: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(16),
    color: colours.primaryWhite
  },
  flatListView: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: windowHeight * (3 / 100)
  },
  modalView: {
    width: windowWidth * (90 / 100),
    backgroundColor: colours.primaryWhite,
    borderRadius: 10,
    padding: windowWidth * (2 / 100),
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalHeader: {
    alignItems: 'flex-end',
    width: windowWidth * (90 / 100),
    height: windowHeight * (2 / 100),
    marginBottom: 10,
  },
  boxHeadings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.primaryColor,
    width: windowWidth * (80 / 100),
    height: windowHeight * (6 / 100),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    marginTop: windowHeight * (2 / 100)
  },
  fontText10: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(14),
    color: colours.primaryBlack,
    width: windowWidth * (25 / 100),
  },
  subboxText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colours.primaryWhite,
    width: windowWidth * (80 / 100),
    height: windowHeight * (6 / 100),
    borderColor: colours.lightGrey,
    borderWidth: 0.6,
    padding: 10
  },

})
