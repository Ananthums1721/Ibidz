import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { getPolicies } from '../api';
import { LoaderContext } from '../Context/loaderContext';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import AuthButton from '../components/AuthButton';
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import SupportButton from '../components/SupportButton';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const TermsConditions = ({ navigation, route }) => {

    const { showLoader, loading } = React.useContext(LoaderContext);
    const { Type } = route.params;
    const fromReg = route.params.fromReg ? true : false;
    const regex = /<br|\n|\r\s*\\?>/g;
    const [policy, setPolicy] = React.useState([]);
  
    React.useEffect(() => {
      const effect = async () => {
        try{
            showLoader(true)
            let res = await getPolicies();
            console.log("Policies", res);
            setPolicy(res);
            showLoader(false)
        } catch (err){
            showLoader(false)
        } 
      };
      effect();
    }, []);
  
    if (policy.length === 0) return (
        <SafeAreaView style={styles.mainContainer}>
          <Header
            backarrow
            navigation={navigation}
            title={Type}
          />
        </SafeAreaView>
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
          <Header
            backarrow
            navigation={navigation}
            title={Type}
          />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {
              policy.map((item, index) => (
                Type === "Privacy Policy" && item.sKey === 'privacyPolicy' ?
                  <WebView 
                    source={{ html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=0.7"></head><body>${item.sValue}</body></html>` }} 
                    style={{ width: windowWidth*(96/100), height: windowHeight*(80/100) }}
                    textZoom={100} 
                  />
                  :
                  Type === "Customer Terms and Conditions" && item.sKey === 'customerTerms' ?
                    <WebView 
                      source={{ html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=0.7"></head><body>${item.sValue}</body></html>` }} 
                      style={{ width: windowWidth*(96/100), height: windowHeight*(80/100) }} 
                    />
                    :
                    Type === "Vendor Terms and Conditions" && item.sKey === 'sellerTerms' ?
                      <WebView 
                        source={{ html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=0.7"></head><body>${item.sValue}</body></html>` }} 
                        style={{ width: windowWidth*(96/100), height: windowHeight*(80/100) }} 
                      />
                        :
                        Type === "About Us" && item.sKey === 'aboutus' ?
                          <WebView 
                            source={{ html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=0.7"></head><body>${item.sValue}</body></html>` }} 
                            style={{ width: windowWidth*(96/100), height: windowHeight*(80/100) }} 
                          />
                            :
                            Type === "Refund Policy" && item.sKey === 'refundPolicy' ?
                              <WebView 
                                source={{ html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=0.7"></head><body>${item.sValue}</body></html>` }} 
                                style={{ width: windowWidth*(96/100), height: windowHeight*(80/100) }} 
                              />
                                :
                            null
              ))
            }
          </ScrollView>
            <View style={{ alignItems: 'center', width: windowWidth }}>
              <AuthButton
                BackgroundColor={colours.primaryColor}
                OnPress={() => navigation.goBack()}
                ButtonText={'Back'}
                ButtonWidth={80}
              />
            </View>
            <SupportButton />
        </SafeAreaView>
    )
}

export default TermsConditions



const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        backgroundColor: colours.primaryWhite,
        alignItems: 'center',
    },
    scroll: {
        width: windowWidth*(95/100)
    },
})