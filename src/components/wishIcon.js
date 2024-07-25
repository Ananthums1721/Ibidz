import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import colours from '../globals/colours';
import Toast from 'react-native-simple-toast';
import { AppContext } from '../Context/appContext';
import {
    addToWishList,
    removeFromWishList,
} from '../api';
import { showIcon } from '../globals/icons';

const windowWidth = Dimensions.get('window').width;
export default function WishIcon({
    vehId,
    onRefresh
}) {

    const { wishListData, updateWishCount, updateWishList } = React.useContext(AppContext);

    const [wishStatus, setWishStatus] = React.useState(false);
    const AddToWishlist = async () => {
        try {
            setWishStatus(true);
            await addToWishList(vehId);
            await updateWishList();
            updateWishCount();
            setWishStatus(false);
            Toast.show('Added To Wishlist');
            onRefresh()
        } catch (e) {
            setWishStatus(false);
        }

    }
    const RemoveFromWishlist = async () => {
        try {
            setWishStatus(true);
            await removeFromWishList(vehId);
            await updateWishList();
            // updateWishCount();
            setWishStatus(false);
            Toast.show('Removed From Wishlist');
            onRefresh()
        } catch (error) {
            setWishStatus(false);
        }

    }
    return (
        <View style={styles.wishContainer}>
            {
                wishStatus ?
                    <ActivityIndicator size="small" color={wishListData["p" + vehId] != null || wishListData["p" + vehId] == true ? colours.primaryGrey : colours.primaryRed} />
                    :
                    wishListData["p" + vehId] != null || wishListData["p" + vehId] == true ? (
                        <>
                            <TouchableOpacity
                                style={{
                                    padding: 5,
                                }}
                                onPress={() => {
                                    RemoveFromWishlist();
                                }}>
                                <View style={{ width: windowWidth * (5 / 100), height: windowWidth * (5 / 100) }}>{showIcon('favorite', colours.primaryRed, 18)}</View>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            style={{
                                padding: 5,
                            }}
                            onPress={() => {
                                AddToWishlist();
                            }}>
                            <View style={{ width: windowWidth * (5 / 100), height: windowWidth * (5 / 100) }}>{showIcon('favorite', colours.primaryGrey, 18)}</View>
                        </TouchableOpacity>
                    )
            }
        </View>
    );
}

const styles = StyleSheet.create({

    wishContainer: {
        width: windowWidth * (8 / 100),
        height: windowWidth * (8 / 100),
        borderRadius: windowWidth * (4 / 100),
        alignItems: 'center',
        justifyContent: 'center',

    },

});