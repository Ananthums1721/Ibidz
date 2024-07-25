import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  RefreshControl,
} from 'react-native';
import React, {useContext, useEffect, useState, useCallback} from 'react';
import Header from '../components/Header';
import colours from '../globals/colours';
import {getFontontSize} from '../globals/functions';
import {
  getSearchData,
  getFilterData,
  getUpcomingauctionList,
  getPermiumHotAuctions,
} from '../api';
import {LoaderContext} from '../Context/loaderContext';
import BidCard from '../components/BidCard';
import {showIcon} from '../globals/icons';
import {AppContext} from '../Context/appContext';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-toast-message'
import SupportButton from '../components/SupportButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AuctionList = ({navigation, route}) => {
  const [navOptions, setnavOptions] = useState(
    route?.params?.Type ? route?.params?.Type : 'auctions',
  );
  const [auction, setAuction] = useState(null);
  const [upcomingauction, setUpcomingAuction] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dummy, setDummy] = useState(false);

  const {showLoader} = useContext(LoaderContext);
  const [filterData, setFilterData] = React.useState('');
  const [refresh, setRefresh] = useState(false);
  const [hotPermiumAuctionData, setPermiumHotAuctionData] = useState('');

  const [filter, setFilter] = useState({
    brands: '',
    models: '',
    locationIds: '',
    kmClocked: '',
    yearOfMake: '',
  });

  const {profile} = useContext(AppContext);

  const _fetchData = async () => {
    showLoader(true);
    setAuction(null);
    setPageNumber(1);
    setTotalCount(0);
    try {
      let res1 = await getSearchData({
        sp: 'searchVehiclesApp',
        searchkey: '',
        custId: profile[0]?.customerId ? profile[0].customerId : '',
        pageNo: 1,
        pageSize: 10,
        brands: filter.brands,
        models: filter.models,
        locationIds: filter.locationIds,
        kmClocked: filter.kmClocked,
        yearOfMake: filter.yearOfMake,
      });
      setPageNumber(2);
      setTotalCount(res1.length > 0 ? res1[0].totalCount : 0);
      setAuction(res1);
      console.log('Search Data', res1);
      let res = await getFilterData({
        sp: 'searchVehiclesFilterValuesApp',
        searchkey: '',
        custId: profile[0]?.customerId ? profile[0].customerId : '',
        pageNo: 1,
        pageSize: 25,
        brands: filter.brands,
        models: filter.models,
        locationIds: filter.locationIds,
        kmClocked: filter.kmClocked,
        yearOfMake: filter.yearOfMake,
      });
      setFilterData({
        brands: JSON.parse(res[0].brands),
        models: JSON.parse(res[0].models),
        locationIds: JSON.parse(res[0].locations),
        kmClocked: JSON.parse(res[0].kmClocked),
        yearOfMake: JSON.parse(res[0].manYears),
      });
      showLoader(false);
    } catch (err) {}
  };

  const fetchLoadMore = async () => {
    try {
      setLoading(true);
      let res1 = await getSearchData({
        sp: 'searchVehiclesApp',
        searchkey: '',
        custId: profile[0]?.customerId ? profile[0].customerId : '',
        pageNo: pageNumber,
        pageSize: 10,
        brands: filter.brands,
        models: filter.models,
        locationIds: filter.locationIds,
        kmClocked: filter.kmClocked,
        yearOfMake: filter.yearOfMake,
      });
      setAuction([...auction, ...res1]);
      setPageNumber(pageNumber + 1);
      setDummy(!dummy);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getUpcomingAuctions = async () => {
    try {
      showLoader(true);
      let res = await getUpcomingauctionList();
      setUpcomingAuction(res);
      console.log("UA", res);
      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err ? err : 'Something went wrong'
      })
    }
  };

  const getPremiumAuctions = async () => {
    try {
      showLoader(true);
      let res2 = await getPermiumHotAuctions();
      setPermiumHotAuctionData(res2);

      showLoader(false);
    } catch (err) {
      showLoader(false);
      Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err ? err : 'Something went wrong'
      })
    }
  };

  React.useEffect(() => {
    _fetchData();
    getUpcomingAuctions();
    getPremiumAuctions();
  }, []);

  React.useEffect(() => {
    _fetchData();
  }, [filter]);

  const renderFooter = () => {
    return (
      <View>
        {loading ? (
          <ActivityIndicator color="red" style={{margin: 15}} />
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />

      <View style={styles.navView}>
        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor:
                navOptions == 'auctions'
                  ? colours.primaryColor
                  : colours.lowGrey,
            },
          ]}
          onPress={() => setnavOptions('auctions')}>
          <Text
            style={[
              styles.navText,
              {
                color:
                  navOptions == 'auctions'
                    ? colours.primaryWhite
                    : colours.primaryBlack,
              },
            ]}>
            Live Auctions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor:
                navOptions == 'premium'
                  ? colours.primaryColor
                  : colours.lowGrey,
            },
          ]}
          onPress={() => setnavOptions('premium')}>
          <Text
            style={[
              styles.navText,
              {
                color:
                  navOptions == 'premium'
                    ? colours.primaryWhite
                    : colours.primaryBlack,
              },
            ]}>
            Premium Auctions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            {
              backgroundColor:
                navOptions == 'upcoming'
                  ? colours.primaryColor
                  : colours.lowGrey,
            },
          ]}
          onPress={() => setnavOptions('upcoming')}>
          <Text
            style={[
              styles.navText,
              {
                color:
                  navOptions == 'upcoming'
                    ? colours.primaryWhite
                    : colours.primaryBlack,
              },
            ]}>
            Upcoming Auctions
          </Text>
        </TouchableOpacity>
      </View>
      {/* <ScrollView
        contentContainerStyle={{ alignItems:'center'}}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              _fetchData();
              getUpcomingAuctions();
              getPremiumAuctions();
            }}
          />
        }> */}
        {navOptions == 'auctions' ? (
          <>
            <View style={styles.filterOuterCon}>
                
              <Text style={styles.fontStyle1}>{totalCount} Live Auctions</Text>
              <TouchableOpacity
                style={styles.filterCon}
                onPress={() => {
                  navigation.navigate('FilterScreen', {
                    onGoback: setFilter,
                    filterData,
                  });
                }}>
                <Text style={styles.navText}>Filter{'     '}</Text>
                <View style={styles.iconCon}>
                  {showIcon('filter', colours.primaryBlack, 20)}
                </View>
              </TouchableOpacity>
            </View>

            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refresh}
                  onRefresh={() => {
                    _fetchData();
                    getUpcomingAuctions();
                    getPremiumAuctions();
                  }}
                />
              }
              contentContainerStyle={{paddingBottom: 100}}
              ItemSeparatorComponent={() => <View style={{height: 10}} />}
              showsHorizontalScrollIndicator={false}
              data={auction}
              ListEmptyComponent={
                <View style={styles.noDataCon}>
                  <Image
                    style={styles.noDataImg}
                    source={require('../asset/images/nodata1.webp')}
                  />
                  <Text style={styles.fontStyle1}>{'No data found'}</Text>
                </View>
              }
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <BidCard
                  id={item.vehId}
                  YOM={item?.manYear}
                  bidzCount={item?.bidzCount?item.bidzCount : 0}
                  image={item?.vehImage1}
                  brandName={item?.brandName}
                  modelName={item?.modelName}
                  location={item?.locName}
                  time={item?.actualMaturityDate}
                  premium={item?.isPremium}
                  bidAmount={item.latestBidAmount}
                  onpress={() =>
                    navigation.navigate('SingleItemScreen', {
                      name: item?.aucName,
                    })
                  }
                />
              )}
              onEndReached={
                auction && auction.length < totalCount
                  ? () =>fetchLoadMore()
                  : console.log("ERROR", auction && auction.length, totalCount)
              }
              ListFooterComponent={
                auction && auction.length < totalCount
                  ? () => renderFooter()
                  : null
              }
              onEndReachedThreshold={0.5}
            />
          </>
        ) : navOptions == 'upcoming' ? (
          <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => {
                getUpcomingAuctions();
              }}
            />
          }
            contentContainerStyle={{paddingBottom: 50}}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            showsHorizontalScrollIndicator={false}
            data={upcomingauction}
            ListEmptyComponent={
              <View style={styles.noDataCon}>
                <Image
                  style={styles.noDataImg}
                  source={require('../asset/images/nodata1.webp')}
                />
                <Text style={styles.fontStyle1}>{'No data found'}</Text>
              </View>
            }
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <BidCard
                id={item.vehId}
                image={item?.vehImage1}
                brandName={item?.brandName}
                modelName={item?.modelName}
                bidzCount={item?.bidzCount?item.bidzCount : 0}
                // location={item?.locName}
                registeration={item?.vehRegNo}
                year={item?.manYear}
                premium={item?.isPremium}
                AucStartDate={item?.aucDate}
                fromUpcoming
                // time={item?.actualMaturityDate}
                bidAmount={item.aucStartPrice}
                onpress={() =>
                  navigation.navigate('SingleItemScreen', {
                    name: item?.aucName,
                    from: 'Upcoming',
                  })
                }
              />
            )}
          />
        ) : 
        navOptions == 'premium' ?

        <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              getPremiumAuctions();
            }}
          />
        }
          contentContainerStyle={{ paddingBottom: 50 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          showsHorizontalScrollIndicator={false}
          data={hotPermiumAuctionData}
          ListEmptyComponent={
            <View style={styles.noDataCon}>
              <Image
                style={styles.noDataImg}
                source={require('../asset/images/nodata1.webp')}
              />
              <Text style={styles.fontStyle1}>{'No data found'}</Text>
            </View>
          }
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <BidCard
              id={item.vehId}
              YOM={item?.manYear}
              image={item?.vehImage1}
              bidzCount={item?.bidzCount?item.bidzCount : 0}
              brandName={item?.brandName}
              modelName={item?.modelName}
              location={item?.locName}
              time={item?.actualMaturityDate}
              premium={item?.isPremium}
              bidAmount={item.latestBidAmount}
              onpress={() => navigation.navigate('SingleItemScreen', { name: item?.aucName })}
            />
          )} />
          :null}
      {/* </ScrollView> */}
      <SupportButton />
    </SafeAreaView>
  );
};

export default AuctionList;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colours.backgroundColor,

    // padding: windowWidth * (5 / 100
  },
  filterOuterCon: {
    width: windowWidth * (90 / 100), 
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    paddingVertical:10
  },
  flatListView: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  iconCon: {
    width: windowWidth * (4 / 100),
    height: windowHeight * (4 / 100),
  },
  navView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: windowWidth * (90 / 100),
    padding: windowWidth * (2 / 100),
    //marginTop: windowHeight * (10 / 100)
  },
  navButton: {
    width: windowWidth * (28 / 100),
    height: windowHeight * (5 / 100),
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(12),
    textAlign: 'center',
  },
  filterCon: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  noDataImg: {
    width: windowWidth * (70 / 100),
    height: windowWidth * (50 / 100),
    resizeMode: 'contain',
  },
  noDataCon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fontStyle1: {
    fontFamily: 'Poppins-Bold',
    color: colours.primaryBlack,
  },
});
