import React from 'react';
import { Image, View, Dimensions } from 'react-native';

//importing icons
import close from '../asset/icons/close.png';
import back from '../asset/icons/back.png';
import menu from '../asset/icons/menu.png';
import search from '../asset/icons/search.png';
import filter from '../asset/icons/filter.png';
import speedtime from '../asset/icons/speedtime.png';
import location from '../asset/icons/location.png';
import timer from '../asset/icons/timer.png';
import home from '../asset/icons/home.png';
import favorite from '../asset/icons/favorite.png';
import profile from '../asset/icons/profile.png';
import logo from '../asset/logo/ibidz.png';
import arrowback from '../asset/icons/arrow-back.png';
import brand from '../asset/icons/brand.png';
import car from '../asset/icons/car.png';
import safari from '../asset/icons/safari.png';
import edit from '../asset/icons/edit.png';
import call from '../asset/icons/call.png';
import expand from '../asset/icons/expand.png';
import balance from '../asset/icons/balance.png';
import carPlus from '../asset/icons/carPlus.png'

import terms from '../asset/icons/terms.png';
import about from '../asset/icons/aboutus.png';
import privacypolicy from '../asset/icons/privacypolicy.png';
import contact from '../asset/icons/contact.png';
import delivery from '../asset/icons/delivery.png';
import gst from '../asset/icons/gst.png';
import down from '../asset/icons/down.png';

import lost from '../asset/icons/lost.png';
import pendingpayment from '../asset/icons/pendingpayment.png';
import sandtimer from '../asset/icons/sandtimer.png';
import speedometer from '../asset/icons/speedometer.png';
import calendar from '../asset/icons/calendar.png';

import logout from '../asset/icons/logout.png';
import changepwd from '../asset/icons/changepwd.png';
import packages from '../asset/icons/packages.png';
import claim from '../asset/icons/claim.png';
import winnings from '../asset/icons/winnings.png';
import process from '../asset/icons/process.png';
import wishlist from '../asset/icons/wishlist.png';
import bid from '../asset/icons/bid.png';
import payment from '../asset/icons/payment.png';
import cms from '../asset/icons/cms.png';
import login from '../asset/icons/login.png';
import year from '../asset/icons/year.png';
import numPlate from '../asset/icons/numPlate.png';
import bin from '../asset/icons/bin.png';
import whatsapp from '../asset/icons/whatsapp.png';
import refund from '../asset/icons/refund.png';

//import images
import user from '../asset/images/user.png';
import lockImg from '../asset/images/lock.png';
import callImg from '../asset/images/call.png';
import emailImg from '../asset/images/email.png';
import uname from '../asset/images/uname.png';
import lock from '../asset/images/lock.png';
import mail from '../asset/images/mail.png';
import phone from '../asset/images/phone.png';
import Share from '../asset/images/Share.png';
import tick from '../asset/icons/tick.png';
import upload from '../asset/icons/upload.png';

import colours from './colours';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export const showIcon = (icon, color = colours.black, size = 24,) => {

  let src;
  switch (icon) {
    case 'close':
      src = close;
      break;

    case 'back':
      src = back;
      break;
    case 'cms':
      src = cms;
      break;
    case 'refund':
      src = refund;
      break;
    case 'bin':
      src = bin;
      break;
    case 'numPlate':
      src = numPlate;
      break;
    case 'carPlus':
      src = carPlus;
      break;
    case 'down':
      src = down;
      break;
    case 'phone':
      src = phone;
      break;
    case 'mail':
      src = mail;
      break;
    case 'whatsapp':
      src = whatsapp;
      break;
    case 'lock':
      src = lock;
      break;
    case 'uname':
      src = uname;
      break;
    case 'menu':
      src = menu;
      break;
    case 'search':
      src = search;
      break;
    case 'filter':
      src = filter;
      break;
    case 'speedtime':
      src = speedtime;
      break;
    case 'location':
      src = location;
      break;
    case 'timer':
      src = timer;
      break;
    case 'about':
      src = about;
      break;
    case 'login':
      src = login;
      break;
    case 'register':
      src = register;
      break;
    case 'privacypolicy':
      src = privacypolicy;
      break;
    case 'contact':
      src = contact;
      break;
    case 'delivery':
      src = delivery;
      break;
    case 'home':
      src = home;
      break;
    case 'favorite':
      src = favorite;
      break;
    case 'profile':
      src = profile;
      break;
    case 'logo':
      src = logo;
      break;
    case 'arrowback':
      src = arrowback;
      break;
    case 'safari':
      src = safari;
      break;
    case 'car':
      src = car;
      break;
    case 'terms':
      src = terms;
      break;
    case 'brand':
      src = brand;
      break;
    case 'edit':
      src = edit;
      break;
    case 'call':
      src = call;
      break;
    case 'year':
      src = year;
      break;
    case 'mail':
      src = mail;
      break;
    case 'expand':
      src = expand;
      break;
    case 'bid':
      src = bid;
      break;
    case 'wishlist':
      src = wishlist;
      break;
    case 'process':
      src = process;
      break;
    case 'winnings':
      src = winnings;
      break;
    case 'claim':
      src = claim;
      break;
    case 'packages':
      src = packages;
      break;
    case 'changepwd':
      src = changepwd;
      break;
    case 'logout':
      src = logout;
      break;
    case 'payment':
      src = payment;
      break;
    case 'balance':
      src = balance;
      break;
    case 'lost':
      src = lost;
      break;
    case 'pendingpayment':
      src = pendingpayment;
      break;
    case 'sandtimer':
      src = sandtimer;
      break;
    case 'speedometer':
      src = speedometer;
      break;
    case 'calendar':
      src = calendar;
      break;
    default:
      src = back;
  }
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
      }}>
      <Image
        source={src}
        style={{
          height: size,
          width: size,
          tintColor: color,
          resizeMode: 'contain',
        }}
      />
    </View>
  );
};



export const showImage = (image, size = 24) => {

  let src;
  switch (image) {
    case 'user':
      src = user;
      break;
    case 'gst':
      src = gst;
      break;
    case 'upload':
      src = upload;
      break;
    case 'lockImg':
      src = lockImg;
      break;
    case 'Share':
      src = Share;
      break;
    case 'callImg':
      src = callImg;
      break;
    case 'emailImg':
      src = emailImg;
      break;
    case 'uname':
      src = uname;
      break;
    case 'phone':
      src = phone;
      break;
    case 'mail':
      src = mail;
      break;
    case 'lock':
      src = lock;
      break;
    case 'menu':
      src = menu;
      break;
    case 'tick':
      src = tick;
      break;
    case 'location':
      src = location;
      break;
    default:
      src = user;
  }
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: windowWidth * (size / 100),
        width: windowWidth * (size / 100),
      }}>
      <Image
        source={src}
        style={{
          height: windowWidth * (size / 100),
          width: windowWidth * (size / 100),
          resizeMode: 'contain',
          opacity: 0.7
        }}
      />
    </View>
  );
};