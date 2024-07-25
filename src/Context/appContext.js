import React, {createContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import {verifyOTP, loginUser, updateProfile, getWishList} from '../api';
// import OneSignal from 'react-native-onesignal';
import OneSignal from 'react-native-onesignal';

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {
  //   const [auth, setAuth] = useState(false);
  const [profile, setProfile] = useState({});
  const [wishCount, setWishCount] = useState(0);
  const [Language, setLanguage] = useState({});
  const [cartData, setCartData] = useState([]);
  const [wishListData, setWishListData] = useState([]);
  const [cCodeFlag, setCCodeFlag] = useState(0);

  const loadProfile = async () => {
    let prof = await AsyncStorage.getItem('profile');
    if (!prof) {
      let obj = {
        guestId: Math.floor(Math.random() * 9000000000) + 1000000000,
      };
      await AsyncStorage.setItem('profile', JSON.stringify(obj));
      setProfile(obj);
    } else {
      setProfile(JSON.parse(prof));
    }
    await loadWishList();
  };

  const loadCart = async () => {
    let localCart = await AsyncStorage.getItem('loacalCart');
    if (!localCart) {
      setCartData([]);
    } else {
      setCartData(JSON.parse(localCart));
    }
  };

  const updateCart = async ProductID => {
    let res = await getCartList();
    if (res.cartList.length > 0) {
      let a = {};
      res.cartList.map((item, i) => {
        let key1 = 'p' + item.productId;
        let qty = item.qty;
        a[key1] = qty;
      });
      await AsyncStorage.setItem('loacalCart', JSON.stringify(a));
    } else {
      await AsyncStorage.removeItem('loacalCart');
    }
  };

  const loadWishList = async () => {
    let loacalWishList = await AsyncStorage.getItem('loacalWishList');
    if (!loacalWishList) {
      setWishListData([]);
    } else {
      setWishListData(JSON.parse(loacalWishList));
    }
  };

  const updateWishList = async () => {
    try {
      let res = await getWishList();
      if (res.length > 0) {
        let a = {};
        res.map((item, i) => {
          let key1 = 'p' + item.vehId;
          let value = true;
          a[key1] = value;
        });
        await AsyncStorage.setItem('loacalWishList', JSON.stringify(a));
      } else {
        await AsyncStorage.removeItem('loacalWishList');
      }
      await loadWishList();
    } catch (err) {
      await AsyncStorage.removeItem('loacalWishList');
      await loadWishList();
    }
  };

  const editProfile = async (email, phone, name) => {
    let prof = await AsyncStorage.getItem('profile');
    let res = await updateProfile(email, phone, name);
  };

  const editPincode = async item => {
    let prof = await AsyncStorage.getItem('profile');
    profile.pincode = item.pincodeId;
    if (item.area !== null) {
      profile.pinAddress = item.area;
      profile.pincode = item.pincodeId;
    } else {
    }
    setProfile(profile);
    await AsyncStorage.setItem('profile', JSON.stringify(profile));
  };

  const register = async (OTP, details) => {
    await verifyOTP({
      sp: 'confirmCustomerRegisterOtp',
      custId: details.custId,
      OTP: OTP,
    });
    let prof = JSON.parse(await AsyncStorage.getItem('profile'));
    let obj = {
      ...prof,
      ...details,
    };
    await AsyncStorage.setItem('profile', JSON.stringify(obj));
    setProfile(obj);
    const OnesignalID = `${obj[0]?.customerId}-c`;
    OneSignal.setExternalUserId(OnesignalID);

    return 'Account created successfully';
  };

  const vendorRegister = async (OTP, details) => {
    await verifyOTP({
      sp: 'confirmSellerRegisterOtp',
      sellerId: details.sellerId,
      OTP: OTP,
    });
    let prof = JSON.parse(await AsyncStorage.getItem('profile'));
    let obj = {
      ...prof,
      ...details,
    };
    await AsyncStorage.setItem('profile', JSON.stringify(obj));
    setProfile(obj);
    const OnesignalID = `${obj[0]?.customerId}-s`;
    OneSignal.setExternalUserId(OnesignalID);

    return 'Account created successfully';
  };

  const login = async payload => {
    loadProfile();
    let user = await loginUser(payload);
    let prof = JSON.parse(await AsyncStorage.getItem('profile'));
    let obj = {
      ...prof,
      ...user,
    };
    await AsyncStorage.setItem('profile', JSON.stringify(obj));
    await AsyncStorage.setItem('token', user[0]?.token);
    await AsyncStorage.setItem('userType', user[0]?.userMode);

    setProfile(obj);
    if (user[0].userMode == 'seller') {
      const OnesignalID = `${obj[0]?.customerId}-s`;
      OneSignal.setExternalUserId(OnesignalID);
    } else {
      const OnesignalID = `${obj[0]?.customerId}-c`;
      OneSignal.setExternalUserId(OnesignalID);
    }

    return 'Logged in successfully';
  };

  const logout = async () => {
    let prof = JSON.parse(await AsyncStorage.getItem('profile'));
    let obj = {
      guestId: prof.guestId,
      pincode: prof.pincode,
      pinAddress: prof.pinAddress,
    };
    await AsyncStorage.clear();
    await AsyncStorage.setItem('profile', JSON.stringify(obj));
    await AsyncStorage.setItem('isOpenedBefore', 'true');
    setProfile(obj);
    await updateWishCount();
    await updateCart();
    await loadCart();
    return 'Logged out successfully';
  };

  const updateWishCount = async () => {
    try {
      let res = await getWishList();
      setWishCount(res.length);
    } catch (err) {}
  };
  const updateLanguage = async () => {
    let langCode = await AsyncStorage.getItem('LangCode');
    if (langCode) {
      try {
        let Lang = await getLanguageList(langCode);
        setLanguage(Lang);
      } catch (err) {
        Toast.show(err);
      }
    } else {
      try {
        let Lang = await getLanguageList('en');
        setLanguage(Lang);
      } catch (err) {
        Toast.show(err);
      }
    }
  };

  const value = {
    // auth,
    register,
    vendorRegister,
    login,
    profile,
    loadProfile,
    logout,
    editProfile,
    editPincode,
    wishCount,
    updateWishCount,
    updateLanguage,
    Language,
    loadCart,
    updateCart,
    cartData,
    loadWishList,
    updateWishList,
    wishListData,
    cCodeFlag,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
