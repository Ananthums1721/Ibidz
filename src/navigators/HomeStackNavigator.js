import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import TestScreen from '../screens/TestScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPassword from '../screens/ForgotPassword';
import ResetPassword from '../screens/ResetPassword';
import SearchScreen from '../screens/SearchScreen';
import SingleItemScreen from '../screens/SingleItemScreen';
import ImageViewScreen from '../screens/ImageViewScreen';

import TabNavigator from './TabNavigator';
import DrawerStackNavigator from './DrawerStackNavigator';
import EditProfile from '../screens/EditProfile';

import Bids from '../screens/Bids';
import Wishlist from '../screens/Wishlist';
import ProcessWins from '../screens/ProcessWins';
import Winnings from '../screens/Winnings';
import PaymentDues from '../screens/PaymentDues';
import ClaimHistory from '../screens/ClaimHistory';
import Packages from '../screens/Packages';
import ChangePassword from '../screens/ChangePassword';
import FilterScreen from '../screens/FilterScreen';


import TermsConditions from '../screens/Terms&Conditions';
import AboutUs from '../screens/AboutUs';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import FeedBack from '../screens/FeedBack';
import DeliveryInfo from '../screens/DeliveryInfo';


import AddVehicle from '../screens/AddVehicle';
import Vehicle from '../screens/Vehicle';
import ActiveAuction from '../screens/ActiveAuction';
import AuctionHistory from '../screens/AuctionHistory';
import ProcessWinners from '../screens/ProcessWinners';
import WonCustomers from '../screens/WonCustomers';
import PendingPayment from '../screens/PendingPayments';
import PaymentHistory from '../screens/PaymentHistory';
import Lost from '../screens/Lost';
import VendorRegister from '../screens/VendorRegister';
import BidHistory from '../screens/BidHistory';
import VendorChangePassword from '../screens/VendorChangePassword';
import VendorEditProfile from '../screens/VendorEditProfile';
import VendorLoginScreen from '../screens/VendorLoginScreen';
import VendorForgotPassword from '../screens/VenodFrogotPassword';
import VendorResetPassword from '../screens/VendorResetPassword';
import ContactUs from '../screens/ContactUs';
import WonSingleItemScreen from '../screens/WonSingleItemScreen';
import VehicleUpdate from '../screens/VehicleUpdate';
import RefundHistory from '../screens/RefundHistory';
import PackagePurchaseHistory from '../screens/PackagePurchaseHistory';

const Stack = createStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={'SplashScreen'}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="VendorLoginScreen" component={VendorLoginScreen} />
      <Stack.Screen name="TestScreen" component={TestScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="VendorForgotPassword" component={VendorForgotPassword} />

      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="VendorResetPassword" component={VendorResetPassword} />

      <Stack.Screen name="SearchScreen" component={SearchScreen} />

      <Stack.Screen name='TabNavigator' component={TabNavigator} />
      <Stack.Screen name='DrawerStackNavigator' component={DrawerStackNavigator} />

      <Stack.Screen name='SingleItemScreen' component={SingleItemScreen} />
      <Stack.Screen name='EditProfile' component={EditProfile} />
      <Stack.Screen name='ImageViewScreen' component={ImageViewScreen} />

      <Stack.Screen name='Bids' component={Bids} />
      <Stack.Screen name='BidHistory' component={BidHistory} />
      <Stack.Screen name='Wishlist' component={Wishlist} />
      <Stack.Screen name='ProcessWins' component={ProcessWins} />
      <Stack.Screen name='Winnings' component={Winnings} />
      <Stack.Screen name='PaymentDues' component={PaymentDues} />
      <Stack.Screen name='ClaimHistory' component={ClaimHistory} />
      <Stack.Screen name='Packages' component={Packages} />
      <Stack.Screen name='ChangePassword' component={ChangePassword} />
      <Stack.Screen name='FilterScreen' component={FilterScreen} />


      <Stack.Screen name='Terms&Conditions' component={TermsConditions} />
      <Stack.Screen name='AboutUs' component={AboutUs} />
      <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicy} />
      <Stack.Screen name='FeedBack' component={FeedBack} />
      <Stack.Screen name='DeliveryInfo' component={DeliveryInfo} />
      <Stack.Screen name='ContactUs' component={ContactUs} />
      <Stack.Screen name='WonSingleItemScreen' component={WonSingleItemScreen} />


      <Stack.Screen name='AddVehicle' component={AddVehicle} />
      <Stack.Screen name='Vehicle' component={Vehicle} />
      <Stack.Screen name='ActiveAuction' component={ActiveAuction} />
      <Stack.Screen name='AuctionHistory' component={AuctionHistory} />
      <Stack.Screen name='ProcessWinners' component={ProcessWinners} />
      <Stack.Screen name='WonCustomers' component={WonCustomers} />
      <Stack.Screen name='PendingPayment' component={PendingPayment} />
      <Stack.Screen name='PaymentHistory' component={PaymentHistory} />
      <Stack.Screen name='Lost' component={Lost} />

      <Stack.Screen name='VendorRegister' component={VendorRegister} />
      <Stack.Screen name='VendorChangePassword' component={VendorChangePassword} />
      <Stack.Screen name='VendorEditProfile' component={VendorEditProfile} />
      <Stack.Screen name='VehicleUpdate' component={VehicleUpdate} />
      <Stack.Screen name='RefundHistory' component={RefundHistory} />
      <Stack.Screen name='PackagePurchaseHistory' component={PackagePurchaseHistory} />


    </Stack.Navigator>
  );
}
