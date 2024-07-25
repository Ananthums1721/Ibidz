import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Dimensions, View, Image, TouchableOpacity, Text, RefreshControl, ScrollView, FlatList, Modal, Linking, Platform } from 'react-native';
import { AppContext } from '../Context/appContext';
import { LoaderContext } from '../Context/loaderContext';
import { showImage, showIcon } from '../globals/icons';

import colours from '../globals/colours';
import { getFontontSize, getImage } from '../globals/functions';
import { getPolicies } from '../api';
import { getBanner , getHotAuctions, getTodaysHotAuctions, getVechileType, getPermiumHotAuctions, updateCheck } from '../api';
import DetailCard from '../components/DetailCard';
import BidCard from '../components/BidCard';
import Carousel from 'react-native-snap-carousel';
import DeviceInfo from 'react-native-device-info';
import AuthButton from '../components/AuthButton';
import SupportButton from '../components/SupportButton';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


const HomeScreen = ({ navigation }) => {

  // const { profile } = React.useContext(AppContext);
  const { showLoader } = React.useContext(LoaderContext);
  const [viewStatus, setViewStatus] = React.useState(false);
  const [alertModal, setAlertModal] = React.useState(false);
  const [hotPermiumAuctionData, setPermiumHotAuctionData] = useState('');
  const [bannerData, setBannerData] = useState([]);
  const [hotAuctionData, setHotAuctionData] = useState('');
  const [hotTodayAuctionData, setTodayHotAuctionData] = useState('');
  const [vechileData, setVechileData] = useState('');
  const numColums = 2;
  const [refresh, setRefresh] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = React.useState(false);
  const [appUpdateData, setAppUpdateData] = React.useState(null);
  const [policy, setPolicy] = React.useState([]);


  useFocusEffect(
    React.useCallback(() => {
        getBannerData()
        getVechile()
        fetchHotAuction()
        fetchTodaysHotAuction()
        fetchPermiumHotAuction()

        setTimeout(AppUpdateCheck, 5000);
    }, []),
  );


  const AppUpdateCheck = async() => {
    try{
      let res3 = await updateCheck(DeviceInfo.getVersion(),Platform.OS === 'ios'? 'ios' : "android", "Customer");
      setAppUpdateData(res3[0]);
      if(res3[0].versionCode != DeviceInfo.getVersion()){
        setUpdateModalVisible(true);
      }
    } catch(err){
    }
  }


  const getBannerData = async () => {
    showLoader(true)
    let res = await getBanner();
    setBannerData(res);
    let res1 = await getPolicies()
    setPolicy(res1.filter((item)=>(item.sKey == "commonInfoStripEn"||item.sKey == "commonInfoStripMal")));
    showLoader(false)
  }

  const getVechile = async () => {
    showLoader(true)
    let res3 = await getVechileType()
    setVechileData(res3);
    showLoader(false)
  }
  const fetchHotAuction = async () => {
    showLoader(true)
    let res1 = await getHotAuctions();
    setHotAuctionData(res1)
    showLoader(false)

  }
  const fetchTodaysHotAuction = async () => {
    showLoader(true)
    let res2 = await getTodaysHotAuctions();
    setTodayHotAuctionData(res2)
    showLoader(false)

  }
  const fetchPermiumHotAuction = async () => {
    showLoader(true)
    let res2 = await getPermiumHotAuctions();
    setPermiumHotAuctionData(res2)
    showLoader(false)

  }


  const renderBanners = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('AuctionList')}>
        <Image
          style={styles.bannerImage}
          source={{ uri: getImage(item.imageUrl)}}
        />
      </TouchableOpacity>
    );
  };

  const renderBanners1 = ({ item, index }) => {
    return (
      <View style={{
        width: windowWidth*(90/100),
        backgroundColor: colours.primaryBlue,
        paddingVertical:10,
        paddingHorizontal:10,
        borderRadius:10,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <Image
          style={{
            width: windowWidth*(10/100),
            height: windowWidth*(10/100),
            borderRadius:5,
            marginRight:10
          }}
          source={require('../asset/images/Warning.png')}
        />
        <Text style={[styles.detailText2,{width: windowWidth*(70/100)}]}>{item.sValue}</Text>
      </View>
    );
  };

  const onRefresh = useCallback(() => {
    setRefresh(true),
      getBannerData()
    getVechile()
    fetchHotAuction()
    fetchTodaysHotAuction()
    fetchPermiumHotAuction()
    setTimeout(() => {
      setRefresh(false)
    }, 1000);
  })


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstContainer}>
        <Image
          source={require('../asset/logo/LogoW.png')}
          style={{
            height: windowWidth * (30 / 100),
            width: windowWidth * (30 / 100),
            resizeMode: 'contain',
          }}
        />
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <View style={{ right: 5 }}>{showIcon('menu', colours.primaryWhite,)}</View>
        </TouchableOpacity>
      </View>
      <View style={styles.secondContainer}>
        <ScrollView
          refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', paddingBottom: windowHeight*(10/100) }}
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')} style={styles.searchContainer}>
            <View style={styles.searchView}>
              <View style={{ marginRight: windowWidth * (5 / 100) }}>{showIcon('search', colours.gray, 20)}</View>
              <Text style={styles.searchText}>LOOKING FOR A CAR?</Text>
            </View>
          </TouchableOpacity>
          <Carousel
            data={bannerData?.result1}
            renderItem={renderBanners}
            autoplay
            sliderWidth={windowWidth}
            itemWidth={windowWidth*(90/100)}
            loop={true}
          />
          {
              policy&&(
                  <Carousel
                    data={policy}
                    renderItem={renderBanners1}
                    autoplay
                    sliderWidth={windowWidth}
                    itemWidth={windowWidth*(90/100)}
                    loop={true}
                  />
              )
          }
          <Text>

          </Text>
          {hotPermiumAuctionData != '' ?
            <>
              <View style={styles.detailView}>
                <Text style={styles.detailText1}>Permium Auctions</Text>
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ width: windowWidth, paddingBottom: 10 }}
                ItemSeparatorComponent={() => <View style={{ marginTop: 15 }} />}
                data={hotPermiumAuctionData.slice(0, 4)}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                <BidCard
                  id={item.vehId}
                  image={item?.vehImage1}
                  brandName={item?.brandName}
                  modelName={item?.modelName}
                  location={item?.locName}
                  time={item?.actualMaturityDate}
                  premium={item?.isPremium}
                  YOM={item?.manYear}
                  bidzCount={item?.bidzCount}
                  bidAmount={item.latestBidAmount}
                  onpress={() => navigation.navigate('SingleItemScreen', { name: item?.aucName })}
                />
                )}

              />
              <AuthButton
                  BackgroundColor={colours.primaryColor}
                  OnPress={() => navigation.navigate('AuctionList',{Type: 'premium'})}
                  ButtonText={'View All'}
                  ButtonWidth={92}
              />
            </>
            :
            ''}
          <Carousel
            data={bannerData?.result2}
            renderItem={renderBanners}
            autoplay
            sliderWidth={windowWidth}
            itemWidth={windowWidth*(90/100)}
            loop={true}
          />


          {hotAuctionData != '' ?
            <>
              <View style={styles.detailView}>
                <Text style={styles.detailText1}>Live Auctions</Text>
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ width: windowWidth, paddingBottom: 10 }}
                ItemSeparatorComponent={() => <View style={{ marginTop: 15 }} />}
                data={hotAuctionData.slice(0, 4)}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                <BidCard
                  id={item.vehId}
                  image={item?.vehImage1}
                  brandName={item?.brandName}
                  modelName={item?.modelName}
                  location={item?.locName}
                  time={item?.actualMaturityDate}
                  premium={item?.isPremium}
                  bidzCount={item?.bidzCount?item.bidzCount : 0}
                  YOM={item?.manYear}
                  bidAmount={item.latestBidAmount}
                  onpress={() => navigation.navigate('SingleItemScreen', { name: item?.aucName })}
                />
                )}
              />
              <AuthButton
                  BackgroundColor={colours.primaryColor}
                  OnPress={() => navigation.navigate('AuctionList',{Type: 'auctions'})}
                  ButtonText={'View All'}
                  ButtonWidth={92}
              />
            </>
            :
            ''
          }
          {/* <View style={styles.detailView}>
            <Text style={styles.detailText1}>Car Types</Text>
          </View>
          <FlatList
            horizontal
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: windowWidth*(5/100), paddingVertical:10 }}
            data={vechileData}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('AuctionList')}
                style={styles.carTypeImgCon}>
                <Image style={styles.carTypeImg}
                  source={{ uri: getImage(item.imageUrl) }}
                />
              </TouchableOpacity>
            )}
          /> */}

          {
            hotTodayAuctionData != '' ?
              <>
                <View style={styles.detailView}>
                  <Text style={styles.detailText1}>Auctions Ends Soon</Text>

                  <TouchableOpacity onPress={() => navigation.navigate('AuctionList')} style={styles.innerdetailView}>
                    <Text style={styles.detailText2}>View All</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: "space-between" }}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={<View style={{ height: 15, }} />}
                  contentContainerStyle={{ width: windowWidth, paddingHorizontal: windowWidth*(5/100), paddingBottom: 10 }}
                  data={hotTodayAuctionData.slice(0, 4)}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <DetailCard
                      image={item.vehImage1}
                      name={item.brandName}
                      detailName={item.modelName}
                      location={item.locName}
                      speedtimer={item.kmClocked}
                      timer={item.actualMaturityDate}
                      onPress={() => navigation.navigate('SingleItemScreen', { name: item?.aucName })}
                    />
                  )}

                />
              </>
              :
              ''
          }

          <Carousel
            data={bannerData?.result3}
            renderItem={renderBanners}
            autoplay
            sliderWidth={windowWidth}
            itemWidth={windowWidth*(90/100)}
            loop={true}
          />


        </ScrollView>
        {/* </ImageBackground> */}
      </View>

      {
        appUpdateData&&(
          <Modal
            animationType="slide"
            visible={updateModalVisible}
            transparent={true}
          >
            <View style={{width:windowWidth, height: windowHeight, backgroundColor: 'rgba(100, 100, 100,0.3)'}}>
              <View style={styles.updateModalView1}>
                <Image
                    source={require('../asset/logo/LogoB.png')}
                    style={{
                        height: windowWidth * (20 / 100),
                        width: windowWidth * (80 / 100),
                        resizeMode: 'contain',
                    }}
                />
                <Text style={styles.headerText}>New version {appUpdateData.versionCode} available. Please update</Text>
                <View style={{flexDirection:'row', width:windowWidth*(90/100), justifyContent: 'space-around'}}>
                    {
                        appUpdateData&&appUpdateData.isCompulsory == false&&(
                        <AuthButton
                            BackgroundColor={colours.primaryRed}
                            OnPress={() => { setUpdateModalVisible(false) }}
                            ButtonText={'Cancel'}
                            ButtonWidth={40}
                        />
                        )
                    }
                    <AuthButton
                        BackgroundColor={colours.primaryColor}
                        OnPress={() => { appUpdateData.app_url != ""? Linking.openURL(appUpdateData.redirectUrl):null,setUpdateModalVisible(false) }}
                        ButtonText={'Update'}
                        ButtonWidth={40}
                    />
                </View>
              </View> 
            </View>
          </Modal>
        )
      }
      <SupportButton />
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundColor,
  },
  bannerImage: {
    width: windowWidth*(90/100),
    height: windowWidth * (30 / 100),
    borderRadius:10,
    marginTop: windowWidth*(5/100),
    marginHorizontal:0,
    borderWidth:0.5,
    borderColor: colours.lowGrey,
    resizeMode: 'cover'
    
  },
  brandImageCon: { 
    height: windowWidth * (14 / 100), 
    width: windowWidth * (14 / 100), 
    backgroundColor: 'transparent', 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 4
  },
  brandImage: {
    height: windowWidth * (14 / 100), 
    width: windowWidth * (14 / 100), 
    borderRadius: windowWidth * (14 / 100), 
    resizeMode: 'contain',
  },
  carTypeImgCon: { 
    height: windowWidth * (15 / 100), 
    width: windowWidth * (23 / 100), 
    backgroundColor: colours.primaryWhite,
    borderRadius:3,
    elevation: 4,
  },
  carTypeImg: {
    height: windowWidth * (15 / 100), 
    width: windowWidth * (23 / 100), 
    borderRadius:3,
    resizeMode: 'contain',
  },
  firstContainer: {
    backgroundColor: colours.darkBlack,
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
    flexDirection: 'row',
    height: windowHeight*(7/100),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: windowWidth*(5/100),
    marginBottom:10,
  },
  searchContainer: {
    height: windowHeight * (5 / 100),
    width: windowWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginTop: 10
  },
  secondContainer: {
    // backgroundColor: colours.lightRed,
    flex: 1,
  },
  searchView: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (6 / 100),
    backgroundColor: colours.primaryWhite,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: windowWidth * (5 / 100)
  },
  searchText: {
    width: windowWidth * (60 / 100),
    fontFamily: "Poppins-Regular",
    fontSize: getFontontSize(14),
    color: colours.gray,
  },

  detailView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: windowHeight * (2 / 100),
    width: windowWidth * (90 / 100),
  },
  detailText1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.primaryBlack
  },
  headerText:{
    fontFamily: "Poppins-SemiBold",
    fontSize: getFontontSize(15),
    color: colours.primaryBlack
  },
  detailText2: {
    fontFamily: "Poppins-SemiBold",
    fontSize: getFontontSize(12),
    color: colours.primaryWhite
  },
  innerdetailView: {
    backgroundColor: colours.secondaryBlue,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  brandView: {
    height: windowWidth * (16 / 100),
    width: windowWidth * (16 / 100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.primaryWhite,
    borderRadius: 35
  },
  updateModalView1: {
    height: windowHeight * (35 / 100),
    marginTop: windowHeight * (65 / 100),
    paddingTop: windowHeight * (1 / 100),
    paddingBottom: windowHeight * (2 / 100),
    backgroundColor: colours.primaryWhite,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    elevation: 10,
    alignItems: "center",
    justifyContent:'space-between'
  },

});

export default HomeScreen;


