import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import { showIcon } from '../globals/icons';
import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';
import { reAuction } from '../api';
import Toast from 'react-native-simple-toast';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LostCard = ({ navigation,
    brandname,
    registerno,
    price,
    topbid,
    minwin,
    startDate,
    EndDate,
    auctionStatus,
    isRequested,
    aucId,
    onFresh,
}) => {

    const { showLoader } = React.useContext(LoaderContext);
    const { profile } = React.useContext(AppContext);

    const requestReauction = async () => {
        showLoader(true);
        try {
            let res = reAuction({
                sp: "reauctionRequst",
                aucId: aucId,
                sellerId: profile[0].sellerId
            })
            Toast.show('Reauction Sucessfull');
            onFresh()

        } catch (e) {
        }
        showLoader(false)
    }

    return (
        <View style={{ width: windowWidth, alignItems: 'center' }}>
            <View style={styles.containers}>
                <View style={styles.innerCon}>
                    <View style={{
                        width: windowWidth * (40 / 100),
                        height: windowHeight * (5 / 100),
                    }}>
                        <Text style={styles.fontText2} >Auction Name</Text>
                        <Text style={styles.fontText1}>{brandname}</Text>
                    </View>
                    <View style={{
                        width: windowWidth * (40 / 100),
                        height: windowHeight * (5 / 100),
                        marginLeft: windowWidth * (2 / 100)
                    }}>
                        <Text style={styles.fontText2} >Register</Text>
                        <Text style={styles.fontText1}>{registerno}</Text>
                    </View>
                </View>
                <View style={styles.box1}>
                    <View style={styles.box3}>
                        <Text style={[styles.fontText2, { width: windowWidth * (27 / 100), textAlign: "center" }]}>Price</Text>
                        <Text style={[styles.fontText2, { width: windowWidth * (27 / 100), textAlign: "center" }]}>Top Bid</Text>
                        <Text style={[styles.fontText2, { width: windowWidth * (27 / 100), textAlign: "center" }]}>Min Win</Text>
                    </View>

                    <View style={styles.box3}>
                        <Text style={[styles.fontText1, { width: windowWidth * (27 / 100), textAlign: "center" }]} >₹{price}</Text>
                        <Text style={[styles.fontText1, { width: windowWidth * (27 / 100), textAlign: "center" }]} >₹{topbid}</Text>
                        <Text style={[styles.fontText1, { width: windowWidth * (27 / 100), textAlign: "center" }]} >₹{minwin}</Text>

                    </View>
                </View>
                <View style={styles.dateCon}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <View style={{ width: windowWidth * (4 / 100), height: windowWidth * (4 / 100) }}>{showIcon('calendar', colours.primaryBlack, 16)}</View>
                        <Text style={[styles.fontText1, { marginLeft: windowWidth * (2 / 100), fontSize: getFontontSize(12) }]}>{startDate}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <View>{showIcon('calendar', colours.primaryBlack, 16)}</View>
                        <Text style={[styles.fontText1, { marginLeft: windowWidth * (2 / 100), fontSize: getFontontSize(12) }]}>{EndDate}</Text>
                    </View>
                </View>
                <View style={[styles.box2,]}>
                    <Text style={styles.fontText2} >Auction Status</Text>
                    {
                        auctionStatus === "Reauctioned" ?
                            <Text style={styles.fontText1} >{auctionStatus}</Text>
                            :
                            ''
                    }
                    {
                        auctionStatus === "Requsest Reauction" && isRequested === 0 ?
                            <TouchableOpacity style={styles.touchable2} onPress={() => requestReauction()}>
                                <Text style={styles.fontText3}>Reauction</Text>
                            </TouchableOpacity>
                            :
                            auctionStatus === "Requsest Reauction" && isRequested === 1 ?
                                <TouchableOpacity style={styles.touchable2} disabled={true}>
                                    <Text style={styles.fontText3}>Requested</Text>
                                </TouchableOpacity>
                                :
                                null
                    }

                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containers: {
        width: windowWidth * (90 / 100),
        backgroundColor: colours.primaryWhite,
        borderRadius: 10,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.16,
        shadowRadius: 6.68,
        shadowColor: colours.primaryBlack,
        elevation: 7,
        padding: windowWidth * (2 / 100),
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    innerCon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: windowWidth * (86 / 100),
    },
    dateCon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: windowHeight * (4 / 100),
        width: windowWidth * (90 / 100),
        paddingHorizontal: windowWidth * (2 / 100),
        borderBottomWidth: 0.6,
        borderBlockColor: colours.lowGrey,
        padding: 1

    },
    fontText1: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(16),
        color: colours.primaryBlack,
    },
    fontText2: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(13),
        color: colours.textGray,
    },
    fontText3: {
        fontFamily: 'Poppins-Medium',
        fontSize: getFontontSize(16),
        color: colours.primaryWhite,
    },
    box1: {
        width: windowWidth * (90 / 100),
        height: windowHeight * (8 / 100),
        alignItems: "center",
        justifyContent: "space-around",
        padding: 5,
        borderBottomColor: colours.lowGrey,
        borderBottomWidth: 0.6,
    },
    box2: {
        width: windowWidth * (90 / 100),
        alignItems: 'center',
        justifyContent: 'center',
    },
    box3: {
        width: windowWidth * (90 / 100),
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: windowWidth * (2 / 100)

    },
    touchable2: {
        height: windowHeight * (4 / 100),
        width: windowWidth * (40 / 100),
        backgroundColor: colours.secondaryBlue,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row"
    },
});

export default LostCard;