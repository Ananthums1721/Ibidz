import { View, Text, SafeAreaView, StyleSheet, RefreshControl, TextInput, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import colours from '../globals/colours'
import { showIcon } from '../globals/icons'
import { getFontontSize } from '../globals/functions';
import { getSearchData, addWish, getFilterData, deleteWish } from '../api';
import BidCard from '../components/BidCard';
import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';
import Header from '../components/Header';
import DelayInput from 'react-native-debounce-input';
import SupportButton from '../components/SupportButton';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SearchScreen = ({ navigation }) => {
    const [wishStatus, setWishStatus] = useState(false)
    const [searchList, setSearchList] = useState('');
    const [keyword, setKeyword] = useState('');
    const [fileter, setFilter] = useState({
        brands: "",
        models: "",
        locationIds: "",
        kmClocked: "",
        yearOfMake: ""
    });
    const [filterData, setFilterData] = React.useState('');
    const [totalCount, setTotalCount] = React.useState(0);
    const [pageCount, setPageCount] = React.useState(0);
    const [data, setData] = React.useState(null);

    const { showLoader } = React.useContext(LoaderContext);
    const { profile } = React.useContext(AppContext);
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        fetchSearchData()

    }, [keyword, fileter])


    const fetchSearchData = async () => {
        try {
            showLoader(true)
            let res1 = await getSearchData({
                sp: "searchVehiclesApp",
                searchkey: keyword,
                custId: profile[0].customerId,
                pageNo: 1,
                pageSize: 25,
                brands: fileter.brands,
                models: fileter.models,
                locationIds: fileter.locationIds,
                kmClocked: fileter.kmClocked,
                yearOfMake: fileter.yearOfMake,
            })
            setSearchList(res1)
            setPageCount(pageCount + 1);
            let res = await getFilterData({

                sp: "searchVehiclesFilterValuesApp",
                searchkey: "",
                custId: profile[0]?.customerId,
                pageNo: 1,
                pageSize: 25,
                brands: fileter.brands,
                models: fileter.models,
                locationIds: fileter.locationIds,
                kmClocked: fileter.kmClocked,
                yearOfMake: fileter.yearOfMake,

            });
            setFilterData({
                brands: JSON.parse(res[0].brands),
                models: JSON.parse(res[0].models),
                locationIds: JSON.parse(res[0].locations),
                kmClocked: JSON.parse(res[0].kmClocked),
                yearOfMake: JSON.parse(res[0].manYears),
            });
            showLoader(false)
        } catch (e) {
            showLoader(false)
        }
    }

    const onRefresh = useCallback(() => {
        setRefresh(true),
            fetchSearchData();
        setTimeout(() => {
            setRefresh(false)
        }, 1000);
    })

    return (
        <SafeAreaView style={styles.container}>
            <Header backarrow logo navigation={navigation} />
            <View style={styles.searchContainer}>
                <View style={styles.searchView}>

                    <View style={{ left: 5 }}>{showIcon('search', colours.gray, 20)}</View>
                    <DelayInput
                        value={keyword}
                        minLength={2}
                        onChangeText={(text) => setKeyword(text)}
                        delayTimeout={800}
                        style={styles.searchText}
                        placeholder='LOOKING FOR A CAR?'
                        // placeholder={totalCount && totalCount > 0 ? `Search ${totalCount}+ products ` : 'Search products'}
                        placeholderTextColor={colours.gray}
                    />

                </View>
                <TouchableOpacity style={{ right: 5, width: windowWidth * (10 / 100), height: windowWidth * (10 / 100), alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                    navigation.navigate('FilterScreen', {
                        onGoback: setFilter,
                        filterData,
                    });
                }}>
                    <View style={{ width: windowWidth * (10 / 100), height: windowWidth * (10 / 100) }}>{showIcon('filter', colours.primaryBlack, 20)}</View>
                </TouchableOpacity>
            </View>


            <FlatList
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
                contentContainerStyle={{ paddingBottom: 50, paddingTop: 15 }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                showsHorizontalScrollIndicator={false}
                data={searchList}
                ListEmptyComponent={
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Image
                            style={{ width: windowWidth * (60 / 100), height: windowWidth * (40 / 100), resizeMode: 'contain', borderRadius:10, marginTop: windowHeight*(20/100) }}

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
                    <BidCard
                        id={item.vehId}
                        image={item?.vehImage1}
                        brandName={item?.brandName}
                        modelName={item?.modelName}
                        location={item?.locName}
                        bidzCount={item?.bidzCount?item.bidzCount : 0}
                        time={item?.actualMaturityDate}
                        bidAmount={item.latestBidAmount}
                        onWishPress={item.isWishlisted}
                        onpress={() => navigation.navigate('SingleItemScreen', { name: item?.aucName })}
                    />
                )} />

            <SupportButton/>
        </SafeAreaView>
    )
}

export default SearchScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.backgroundColor,
        alignItems: 'center'

    },
    searchContainer: {
        height: windowWidth * (10 / 100),
        width: windowWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 10
    },
    secondContainer: {
        // backgroundColor: colours.lightRed,
        flex: 1,
    },
    searchView: {
        width: windowWidth * (75 / 100),
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
        marginLeft:10
    },
    flatListView: {
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25
    },
})