import {get, post, put, postRegister, post1, get1, post2} from './networkUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

// for userlogin

export const loginUser = async payload => {
  const URL = '';
  let login = await post(URL, payload);
  return login;
};
export const getRefundHistory = async payload => {
  const URL = '';
  let process = await post(URL, payload);
  return process;
};
export const regProfile = async payload => {
  const URL = '';
  return await post(URL, payload);
};

export const verifyOTP = async payload => {
  const URL = ``;
  let verify = await post(URL, payload);
  return verify;
};

export const forgotPassword = async payload => {
  const URL = ``;
  let forgot = await post(URL, payload);
  return forgot;
};

export const resetPassword = async payload => {
  const URL = ``;
  let reset = await post(URL, payload);
  return reset;
};

export const getBanner = async () => {
  const URL = `?sp=getBanners`;
  let banner = await get(URL);
  return banner;
};

export const getVechileType = async () => {
  const URL = `?sp=getVehicleTypes`;
  let type = await get(URL);
  return type;
};

export const getHotAuctions = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getHotAuctions&custId=${
    profile[0]?.customerId ? profile[0]?.customerId : ''
  }`;
  let banner = await get(URL);
  return banner;
};

export const getTodaysHotAuctions = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getTodaysAuctions&custId=${
    profile[0]?.customerId ? profile[0]?.customerId : ''
  }`;
  let banner = await get(URL);
  return banner;
};

export const getPermiumHotAuctions = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getPremiumAuction&custId=${
    profile[0]?.customerId ? profile[0]?.customerId : ''
  }`;
  let banner = await get(URL);
  return banner;
};

export const updateCheck = async (vCode, platform, type) => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getAppUpdateCheck&versionCode=${vCode}&platform=${platform}&type=${type}`;
  let banner = await get(URL);
  return banner;
};

export const getPolicies = async () => {
  const URL = `?sp=getSettings`;
  let banner = await get(URL);
  return banner;
};

export const getauctionList = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getAuctionsList&custId=${
    profile[0]?.customerId ? profile[0]?.customerId : ''
  }`;
  let List = await get(URL);
  return List;
};

export const getUpcomingauctionList = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getUpcomingAuctions&custId=${
    profile[0]?.customerId ? profile[0]?.customerId : ''
  }`;
  let List = await get(URL);
  return List;
};

export const getSearchData = async payload => {
  const URL = ``;
  let search = await post(URL, payload);
  return search;
};

export const getItemDetails = async value => {
  const URL = `?sp=getAuctionDetailsbyId&aucName=${value}`;
  let details = await get(URL);
  return details;
};
export const biddedCustomerListForDetaislScreen = async value => {
  const URL = `?sp=getBidLogForAuctionDetailPage&Id=${value}`;
  let details = await get(URL);
  return details;
};

export const getwonItemDetails = async value => {
  const URL = `?sp=getwonAuctionDetailsbyId&aucName=${value}`;
  let details = await get(URL);
  return details;
};

export const getBidNow = async payload => {
  const URL = ``;
  let bid = await post1(URL, payload);
  return bid;
};

export const getProfileDetails = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getCustomerProfileById&custId=${
    profile[0]?.customerId ? profile[0]?.customerId : ''
  }`;
  let details = await get1(URL);
  return details;
};

export const getPackageListData = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = profile[0]?.customerId
    ? `?sp=getUserPackage&userId=${
        profile[0]?.customerId ? profile[0]?.customerId : ''
      }&userType=${profile[0]?.userMode}`
    : `?sp=getUserPackage&userId=${
        profile[0]?.sellerId ? profile[0]?.sellerId : ''
      }&userType=${profile[0]?.userMode}`;
  console.log('URL', URL);
  let details = await get1(URL);
  return details;
};

export const getIsPackageActive = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=isPackageActive&userId=${
    profile[0]?.customerId ? profile[0]?.customerId : profile[0]?.sellerId
  }`;
  let details = await get(URL);
  return details;
};

export const getDashBoardData = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  let type = await AsyncStorage.getItem('userType');
  const URL = `?sp=getDashboardProfileFe&Id=${
    profile[0]?.customerId ? profile[0]?.customerId : ''
  }&multiple=${true}&type=${type}`;
  let dashboard = await get(URL);
  return dashboard;
};

export const getPackageHis = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));

  let userID = '';
  if (profile[0]?.userMode === 'seller') {
    userID = profile[0]?.sellerId ? profile[0]?.sellerId : '';
  } else {
    userID = profile[0]?.customerId ? profile[0]?.customerId : '';
  }

  const URL = `?sp=getCustomerPackageHistory&custId=${
    // profile[0]?.customerId ? profile[0]?.customerId : ''
    userID
  }&userType=${profile[0]?.userMode}`;
  let packageHistory = await get(URL);
  return packageHistory;
};

export const getMyBidData = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getCustomerBids&custId=${
    profile[0]?.customerId ? profile[0]?.customerId : ''
  }`;
  let myBid = await get1(URL);
  return myBid;
};

export const getPaymentDues = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getPaymentDue&custId=${
    profile[0]?.customerId ? profile[0]?.customerId : ''
  }`;
  let myBid = await get1(URL);
  return myBid;
};

export const getPaymentHistory = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  let userID = '';
  if (profile[0]?.userMode === 'seller') {
    userID = profile[0]?.sellerId ? profile[0]?.sellerId : '';
    console.log(userID, '11111');
  } else {
    console.log('222222');

    userID = profile[0]?.customerId ? profile[0]?.customerId : '';
  }
  const URL = `?sp=getPackageHistory&userId=${userID}&userType=${profile[0]?.userMode}`;
  let paymentHistory = await get(URL);
  return paymentHistory;
};

export const changepassword = async payload => {
  const URL = ``;
  let password = await post1(URL, payload);
  return password;
};

export const updateProfile = async payload => {
  const URL = '';
  let response = await post1(URL, payload);
  return response;
};

export const deleteAccount = async payload => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = '';
  let response = await post1(URL, {
    sp: 'delCustomerFromApp',
    custId: profile[0]?.customerId ? profile[0]?.customerId : '',
  });
  return response;
};

export const getFilterData = async payload => {
  const URL = ``;
  let filterdata = await post(URL, payload);
  return filterdata;
};

export const addToWishList = async id => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = '';
  let searchResult = await post1(URL, {
    sp: 'insCustomerWishlists',
    custId: profile[0]?.customerId ? profile[0]?.customerId : '',
    vehId: id,
  });

  return searchResult;
};

export const removeFromWishList = async id => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = '';
  let searchResult = await post1(URL, {
    sp: 'delCustomerWishlists',
    custId: profile[0]?.customerId ? profile[0]?.customerId : '',
    vehId: id,
  });

  return searchResult;
};

export const getWishList = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getCustomerWishlists&custId=${
    profile[0]?.customerId ? profile[0]?.customerId : ''
  }`;
  let wish = await get1(URL);
  return wish;
};

export const getProcessWin = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getProcessWinningsAgainstCustomer&custId=${
    profile[0]?.customerId ? profile[0]?.customerId : ''
  }`;
  let process = await get1(URL);
  return process;
};

export const getAllPackages = async value => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getAllPackages&userType=${profile[0]?.userMode}`;
  let packages = await get(URL);
  return packages;
};

export const getBidHistory = async payload => {
  const URL = ``;
  let history = await post1(URL, payload);
  return history;
};

export const getWinnings = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getCustomerWinnings&custId=${
    profile[0]?.customerId ? profile[0]?.customerId : ''
  }`;
  let winnings = await get1(URL);
  return winnings;
};

export const getclaimAmount = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getclaimamount&custId=${
    profile[0]?.customerId ? profile[0]?.customerId : ''
  }`;
  let calim = await get1(URL);
  return calim;
};

export const bidRejection = async payload => {
  const URL = ``;
  let rejection = await post(URL, payload);
  return rejection;
};

export const userFeedBack = async payload => {
  const URL = ``;
  let feedback = await post(URL, payload);
  return feedback;
};
// let profile = JSON.parse(await AsyncStorage.getItem('profile'));

export const getVendorProfile = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getSellerProfileById&sellerId=${
    profile[0]?.sellerId ? profile[0]?.sellerId : ''
  }`;
  let vendorprofile = await get1(URL);
  return vendorprofile;
};

export const getVendorDashBoardData = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  let type = await AsyncStorage.getItem('userType');
  const URL = `?sp=getDashboardProfileFe&Id=${
    profile[0]?.sellerId ? profile[0]?.sellerId : ''
  }&multiple=${true}&type=${type}`;
  let dashboard = await get(URL);
  return dashboard;
};

export const getVendorAuction = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getSellerLiveAuctionsList&sellerId=${
    profile[0]?.sellerId ? profile[0]?.sellerId : ''
  }`;
  let auctionlist = await get1(URL);
  return auctionlist;
};

export const getVendorAuctionHistory = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getSellerAuctionsList&sellerId=${
    profile[0]?.sellerId ? profile[0]?.sellerId : ''
  }`;
  let getVendorAuctionHistory = await get1(URL);
  return getVendorAuctionHistory;
};

export const getVendorProcessWin = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getProcessWinnersAgainstSellerAuctions&sellerId=${
    profile[0]?.sellerId ? profile[0]?.sellerId : ''
  }`;
  let process = await get1(URL);
  return process;
};

export const getVendorAuctionWon = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getWonCustomersAgainstSellerAuctions&sellerId=${
    profile[0]?.sellerId ? profile[0]?.sellerId : ''
  }`;
  let won = await get1(URL);
  return won;
};

export const getVendorPaymentHistory = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getPendingPaymentHistoryAgainstSellerId&sellerId=${
    profile[0]?.sellerId ? profile[0]?.sellerId : ''
  }`;
  let payment = await get1(URL);
  return payment;
};

export const getVendorLostAuction = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getLostAuction&sellerId=${
    profile[0]?.sellerId ? profile[0]?.sellerId : ''
  }`;
  let payment = await get(URL);
  return payment;
};

export const reAuction = async payload => {
  const URL = ``;
  let reauction = await post2(URL, payload);
  return reauction;
};

export const getVendorPendingPayment = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getPaymentHistoryAgainstSellerId&sellerId=${
    profile[0]?.sellerId ? profile[0]?.sellerId : ''
  }`;
  let payment = await get1(URL);
  return payment;
};

export const razorPayInfo = async payload => {
  const URL = ``;
  let reauction = await post(URL, payload);
  return reauction;
};

export const vendorchangepassword = async payload => {
  const URL = ``;
  let password = await post1(URL, payload);
  return password;
};

export const VendorUpdateProfile = async payload => {
  const URL = '';
  let profileupdate = await post1(URL, payload);
  return profileupdate;
};

export const resentOTP = async payload => {
  const URL = ``;
  let resent = await post(URL, payload);
  return resent;
};

export const aucRazorPay = async payload => {
  const URL = ``;
  let reauction = await post(URL, payload);
  return reauction;
};

export const pendingPaymentVendor = async payload => {
  const URL = ``;
  let payment = await post(URL, payload);
  return payment;
};

export const updOrders = async payload => {
  const URL = ``;
  let reauction = await post2(URL, payload);
  return reauction;
};

export const generateOTP = async payload => {
  const URL = ``;
  let otp = await post1(URL, payload);
  return otp;
};

export const vendorOtpVerification = async payload => {
  const URL = ``;
  let otp = await post1(URL, payload);
  return otp;
};

export const salesConfirm = async payload => {
  const URL = ``;
  let otp = await post(URL, payload);
  return otp;
};

export const updPackageOrder = async payload => {
  const URL = ``;
  let reauction = await post2(URL, payload);
  return reauction;
};

export const getNotification = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getNotificationList&Id=${
    profile[0]?.customerId ? profile[0]?.customerId : ''
  }`;
  let notification = await get(URL);
  return notification;
};

// ADDED BY SREEJITH

export const getVehicleList = async () => {
  let profile = JSON.parse(await AsyncStorage.getItem('profile'));
  const URL = `?sp=getVehiclesListBySellerId&sellerId=${
    profile[0]?.sellerId ? profile[0]?.sellerId : ''
  }`;
  let brandList = await get1(URL);
  return brandList;
};

export const getVehicleDetails = async (pID, vID) => {
  const URL = `?sp=getVehiclesDetailsvehId&sellerId=${pID}&vehId=${vID}`;
  let brandList = await get1(URL);
  return brandList;
};

export const getBrandList = async () => {
  const URL = `?sp=getBrand`;
  let brandList = await get(URL);
  return brandList;
};

export const getBrandModelList = async value => {
  const URL = `?brandName=${value}&sp=getModel`;
  let response = await get(URL);
  return response;
};

export const getBrandModelVariantList = async value => {
  const URL = `?modelName=${value}&sp=getVariant`;
  let response = await get(URL);
  return response;
};

export const getVehicleTypeList = async () => {
  const URL = `?sp=getVehicleTypes`;
  let response = await get(URL);
  return response;
};

export const getInsuranceTypeList = async () => {
  const URL = `?sp=getInsuranceTypes`;
  let response = await get(URL);
  return response;
};

export const getVehicleFuelTypeList = async () => {
  const URL = `?sp=getVehFuelType`;
  let response = await get(URL);
  return response;
};

export const getStateList = async () => {
  const URL = `?sp=getStatebyLocId`;
  let response = await get(URL);
  return response;
};

export const getDistrictList = async value => {
  const URL = `?sp=getDistrictbyLocId&state=${value}`;
  let response = await get(URL);
  return response;
};

export const getCityList = async value => {
  const URL = `?sp=getlocNamebyLocId&district=${value}`;
  let response = await get(URL);
  return response;
};

export const postAddNewVehicle = async payload => {
  const URL = ``;
  let feedback = await post(URL, payload);
  return feedback;
};

export const postVehicleDelete = async payload => {
  const URL = ``;
  let feedback = await post1(URL, payload);
  return feedback;
};
