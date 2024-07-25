import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, StatusBar, Share, ScrollView, Modal, Dimensions, FlatList, Image, TouchableOpacity, Alert, Pressable, RefreshControl } from 'react-native';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

import Header from '../components/Header';
import colours from '../globals/colours';
import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';
import { getFontontSize, getImage } from '../globals/functions';
import AuthButton from '../components/AuthButton';
import Toast from 'react-native-simple-toast';

import { 
  getVehicleDetails,
  getVehicleList,
  postVehicleDelete,
} from '../api';
import SupportButton from '../components/SupportButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Vehicle = ({ navigation }) => {

  const { showLoader } = React.useContext(LoaderContext);
  const { profile } = React.useContext(AppContext);

  const [ vehicleList, setVehicleList ] = React.useState(null);
  const [ showAlertModal, setShowAlertModal ] = React.useState(false);
  const [ chosenVehicle, setChosenVehicle ] = React.useState(null);


  const fetchInitialData = async() => {
    try{
      showLoader(true);
      let res = await getVehicleList();
      setVehicleList(res);
      showLoader(false);
    } catch(err){
      showLoader(false);
    }
  }


  useFocusEffect(
    React.useCallback(() => {
      fetchInitialData();
    }, []),
  );





  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow logo navigation={navigation} />
      <View style={styles.headerCon}>
        <Text style={styles.fontText1}>My Vehicle</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={false} onRefresh={fetchInitialData} />}
      >
        <FlatList
          data={vehicleList}
          contentContainerStyle={{
            width: windowWidth,
            alignItems:'center'
          }}
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
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.cardOutCon}
              onPress={()=>{setChosenVehicle(item),setShowAlertModal(true)}}
              
            >
              <View style={styles.cardRowCon}>
                <Image
                source={{
                  uri: getImage(item.vehImage1),
                }}
                  style={styles.imageStyle}
                />
                <View style={styles.cardInnerCon}>
                  <Text style={styles.fontText2}>{item?.brandName} {item?.modelName} {item?.manYear}</Text>
                  <Text style={styles.fontText3}>Registration : <Text style={styles.fontText4}>{item?.vehRegNo}</Text></Text>
                  <Text style={styles.fontText3}>Brand Name : <Text style={styles.fontText4}>{item?.brandName}</Text></Text>
                  <Text style={styles.fontText3}>Year Of Make : <Text style={styles.fontText4}>{item?.manYear}</Text></Text>
                  <Text style={styles.fontText3}>Price : <Text style={[styles.fontText2,{color: colours.primaryRed}]}>₹ {item?.vehPrice}</Text></Text>
                </View>
              </View>
              <View style={styles.lowerRowCon}>
                { 
                  item.status?
                  <View style={styles.statusCon}>
                    <Text style={[styles.fontText2,{color: colours.primaryWhite}]}>Approved</Text>
                  </View>
                  :
                  <View style={[styles.statusCon,{backgroundColor: colours.lightRed}]}>
                    <Text style={[styles.fontText2,{color: colours.primaryWhite}]}>Not Approved</Text>
                  </View>
                }
              </View>
              {
                item.auctionStatus&&(
                  <View style={styles.lowerRowCon}>
                    <View style={[styles.statusCon,{backgroundColor: colours.primaryYellow}]}>
                      <Text style={[styles.fontText2,{color: colours.primaryWhite}]}>{item.auctionStatus}</Text>
                    </View>
                </View>

                )
              }
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      <Modal
        animationType="slide"
        visible={showAlertModal}
        transparent={true}
        onRequestClose={()=>setShowAlertModal(false)}
      >
        <Pressable style={{width:windowWidth, height: windowHeight, backgroundColor: 'rgba(100, 100, 100,0.3)'}} onPress={()=>setShowAlertModal(false)}>
          <Pressable style={styles.updateModalView1}>
            <Text style={styles.fontText1}>Choose your action</Text>
            <View style={{flexDirection:'row', width:windowWidth*(90/100), justifyContent: 'space-around'}}>
               
                <AuthButton
                    FirstColor={colours.lightRed}
                    SecondColor={colours.lightRed}
                    OnPress={() => { 
                      Alert.alert(
                        "Are you sure want to delete this vehicle?",
                        "",
                        [
                          {
                            text: "No",
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                          {
                            text: "Yes",
                            onPress: async() => {
                              try{
                                let res = await postVehicleDelete( {
                                  sp: "delVehicleBySeller",
                                  vehId: chosenVehicle.vehId,
                                  sellerId: profile[0].sellerId,
                                });
                                setShowAlertModal(false);
                                Toast.show('Deleted successfully')
                                fetchInitialData();
                              } catch(err){
                                Alert.alert("Error", err?.message ? err.message : "Something went wrong");
                                setShowAlertModal(false);
                              }
                            },
                            style: 'cancel',
                          },
                        ],
                        { cancelable: false },
                      );
                    }}
                    ButtonText={'DELETE'}
                    ButtonWidth={40}
                />
                {
                  chosenVehicle && !chosenVehicle.status&&(
                    <AuthButton
                        BackgroundColor={colours.primaryColor}
                        OnPress={async()=>{
                          try{
                            let res = await getVehicleDetails(profile[0].sellerId, chosenVehicle.vehId);
                            setShowAlertModal(false);
                            navigation.navigate('VehicleUpdate',{vehicleDetails : res[0]})
                          } catch(err){
                            Alert.alert("Error", err?.message ? err.message : "Something went wrong");
                            setShowAlertModal(false);
                          }
                        }}
                        ButtonText={'UPDATE'}
                        ButtonWidth={40}
                    />

                  )
                }
            </View>
          </Pressable> 
        </Pressable>
      </Modal>
      <SupportButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundColor,
    alignItems: "center"
  },
  headerCon: {
    width: windowWidth,
    height: windowHeight*(7/100),
    justifyContent:'center',
    paddingHorizontal: windowWidth*(5/100),
  },
  cardOutCon: {
    backgroundColor: colours.primaryWhite,
    width: windowWidth*(90/100),
    padding: windowWidth*(2/100),
    marginBottom:10,
    borderRadius:5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 6.68,
    shadowColor:  colours.primaryColor,
    elevation: 7,
  },
  cardRowCon: {
    width: windowWidth*(86/100),
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  cardInnerCon: {
    width: windowWidth*(56/100),
    height: windowWidth*(28/100),
    justifyContent:'space-between'
  },
  imageStyle: {
    width: windowWidth*(28/100),
    height: windowWidth*(28/100),
    borderColor:colours.lowBlue,
    borderRadius: 10,
  },
  lowerRowCon:{
    width: windowWidth*(90/100),
  },
  statusCon: {
    width: windowWidth*(86/100),
    height: windowHeight*(4/100),
    marginTop:  windowWidth*(2/100),
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 5,
    backgroundColor: colours.primaryGreen
  },
  updateModalView1: {
    height: windowHeight * (25 / 100),
    marginTop: windowHeight * (75 / 100),
    paddingTop: windowHeight * (5 / 100),
    paddingBottom: windowHeight * (5 / 100),
    backgroundColor: colours.primaryWhite,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    elevation: 10,
    alignItems: "center",
    justifyContent:'space-between'
  },
  fontText1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.primaryBlue
  },
  fontText2: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(14),
    color: colours.primaryBlue
  },
  fontText3: {
    fontFamily: 'Poppins-Regular',
    fontSize: getFontontSize(12),
    color: colours.gray
  },
  fontText4: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontontSize(12),
    color: colours.blue
  },
});

export default Vehicle;