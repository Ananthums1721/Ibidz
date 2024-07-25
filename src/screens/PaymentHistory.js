import React, { useState, useEffect ,useCallback} from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList, RefreshControl, Dimensions, Image, TouchableOpacity } from 'react-native';
import { getVendorPaymentHistory, } from '../api';
import Header from '../components/Header';
import VendorPaymentHistoryCard from '../components/VendorPaymentHistoryCard';
import { LoaderContext } from '../Context/loaderContext';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import { showIcon, showImage } from '../globals/icons';
import SupportButton from '../components/SupportButton';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PaymentHistory = ({ navigation }) => {

  const [paymentHistory, setpaymentHistory] = useState([]);
  const { showLoader } = React.useContext(LoaderContext);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getVendorPaymentDetails();
  }, [])

  const getVendorPaymentDetails = async () => {
    try {
      showLoader(true);
      let res1 = await getVendorPaymentHistory()
      setpaymentHistory(res1);
      showLoader(false)
    } catch (e) {
      showLoader(false)
    }
  }


  const onRefresh = useCallback(() => {
    setRefresh(true),
      getVendorPaymentDetails();
    setTimeout(() => {
      setRefresh(false)
    }, 1000);
  })

  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />

      <>

        <View style={styles.head}>
          <Text style={styles.fontText1}>Payment History</Text>
        </View>

        {
          paymentHistory != '' ?
            <>
              <FlatList
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                contentContainerStyle={{ paddingBottom: 50, paddingTop: 15 }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                data={paymentHistory}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <VendorPaymentHistoryCard
                    brandname={item?.aucName}
                    winAmount={item?.myBidAmount}
                    commissionstatus={item?.CommissionPaymentStatus}
                    commission={item?.tokenamount}
                    balanceAmount={item?.balance}
                  />
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

})

export default PaymentHistory;