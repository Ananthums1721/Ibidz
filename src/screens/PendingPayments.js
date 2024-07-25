import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList, RefreshControl, Dimensions, Image, TouchableOpacity, ToastAndroid, } from 'react-native';
import { getVendorPendingPayment, pendingPaymentVendor } from '../api';
import Header from '../components/Header';
import VendorPendingPaymentCard from '../components/VendorPendingPaymentCard';
import { LoaderContext } from '../Context/loaderContext';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import { showIcon } from '../globals/icons';
import AuthButton from '../components/AuthButton';
import Modal from "react-native-modal";
import Toast from 'react-native-simple-toast';
import { AppContext } from '../Context/appContext';
import SupportButton from '../components/SupportButton';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PendingPayments = ({ navigation, data }) => {

  const { profile } = React.useContext(AppContext);
  const [pendingPayment, setpendingPayment] = useState([]);
  const { showLoader } = React.useContext(LoaderContext);
  const [refresh, setRefresh] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [payedAmount, setPayedAmount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedId, setSelectedId] = useState(0);


  useEffect(() => {
    getVendorPendingPaymentDetails();
  }, [])

  const getVendorPendingPaymentDetails = async () => {
    try {
      showLoader(true);
      let res1 = await getVendorPendingPayment()
      setpendingPayment(res1);
      showLoader(false)
    } catch (e) {
      showLoader(false)
    }
  }


  const onRefresh = useCallback(() => {
    setRefresh(true),
      getVendorPendingPaymentDetails();
    setTimeout(() => {
      setRefresh(false)
    }, 1000);
  })



  const toggleItemSelection = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
      setSelectedId(...selectedItems, itemId);

    }
  };

  const selectAll = () => {
    const allItemIds = pendingPayment.map((item) => item.aucid);
    setSelectedItems(allItemIds);
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const selectedTokenAmount = selectedItems.reduce((total, itemId) => {
    const selectedItem = pendingPayment.find((item) => item.aucid === itemId);
    return total + (selectedItem ? selectedItem.tokenamount : 0);
  }, 0);


  const handleConfirm=async()=>{
    try {
      showLoader(true);
      let res1 = await pendingPaymentVendor({
        sp: "payCommissions",
        sellerId: profile[0].sellerId,
        commissionAmount: selectedTokenAmount,
        aucIds:selectedId
    })
      setModalVisible(false);
      getVendorPendingPaymentDetails();
      showLoader(false)
    } catch (e) {
      showLoader(false)
    }
  }


  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header backarrow logo navigation={navigation} />

        <>

          <View style={styles.head}>
            <Text style={styles.fontText1}>Pending Payments</Text>
          </View>

          {
            pendingPayment != '' || pendingPayment.length !==0 ?
              <>
                <View style={[styles.box2]}>
                  <TouchableOpacity style={[styles.touchable2, { backgroundColor: colours.primaryGreen }]}
                    onPress={() => selectAll()}>
                    <Text style={styles.fontText3}>Select all</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.touchable2, { width: windowWidth * (30 / 100), backgroundColor: colours.primaryOrange }]}
                    onPress={() => clearSelection()}>
                    <Text style={styles.fontText3}>Clear Selected</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.touchable2, { width: windowWidth * (35 / 100) }]} onPress={() => {
                    selectedItems&&selectedItems.length>0 ?
                      toggleModal()
                      :
                      Toast.show('Please select pending payments')
                  }
                  }>
                    <Text style={styles.fontText3}>Pay Commission</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                  contentContainerStyle={{ paddingBottom: 50, paddingTop: 20 }}
                  ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                  data={pendingPayment}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <VendorPendingPaymentCard
                      brandname={item?.aucName}
                      winAmount={item?.myBidAmount}
                      commission={item?.tokenamount}
                      balanceAmount={item?.balance}
                      isSelected={selectedItems.includes(item.aucid)}
                      onSelect={()=>toggleItemSelection(item.aucid)}
                      item={item}
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
      <Modal
        isVisible={isModalVisible} >
        <View style={styles.modalView}>

          <View style={styles.modalHeader}>
            <Text style={styles.fontText1}>Please Confirm</Text>

            <TouchableOpacity onPress={() => setModalVisible(false)} >
              <View style={{
                width: windowWidth * (5 / 100),
                height: windowWidth * (5 / 100),
                right: windowWidth * (2 / 100)
              }}>{showIcon('close', colours.lightRed, windowWidth * (6 / 100))}</View>
            </TouchableOpacity>
          </View>
          <Text style={styles.fontText2}>Please confirm that you want to pay commission of RS {selectedTokenAmount}.</Text>
          <View style={{ marginTop: 15, flexDirection: 'row', width: windowWidth * (90 / 100), alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>
            <AuthButton
              OnPress={() => setModalVisible(!isModalVisible)}
              ButtonText={'Cancel'}
              ButtonWidth={35}
              FirstColor={colours.primaryRed}
              SecondColor={colours.primaryRed}
            />
            <AuthButton
            OnPress={() => handleConfirm()}
              ButtonText={'Confirm'}
              ButtonWidth={35}
              FirstColor={colours.primaryGreen}
              SecondColor={colours.primaryGreen}
            />
          </View>
        </View>
      </Modal>
    </>
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
  fontText2: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(16),
    color: colours.primaryBlack,
  },
  fontText3: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontontSize(14),
    color: colours.primaryWhite,
    paddingBottom:0
  },
  box2: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (4 / 100),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: windowHeight * (2 / 100)
  },
  touchable2: {
    height: windowHeight * (4 / 100),
    paddingHorizontal: windowWidth * (2 / 100),
    backgroundColor: colours.secondaryBlue,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row"
  },
  modalView: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (30 / 100),
    backgroundColor: colours.primaryWhite,
    borderRadius: 10,
    padding: windowWidth * (2 / 100),
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: windowWidth * (90 / 100),
    height: windowHeight * (6 / 100),
    flexDirection: 'row',
    padding: 10
  },
})

export default PendingPayments;