import React from 'react';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import {SafeAreaView, StyleSheet, View, Text, StatusBar, Dimensions, ScrollView, TouchableOpacity, Modal, TextInput, Image, FlatList, Pressable, Alert, Platform, KeyboardAvoidingView} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import ImagePicker from 'react-native-image-crop-picker';
import ReactNativeBlobUtil from 'react-native-blob-util'
// import Toast from 'react-native-simple-toast';
import Toast from 'react-native-toast-message'

import { LoaderContext } from '../Context/loaderContext';
import { AppContext } from '../Context/appContext';
import Header from '../components/Header';
import colours from '../globals/colours';
import { getFontontSize } from '../globals/functions';
import AuthButton from '../components/AuthButton';
import { showIcon } from '../globals/icons';
import TextInputComponent from '../components/TextInputComponent';
import TextInputMultiLineComponent from '../components/TextInputMultiLineComponent';
import DocumentPicker, { types } from 'react-native-document-picker';

import { 
  getBrandList,
  getBrandModelList, 
  getBrandModelVariantList,
  getVehicleTypeList,
  getVehicleFuelTypeList,
  getInsuranceTypeList,
  getStateList,
  getDistrictList,
  getCityList,
  postAddNewVehicle
} from '../api';
import SupportButton from '../components/SupportButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AddVehicle = ({navigation}) => {


  const { showLoader } = React.useContext(LoaderContext);
  const { profile } = React.useContext(AppContext);

  const [ imageArray, setImageArray ] = React.useState({
    vehImage1: "",
    vehImage2: "",
    vehImage3: "",
    vehImage4: "",
    vehImage5: "",
    vehImage6: "",
    vehImage7: "",
    vehImage8: "",
    vehImage9: "",
    vehImage10: "",
    vehImage11: "",
    vehImage12: "",
    vehImage13: "",
    vehImage14: "",
    vehImage15 : "",
    vehImage16 : "",
    vehImage17 : "",
    vehImage18 : "",
    vehImage19 : "",
    vehImage20 : "",
    vehImage21 : "",
    vehImage22 : "",
    vehImage23 : "",
    vehImage24 : "",
    vehImage25 : "",
    vehImage26 : "", 
    vehImage27 : "",
    vehImage28 : "",
    vehImage29 : "",
    vehImage30 : "",
  })

  const [ radioValues, setRadioValues ] = React.useState({
    ABS : null,
    Accidental : null,
    Roof_AC : null,
    Alloy_Wheels : null,
    Anti_Theft : null,
    Power_Window : null,
    Rear_Wiper : null,
    Navigation_System : null,
    Parking_Sensors : null,
    Power_Steering : null,
    Music_System : null,
    Rear_Parking_Camera : null,
    Keyless_Entry : null,
    Remote_Control : null,
    Service_History : null,
    Sunroof : null,
    Cruise_Control : null,
    Warranty : null,
    Vehicle_Certified : null,
    AC : null,
  });

  

  const labels = ["Vehicle Details","Additional Details","Location Details","Vehicle Features","Vehicle Images"];
  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize:30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: colours.blue,
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: colours.primaryPink,
    stepStrokeUnFinishedColor: colours.blue,
    separatorFinishedColor: colours.primaryPink,
    separatorUnFinishedColor: colours.blue,
    stepIndicatorFinishedColor: colours.primaryPink,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: colours.primaryPink,
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: colours.blue,
    labelColor: colours.primaryPink,
    labelSize: 13,
    currentStepLabelColor: colours.blue
  }
  const [ dummy, setDummy ] = React.useState(true);

  const [ stepValue, setStepValue ] = React.useState('STEP1');
  const [ imagesChoosen, setImagesChoosen ] = React.useState(null);
  const [ imagesCHoosenB64, setImagesChoosenB64 ] = React.useState(null);
  const [ historyImagesChoosen, setHistoryImagesChoosen ] = React.useState(null);

  const [ stateData, setStateData ] = React.useState(null);
  const [ stateChoosen, setStateChoosen ] = React.useState('STATE');
  const [ stateModal, setStateModal ] = React.useState(false);
  const [ stateError, setStateError ] = React.useState(false);
  const [ stateKeyword, setStateKeyword ] = React.useState('');
 
  const [ districtData, setDistrictData ] = React.useState(null);
  const [ districtChoosen, setDistrictChoosen ] = React.useState('DISTRICT');
  const [ districtModal, setDistrictModal ] = React.useState(false);
  const [ districtError, setDistrictError ] = React.useState(false);
  const [ districtKeyword, setDistrictKeyword ] = React.useState('');
 
  const [ cityData, setCityData ] = React.useState(null);
  const [ cityChoosen, setCityChoosen ] = React.useState('CITY');
  const [ cityModal, setCityModal ] = React.useState(false);
  const [ cityError, setCityError ] = React.useState(false);
  const [ cityKeyword, setCityKeyword ] = React.useState('');
 
  const [ brandData, setBrandData ] = React.useState(null);
  const [ brandChoosen, setBrandChoosen ] = React.useState('BRAND');
  const [ brandModal, setBrandModal ] = React.useState(false);
  const [ brandError, setBrandError ] = React.useState(false);
  const [ brandKeyword, setBrandKeyword ] = React.useState('');
 
  const [ brandModelData, setBrandModelData ] = React.useState(null);
  const [ brandModelChoosen, setBrandModelChoosen ] = React.useState('MODEL');
  const [ brandModelModal, setBrandModelModal ] = React.useState(false);
  const [ brandModelError, setBrandModelError ] = React.useState(false);
  const [ brandModelKeyword, setBrandModelKeyword ] = React.useState('');

  const [ brandModelVariantData, setBrandModelVariantData ] = React.useState(null);
  const [ brandModelVariantChoosen, setBrandModelVariantChoosen ] = React.useState('VARIANT');
  const [ brandModelVariantModal, setBrandModelVariantModal ] = React.useState(false);
  const [ brandModelVariantError, setBrandModelVariantError ] = React.useState(false);
  const [ brandModelVariantKeyword, setBrandModelVariantKeyword ] = React.useState('');

  const [ vehicleTypeData, setVehicleTypeData ] = React.useState(null);
  const [ vehicleTypeChoosen, setVehicleTypeChoosen ] = React.useState('VEHICLE TYPE');
  const [ vehicleTypeModal, setVehicleTypeModal ] = React.useState(false);
  const [ vehicleTypeError, setVehicleTypeError ] = React.useState(false);
  const [ vehicleTypeKeyword, setVehicleTypeKeyword ] = React.useState('');

  const [ vehicleFuelTypeData, setVehicleFuelTypeData ] = React.useState(null);
  const [ vehicleFuelTypeChoosen, setVehicleFuelTypeChoosen ] = React.useState('VEHICLE FUEL TYPE');
  const [ vehicleFuelTypeModal, setVehicleFuelTypeModal ] = React.useState(false);
  const [ vehicleFuelTypeError, setVehicleFuelTypeError ] = React.useState(false);
  const [ vehicleFuelTypeKeyword, setVehicleFuelTypeKeyword ] = React.useState('');

  const [ vehicleInsuranceData, setVehicleInsuranceData ] = React.useState(null);
  const [ vehicleInsuranceChoosen, setVehicleInsuranceChoosen ] = React.useState('Vehicle Insurance');
  const [ vehicleInsuranceModal, setVehicleInsuranceModal ] = React.useState(false);
  const [ vehicleInsuranceError, setVehicleInsuranceError ] = React.useState(false);
  const [ vehicleInsuranceKeyword, setVehicleInsuranceKeyword ] = React.useState('');

  const [ vehicleRegNum, setVehicleRegNum ] = React.useState('');
  const [ vehicleKMClocked, setVehicleKMClocked ] = React.useState('');
  const [ vehiclePrice, setVehiclePrice ] = React.useState('');
  const [ vehicleYOM, setVehicleYOM ] = React.useState('');
  const [ vehicleColor, setVehicleColor ] = React.useState('');
  const [ vehicleHp, setVehicleHP ] = React.useState('Manual');
  const [ vehicleDescription, setVehicleDescription ] = React.useState('');

  const [ vehicleRegNumError, setVehicleRegNumError ] = React.useState(false);
  const [ vehicleKMClockedError, setVehicleKMClockedError ] = React.useState(false);
  const [ vehiclePriceError, setVehiclePriceError ] = React.useState(false);
  const [ vehicleYOMError, setVehicleYOMError ] = React.useState(false);

  const [ ownership, setOwnership ] = React.useState('');
  const [ ownershipModal, setOwnershipModal ] = React.useState(false);
  const [ ownershipError, setOwnershipError ] = React.useState(false);
  const [ ownershipErrorMessage, setOwnershipErrorMessage ] = React.useState('');
  const ownershipTypes = ["Owner 1","Owner 2","Owner 3","Owner 4"];

  const fetchInitialData = async() => {
    try{
      showLoader(true);
      let res = await getBrandList();
      setBrandData(res)
      let res1 = await getVehicleTypeList();
      setVehicleTypeData(res1)
      let res2 = await getInsuranceTypeList();
      setVehicleInsuranceData(res2)
      let res3 = await getVehicleFuelTypeList();
      setVehicleFuelTypeData(res3)
      let res4 = await getStateList();
      setStateData(res4)
      showLoader(false);
    } catch(err){
      showLoader(false);
    }
  }

  const loadBrandModel = async(value) => {
    try{
      let res = await getBrandModelList(value);
      setBrandModelData(res)
    } catch(err){
      showLoader(false);
    }
  }

  const loadBrandModelVariant = async(value) => {
    try{
      let res = await getBrandModelVariantList(value);
      setBrandModelVariantData(res)
    } catch(err){
      showLoader(false);
    }
  }

  const loadStateDistrict = async(value) => {
    try{
      let res = await getDistrictList(value);
      setDistrictData(res)
    } catch(err){
      showLoader(false);
    }
  }

  const loadStateDistrictCity = async(value) => {
    try{
      let res = await getCityList(value);
      setCityData(res)
    } catch(err){
      showLoader(false);
    }
  }

  
  useFocusEffect(
    React.useCallback(() => {
      fetchInitialData();
    }, []),
  );


  const completeStep1 = async() => {
    const BrandError = brandChoosen === 'BRAND';
    const ModelError = brandModelChoosen === 'MODEL';
    const VariantError = brandModelVariantChoosen === 'VARIANT';
    const TypeError = vehicleTypeChoosen === 'VEHICLE TYPE';
    const FuelTypeError = vehicleFuelTypeChoosen === 'VEHICLE FUEL TYPE';

    if(!(
      BrandError ||
      ModelError ||
      VariantError ||
      TypeError ||
      FuelTypeError 
    )){
      setStepValue('STEP2')
    } else{
      setBrandError(BrandError);
      setBrandModelError(ModelError);
      setBrandModelVariantError(VariantError);
      setVehicleTypeError(TypeError);
      setVehicleFuelTypeError(FuelTypeError);
    }
  }

  const completeStep2 = async() => {

    const RegNumError = vehicleRegNum === '';
    const KMClockedError = vehicleKMClocked === '';
    const PriceError = vehiclePrice === '';
    const YOMError = vehicleYOM === '';
    const OwnError = ownership === '';


    if(!(
      RegNumError ||
      KMClockedError ||
      PriceError ||
      YOMError ||
      OwnError
    )){
      setStepValue('STEP3')
    } else{
      setVehicleRegNumError(RegNumError);
      setVehicleKMClockedError(KMClockedError);
      setVehiclePriceError(PriceError);
      setVehicleYOMError(YOMError);
      setOwnershipError(OwnError)
    }
  }

  const completeStep3 = async() => {

    const StateError = stateChoosen === 'STATE';
    const DistrictError = districtChoosen === 'DISTRICT';
    const CityError = cityChoosen === 'CITY';


    if(!(
      StateError ||
      DistrictError ||
      CityError
    )){
      setStepValue('STEP4')
    } else{
      setStateError(StateError);
      setDistrictError(DistrictError);
      setCityError(CityError);
    }
  }

  const selectMultipleImages = async() => {
    ImagePicker.openPicker({
        width: 300,
        height: 400,
        multiple: true,
        maxFiles:30,
        cropping: true
    }).then(async(image) => {
        setImagesChoosen(image),
        setDummy(!dummy);
        await fileToBase64(image)
    });
  }

  
  const handleDocumentSelection = async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf, types.docx, types.images]
      });
      setHistoryImagesChoosen(`data:${response[0].type};base64,${await ReactNativeBlobUtil.fs.readFile(Platform.OS == 'ios'? response[0].uri.split("file://").join("") : path, 'base64')}`)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        // Toast.show('Error occurred:', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err?err:''
        });
      }
    }
  }

  const selectSingleImage = async(value) => {
    ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true
    }).then(async(image) => {
        imageArray[value] = "",
        imageArray[value] = `data:${image.mime};base64,${await ReactNativeBlobUtil.fs.readFile(image.path,'base64')}`
        setImageArray(imageArray);
        setDummy(!dummy);

    });
  }

  
  const fileToBase64 = async(image) => {
    Object.keys(imageArray).map( async(item,index)=>{
      if(index<image.length){
          imageArray[item] = `data:${image[index]?.mime?image[index]?.mime:''};base64,${await ReactNativeBlobUtil.fs.readFile(image[index]?.path,'base64')}`,
          setImageArray(imageArray),
          setDummy(!dummy)
      }else{
        imageArray[item] = "",
        setImageArray(imageArray),
        setDummy(!dummy)
      }
  })
  fetchInitialData()
}


  const addNewVehicle = async() => {
    let data = {
      sp: "insVehicle",
      defaultImage:0,
      sellerId: profile[0].sellerId,
      vehRegNo: vehicleRegNum,
      vehPrice: vehiclePrice,
      vehMinPrice: 0,
      vehdescription: vehicleDescription,
      InsuranceTypeId:vehicleInsuranceChoosen?.InsuranceTypeId?vehicleInsuranceChoosen?.InsuranceTypeId:'',
      locId: cityChoosen?.locId? cityChoosen?.locId:'',
      kmClocked: vehicleKMClocked,
      manYear: vehicleYOM,
      underWarantee: radioValues.Warranty? radioValues.Warranty : false,
      abs: radioValues.ABS? radioValues.ABS : false,
      accidental: radioValues.Accidental? 1 : 0,
      adjustableSteering: radioValues.Roof_AC? radioValues.Roof_AC : false,
      alloyWheels: radioValues.Alloy_Wheels? radioValues.Alloy_Wheels : false,
      antiTheftDevice: radioValues.Anti_Theft? radioValues.Anti_Theft : false,
      auxCompatibility: radioValues.Power_Window? 1 : 0,
      Color: vehicleColor,
      bluetooth: radioValues.Rear_Wiper? radioValues.Rear_Wiper : false,
      navigationSystem: radioValues.Navigation_System? radioValues.Navigation_System : false,
      parkingSensors: radioValues.Parking_Sensors? 1 : 0,
      powerSteering: radioValues.Power_Steering? radioValues.Power_Steering : false,
      FMRadio: radioValues.Music_System? radioValues.Music_System : false,
      rearParkingCamera: radioValues.Rear_Parking_Camera? radioValues.Rear_Parking_Camera : false,
      exchange: radioValues.Keyless_Entry? radioValues.Keyless_Entry : false,
      finance: radioValues.Remote_Control? radioValues.Remote_Control : false,
      serviceHistory: radioValues.Service_History? radioValues.Service_History : false,
      usb: radioValues.Cruise_Control? radioValues.Cruise_Control : false,
      HP: vehicleHp,
      AC: radioValues.AC? radioValues.AC : false,
      variant: brandModelVariantChoosen,
      sunroof: radioValues.Sunroof? radioValues.Sunroof : false,
      vehImage1: imageArray.vehImage1,
      vehImage2: imageArray.vehImage2,
      vehImage3: imageArray.vehImage3,
      vehImage4: imageArray.vehImage4,
      vehImage5: imageArray.vehImage5,
      vehImage6: imageArray.vehImage6,
      vehImage7: imageArray.vehImage7,
      vehImage8: imageArray.vehImage8,
      vehImage9: imageArray.vehImage9,
      vehImage10: imageArray.vehImage10,
      vehImage11: imageArray.vehImage11,
      vehImage12: imageArray.vehImage12,
      vehImage13: imageArray.vehImage13,
      vehImage14: imageArray.vehImage14,
      vehImage15: imageArray.vehImage15,
      vehImage16: imageArray.vehImage16,
      vehImage17: imageArray.vehImage17,
      vehImage18: imageArray.vehImage18,
      vehImage19: imageArray.vehImage19,
      vehImage20: imageArray.vehImage20,
      vehImage21: imageArray.vehImage21,
      vehImage22: imageArray.vehImage22,
      vehImage23: imageArray.vehImage23,
      vehImage24: imageArray.vehImage24,
      vehImage25: imageArray.vehImage25,
      vehImage26: imageArray.vehImage26,
      vehImage27: imageArray.vehImage27,
      vehImage28: imageArray.vehImage28,
      vehImage29: imageArray.vehImage29,
      vehImage30: imageArray.vehImage30,
      vehTypeId: vehicleTypeChoosen?.vehTypeId ? vehicleTypeChoosen?.vehTypeId : "",
      brandName: brandChoosen,
      modelName: brandModelChoosen,
      vehicleHistoryUrl: historyImagesChoosen?historyImagesChoosen:"",
      fuelTypeId: vehicleFuelTypeChoosen?.fuelTypeId ? vehicleFuelTypeChoosen?.fuelTypeId : "",
      ownership: ownership
    }


    try{
      showLoader(true)
      let res = await postAddNewVehicle(data);
      Toast.show("New Vehicle Added")
      showLoader(false)
      navigation.goBack();
    } catch(err){
      showLoader(false)
      Toast.show(err?.Message?err?.Message : 'Something went wrong')
    }
  }





  return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header backarrow logo navigation={navigation} />
      <View style={styles.headerCon}>
        <Text style={styles.fontText1}>Add New Vehicle</Text>
      </View>
      <View style={styles.headerCon}>
        <StepIndicator
          stepCount={5}
          customStyles={customStyles}
          currentPosition={stepValue == 'STEP1' ? 0 : stepValue == 'STEP2' ? 1 : stepValue == 'STEP3' ? 2 : stepValue == 'STEP4' ? 3 : 4}
          labels={labels}
        />
      </View>
      <Text />
      <Text />
      <Text />
      <ScrollView contentContainerStyle={{paddingBottom:20}} showsVerticalScrollIndicator={false}>
        {
          stepValue == 'STEP1' ?
          <View style={{
            width: windowWidth,
            alignItems:'center'
          }}>
            <Dropdown
              State={brandChoosen}
              OnPress={() =>
                brandData && brandData.length === 0
                  ? Toast.show('Brand List Is Empty')
                  : setBrandModal(true)
              }
              Error={brandError}
            />
            <Dropdown
              State={brandModelChoosen}
              OnPress={() =>
                brandModelData && brandModelData.length === 0
                  ? Toast.show('Model List Is Empty')
                  : setBrandModelModal(true)
              }
              Error={brandModelError}
            />
            <Dropdown
              State={brandModelVariantChoosen}
              OnPress={() =>
                brandModelVariantData && brandModelVariantData.length === 0
                  ? Toast.show('Varient List Is Empty')
                  : setBrandModelVariantModal(true)
              }
              Error={brandModelVariantError}
            />
            <Dropdown
              State={vehicleTypeChoosen?.vehTypeName? vehicleTypeChoosen?.vehTypeName :vehicleTypeChoosen}
              OnPress={() =>
                vehicleTypeData && vehicleTypeData.length === 0
                  ? Toast.show('Type List Is Empty')
                  : setVehicleTypeModal(true)
              }
              Error={vehicleTypeError}
            />
            <Dropdown
              State={vehicleFuelTypeChoosen?.fuelTypeName?vehicleFuelTypeChoosen?.fuelTypeName:vehicleFuelTypeChoosen}
              OnPress={() =>
                vehicleFuelTypeData && vehicleFuelTypeData.length === 0
                  ? Toast.show('Type List Is Empty')
                  : setVehicleFuelTypeModal(true)
              }
              Error={vehicleFuelTypeError}
            />
            <Dropdown
              State={vehicleInsuranceChoosen?.InsuranceTypeName?vehicleInsuranceChoosen?.InsuranceTypeName:vehicleInsuranceChoosen}
              OnPress={() =>
                vehicleInsuranceData && vehicleInsuranceData.length === 0
                  ? Toast.show('Insurance List Is Empty')
                  : setVehicleInsuranceModal(true)
              }
              Error={vehicleInsuranceError}
            />
          </View>
          :
          stepValue == 'STEP2' ?
          <View style={{
            width: windowWidth,
            alignItems:'center'
          }}>
            <TextInputComponent
              OnChangeText={(text) => {
                setVehicleRegNum(text);
                setVehicleRegNumError(false);
              }}
              Width={90}
              Heading={'Registration Number *'}
              Placeholder={'MP 09 AB 1234'}
              value={vehicleRegNum}
              Error={vehicleRegNumError}
            />
            <TextInputComponent
              OnChangeText={(text) => {
                setVehicleKMClocked(text);
                setVehicleKMClockedError(false);
              }}
              Width={90}
              Heading={'Km Clocked *'}
              Placeholder={'Km Clocked'}
              value={vehicleKMClocked}
              Error={vehicleKMClockedError}
            />
            <TextInputComponent
              OnChangeText={(text) => {
                setVehiclePrice(text);
                setVehiclePriceError(false);
              }}
              Width={90}
              Heading={'Price *'}
              Placeholder={'Price'}
              value={vehiclePrice}
              Error={vehiclePriceError}
              PriceIn={'YES'}
            />
            <TextInputComponent
              OnChangeText={(text) => {
                setVehicleYOM(text);
                setVehicleYOMError(false);
              }}
              Width={90}
              Heading={'Year of make *'}
              Placeholder={'Year of make'}
              value={vehicleYOM}
              Error={vehicleYOMError}
            />
            <TextInputComponent
              OnChangeText={(text) => {
                setVehicleColor(text);
              }}
              Width={90}
              Heading={'Vehicle color'}
              Placeholder={'Vehicle Color in RC '}
              value={vehicleColor}
            />

            <View style={{
                width: windowWidth*(90/100),
                marginVertical: windowHeight*(1/100)
              }}>
              <Text style={styles.fontText3}>Transmission</Text>
              <View style={{
                flexDirection:'row',
                justifyContent:'space-around',
                alignItems: 'center',
                width: windowWidth*(90/100),
                paddingVertical:windowHeight*(1/100),

              }}>
                <CustomRadioButton
                  state={vehicleHp == 'Manual'? true : false}
                  TextValue={'Manual'}
                  OnPress={() =>{
                    setVehicleHP('Manual');
                    setDummy(!dummy);
                  }}
                />
                <CustomRadioButton
                  state={vehicleHp == 'Automatic'? true : false}
                  TextValue={'Automatic'}
                  OnPress={() =>{
                    setVehicleHP('Automatic');
                    setDummy(!dummy);
                  }}
                />
              </View>
            </View>
            <Dropdown
              State={ownership !== ''?ownership:'Ownership'}
              OnPress={() => setOwnershipModal(true)}
              Error={ownershipError}
            />
            <Text />
            <TextInputMultiLineComponent
              OnChangeText={(text) => {
                setVehicleDescription(text);
              }}
              Width={90}
              Heading={'Description/Note'}
              Placeholder={'Vehicle description / Dealer notes '}
              value={vehicleDescription}
            />

          </View>
          :
          stepValue == 'STEP3' ?
          <View style={{
            width: windowWidth,
            alignItems:'center'
          }}>
            <Dropdown
              State={stateChoosen}
              OnPress={() =>
                stateData && stateData.length === 0
                  ? Toast.show('State List Is Empty')
                  : setStateModal(true)
              }
              Error={stateError}
            />
            <Dropdown
              State={districtChoosen}
              OnPress={() =>
                districtData && districtData.length === 0
                  ? Toast.show('District List Is Empty')
                  : setDistrictModal(true)
              }
              Error={districtError}
            />
            <Dropdown
              State={cityChoosen?.locName?cityChoosen?.locName:cityChoosen}
              OnPress={() =>
                cityData && cityData.length === 0
                  ? Toast.show('City List Is Empty')
                  : setCityModal(true)
              }
              Error={cityError}
            />
          </View>
          :
          stepValue == 'STEP4' ?
          <View style={{width:windowWidth, alignItems:'center'}}>
            {
             Object.keys(radioValues).map((item, index)=>(
              <View style={{
                width: windowWidth*(90/100),
                marginVertical: windowHeight*(1/100)
              }}>
                <Text style={styles.fontText1}>{index+1}. {item.split("_").join(" ").toUpperCase()}</Text>
                <View style={{
                  flexDirection:'row',
                  justifyContent:'space-around',
                  alignItems: 'center',
                  width: windowWidth*(90/100),
                  paddingVertical:windowHeight*(1/100),

                }}>
                  <CustomRadioButton
                    state={radioValues[item] == true? true : false}
                    TextValue={'YES'}
                    OnPress={() =>{
                      radioValues[item ]= true;
                      setRadioValues(radioValues);
                      setDummy(!dummy);
                    }}
                  />
                  <CustomRadioButton
                    state={radioValues[item] == false ? true : false}
                    TextValue={'NO'}
                    OnPress={() =>{
                      radioValues[item] = false;
                      setRadioValues(radioValues);
                      setDummy(!dummy);
                    }}
                  />
                </View>
              </View>
              ))
            }
          </View>
          :
          stepValue == 'STEP5' ?
          <View style={{width:windowWidth, alignItems:'center'}}>
            <AuthButton
              // OnPress={()=>selectHistoryImages()}
              OnPress={()=>handleDocumentSelection()}
              ButtonText={'Choose Vehicle History'}
              ButtonWidth={88}
              ButtonHeight={4.5}
              FirstColor={colours.lightRed}
              SecondColor={colours.primaryPink}
            />
            {/* {
              historyImagesChoosen&&(
                <Image
                  source={{uri: historyImagesChoosen}}
                  style={styles.imageStyle}
                />
              )
            } */}
            {
              historyImagesChoosen?
              historyImagesChoosen.includes('data:image/')?
              <Image
                source={{uri:historyImagesChoosen}}
                style={styles.imageStyle}
              />
              :
              <TouchableOpacity 
                style={[styles.imageStyle,{backgroundColor: colours.primaryWhite}]}
                // onPress={()=>selectHistoryImages()}
                onPress={()=>handleDocumentSelection()}
                >
                <Text style={styles.fontText1}>File Added</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity 
                style={[styles.imageStyle,{backgroundColor: colours.primaryWhite}]}
                // onPress={()=>selectHistoryImages()}
                onPress={()=>handleDocumentSelection()}
                >
                <Text style={styles.fontText1}>+ ADD</Text>
              </TouchableOpacity>
            
            }
            <AuthButton
              OnPress={()=>selectMultipleImages()}
              ButtonText={'Choose Vehicle Images'}
              ButtonWidth={88}
              ButtonHeight={4.5}
              FirstColor={colours.primaryColor}
              SecondColor={colours.lightBlue}
            />
            {/* {imagesChoosen&&(
              <FlatList
                data={imagesChoosen}
                contentContainerStyle={{
                  width:windowWidth*(90/100)
                }}
                ItemSeparatorComponent={<View style={{height: windowWidth*(3/100)}} />}
                columnWrapperStyle={{justifyContent: 'space-evenly'}}
                numColumns={3}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <Image
                    source={{uri: item.path}}
                    style={styles.imageStyle}
                  />
                )}
              />
            )} */}
            {/* {imagesChoosen?(
              <FlatList
                data={imagesChoosen}
                contentContainerStyle={{
                  width:windowWidth*(90/100)
                }}
                ItemSeparatorComponent={<View style={{height: windowWidth*(3/100)}} />}
                columnWrapperStyle={{justifyContent: 'space-evenly'}}
                numColumns={3}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <Image
                    source={{uri: item.path}}
                    style={styles.imageStyle}
                  />
                )}
              />
              )
              : */}
               <ScrollView>
                  <FlatList
                    data={Object.keys(imageArray)}
                    contentContainerStyle={{
                      width:windowWidth*(90/100)
                    }}
                    ItemSeparatorComponent={<View style={{height: windowWidth*(3/100)}} />}
                    columnWrapperStyle={{justifyContent: 'space-evenly'}}
                    numColumns={3}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                      imageArray[item] !== ""?
                      <TouchableOpacity onPress={()=>{
                        Alert.alert(
                          "Choose an action",
                          "",
                          [
                            {
                              text: "CANCEL",
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                            {
                              text: "DELETE",
                              onPress: async() => {
                                imageArray[item] = "";
                                setImageArray(imageArray);
                                setDummy(!dummy);

                              },
                              style: 'cancel',
                            },
                            {
                              text: "REPLACE",
                              onPress: async () => {
                                selectSingleImage(item)
                              },
                            },
                          ],
                          { cancelable: false },
                        );
                      }}>
                        <Image
                          source={{uri: imageArray[item].includes('data:')? imageArray[item] : getImage(imageArray[item])}}
                          style={styles.imageStyle}
                        />
                      </TouchableOpacity>
                      :
                      <TouchableOpacity style={[styles.imageStyle,{backgroundColor: colours.primaryWhite}]} onPress={()=>selectSingleImage(item)}>
                        <Text style={styles.fontText1}>+ ADD</Text>

                      </TouchableOpacity>
                    )}
                  />
                  </ScrollView>   
               {/* } */}
          </View>
          :
          null
        }
      </ScrollView>
      {
          stepValue == 'STEP1' ?
          <View style={styles.bottomButtonCon}>
            <AuthButton
              ButtonText={'Back'}
              ButtonWidth={44}
              ButtonHeight={4.5}
              FirstColor={colours.lightGrey}
              SecondColor={colours.lightGrey}
            />
            <AuthButton
              OnPress={() => completeStep1()}
              ButtonText={'Next'}
              ButtonWidth={44}
              ButtonHeight={4.5}
              FirstColor={colours.primaryColor}
              SecondColor={colours.lightBlue}
            />
          </View>
        :
        stepValue == 'STEP2' ?
          <View style={styles.bottomButtonCon}>
            <AuthButton
              OnPress={() => setStepValue('STEP1')}
              ButtonText={'Back'}
              ButtonWidth={44}
              ButtonHeight={4.5}
              FirstColor={colours.lightRed}
              SecondColor={colours.primaryPink}
            />
            <AuthButton
              OnPress={() => completeStep2()}
              ButtonText={'Next'}
              ButtonWidth={44}
              ButtonHeight={4.5}
              FirstColor={colours.primaryColor}
              SecondColor={colours.lightBlue}
            />
          </View>
        :
        stepValue == 'STEP3' ?
          <View style={styles.bottomButtonCon}>
            <AuthButton
              OnPress={() => setStepValue('STEP2')}
              ButtonText={'Back'}
              ButtonWidth={44}
              ButtonHeight={4.5}
              FirstColor={colours.lightRed}
              SecondColor={colours.primaryPink}
            />
            <AuthButton
              OnPress={() => completeStep3()}
              ButtonText={'Next'}
              ButtonWidth={44}
              ButtonHeight={4.5}
              FirstColor={colours.primaryColor}
              SecondColor={colours.lightBlue}
            />
          </View>
        :
        stepValue == 'STEP4' ?
          <View style={styles.bottomButtonCon}>
            <AuthButton
              OnPress={() => setStepValue('STEP3')}
              ButtonText={'Back'}
              ButtonWidth={44}
              ButtonHeight={4.5}
              FirstColor={colours.lightRed}
              SecondColor={colours.primaryPink}
            />
            <AuthButton
              OnPress={() => setStepValue('STEP5')}
              ButtonText={'Next'}
              ButtonWidth={44}
              ButtonHeight={4.5}
              FirstColor={colours.primaryColor}
              SecondColor={colours.lightBlue}
            />
          </View>
        :
        stepValue == 'STEP5' ?
          <View style={styles.bottomButtonCon}>
            <AuthButton
              OnPress={() => setStepValue('STEP4')}
              ButtonText={'Back'}
              ButtonWidth={44}
              ButtonHeight={4.5}
              FirstColor={colours.lightRed}
              SecondColor={colours.primaryPink}
            />
            <AuthButton
              // OnPress={() => imagesCHoosenB64 !== null? addNewVehicle() : Toast.show('Please upload atleast 4 vehicle images')}
              OnPress={() =>  (imageArray.vehImage1 !=='' && imageArray.vehImage2 !=='' && imageArray.vehImage3 !=='' && imageArray.vehImage4 !=='') && (historyImagesChoosen !== null || historyImagesChoosen !=='') ? addNewVehicle() : Toast.show('Please upload vehicle history and atleast 4 vehicle images ')}
              ButtonText={'Submit'}
              ButtonWidth={44}
              ButtonHeight={4.5}
              FirstColor={colours.primaryColor}
              SecondColor={colours.lightBlue}
            />
          </View>
        :
        null

      }




      {/* Ownership Modal */}
      {
        ownershipTypes&&ownershipTypes.length > 0 && (
        <Modal animationType="fade" transparent={true} visible={ownershipModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalHeaderCon}>
              <View
                style={{
                  width: windowWidth * (60 / 100),
                }}>
                <Text style={styles.fontText2}>Select A Ownership Type</Text>
              </View>
              <TouchableOpacity
                onPress={() => setOwnershipModal(false)}
                style={{ width: windowWidth * (10 / 100), padding: 10 }}>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: getFontontSize(20), }}>X</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={styles.modalScrollCon}>
              {ownershipTypes.map((item, i) => (
                  <TouchableOpacity
                    style={styles.modalRow}
                    key={i}
                    onPress={() => {
                      setOwnership(item);
                      setOwnershipModal(false);
                    }}>
                    <Text style={styles.modalRowText} numberOfLines={1}>
                      {item.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </Modal>
      )}

      {/* Brand Selection */}
      
      {
        brandData&&brandData.length > 0 && (
        <Modal animationType="fade" transparent={true} visible={brandModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalHeaderCon}>
              <View
                style={{
                  width: windowWidth * (60 / 100),
                }}>
                <Text style={styles.fontText2}>Select A Brand</Text>
              </View>
              <TouchableOpacity
                onPress={() => setBrandModal(false)}
                style={{ width: windowWidth * (10 / 100), padding: 10 }}>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: getFontontSize(20), }}>X</Text>
              </TouchableOpacity>
            </View>
            <View
              style={styles.modalSearchCon}>
              <TextInput
                style={styles.searchTextInput}
                placeholder={'Search'}
                placeholderTextColor={colours.primaryGrey}
                onChangeText={(text) => setBrandKeyword(text)}
                value={brandKeyword}
              />
            </View>
            <ScrollView
              contentContainerStyle={styles.modalScrollCon}>
              {brandData
                .filter((city) =>
                  city.make.toUpperCase().includes(brandKeyword.toUpperCase()),
                )
                .map((item, i) => (
                  <TouchableOpacity
                    style={styles.modalRow}
                    key={i}
                    onPress={() => {
                      loadBrandModel(item.make);
                      setBrandChoosen(item.make);
                      setBrandModal(false);
                      setBrandKeyword('');
                    }}>
                    <Text style={styles.modalRowText} numberOfLines={1}>
                      {item.make.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </Modal>
      )}

      {/* Model Selection */}
      
      {
        brandModelData && brandModelData.length > 0 && (
        <Modal animationType="fade" transparent={true} visible={brandModelModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalHeaderCon}>
              <View
                style={{
                  width: windowWidth * (60 / 100),
                }}>
                <Text style={styles.fontText2}>Select A Model</Text>
              </View>
              <TouchableOpacity
                onPress={() => setBrandModelModal(false)}
                style={{ width: windowWidth * (10 / 100), padding: 10 }}>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: getFontontSize(20), }}>X</Text>
              </TouchableOpacity>
            </View>
            <View
              style={styles.modalSearchCon}>
              <TextInput
                style={styles.searchTextInput}
                placeholder={'Search'}
                placeholderTextColor={colours.primaryGrey}
                onChangeText={(text) => setBrandModelKeyword(text)}
                value={brandModelKeyword}
              />
            </View>
            <ScrollView
              contentContainerStyle={styles.modalScrollCon}>
              {brandModelData
                .filter((obj) =>
                  obj.model.toUpperCase().includes(brandModelKeyword.toUpperCase()),
                )
                .map((item, i) => (
                  <TouchableOpacity
                    style={styles.modalRow}
                    key={i}
                    onPress={() => {
                      loadBrandModelVariant(item.model);
                      setBrandModelChoosen(item.model);
                      setBrandModelModal(false);
                      setBrandModelKeyword('');
                    }}>
                    <Text style={styles.modalRowText} numberOfLines={1}>
                      {item.model.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </Modal>
      )}

      {/* Variant Selection */}
      
      {
        brandModelVariantData && brandModelVariantData.length > 0 && (
        <Modal animationType="fade" transparent={true} visible={brandModelVariantModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalHeaderCon}>
              <View
                style={{
                  width: windowWidth * (60 / 100),
                }}>
                <Text style={styles.fontText2}>Select A Variant</Text>
              </View>
              <TouchableOpacity
                onPress={() => setBrandModelVariantModal(false)}
                style={{ width: windowWidth * (10 / 100), padding: 10 }}>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: getFontontSize(20), }}>X</Text>
              </TouchableOpacity>
            </View>
            <View
              style={styles.modalSearchCon}>
              <TextInput
                style={styles.searchTextInput}
                placeholder={'Search'}
                placeholderTextColor={colours.primaryGrey}
                onChangeText={(text) => setBrandModelVariantKeyword(text)}
                value={brandModelVariantKeyword}
              />
            </View>
            <ScrollView
              contentContainerStyle={styles.modalScrollCon}>
              {brandModelVariantData
                .filter((obj) =>
                  obj.variant.toUpperCase().includes(brandModelVariantKeyword.toUpperCase()),
                )
                .map((item, i) => (
                  <TouchableOpacity
                    style={styles.modalRow}
                    key={i}
                    onPress={() => {
                      // loadBrandModelVariant(item.variant);
                      setBrandModelVariantChoosen(item.variant);
                      setBrandModelVariantModal(false);
                      setBrandModelVariantKeyword('');
                    }}>
                    <Text style={styles.modalRowText} numberOfLines={1}>
                      {item.variant.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </Modal>
      )}



      {/* Type Selection */}
      
      {
        vehicleTypeData && vehicleTypeData.length > 0 && (
        <Modal animationType="fade" transparent={true} visible={vehicleTypeModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalHeaderCon}>
              <View
                style={{
                  width: windowWidth * (60 / 100),
                }}>
                <Text style={styles.fontText2}>Select A Type</Text>
              </View>
              <TouchableOpacity
                onPress={() => setVehicleTypeModal(false)}
                style={{ width: windowWidth * (10 / 100), padding: 10 }}>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: getFontontSize(20), }}>X</Text>
              </TouchableOpacity>
            </View>
            <View
              style={styles.modalSearchCon}>
              <TextInput
                style={styles.searchTextInput}
                placeholder={'Search'}
                placeholderTextColor={colours.primaryGrey}
                onChangeText={(text) => setVehicleTypeKeyword(text)}
                value={vehicleTypeKeyword}
              />
            </View>
            <ScrollView
              contentContainerStyle={styles.modalScrollCon}>
              {vehicleTypeData
                .filter((obj) =>
                  obj.vehTypeName.toUpperCase().includes(vehicleTypeKeyword.toUpperCase()),
                )
                .map((item, i) => (
                  <TouchableOpacity
                    style={styles.modalRow}
                    key={i}
                    onPress={() => {
                      // loadBrandModelVariant(item.variant);
                      setVehicleTypeChoosen(item);
                      setVehicleTypeModal(false);
                      setVehicleTypeKeyword('');
                    }}>
                    <Text style={styles.modalRowText} numberOfLines={1}>
                      {item.vehTypeName.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </Modal>
      )}


      {/* Fuel Type Selection */}
      
      {
        vehicleFuelTypeData && vehicleFuelTypeData.length > 0 && (
        <Modal animationType="fade" transparent={true} visible={vehicleFuelTypeModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalHeaderCon}>
              <View
                style={{
                  width: windowWidth * (60 / 100),
                }}>
                <Text style={styles.fontText2}>Select A Type</Text>
              </View>
              <TouchableOpacity
                onPress={() => setVehicleFuelTypeModal(false)}
                style={{ width: windowWidth * (10 / 100), padding: 10 }}>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: getFontontSize(20), }}>X</Text>
              </TouchableOpacity>
            </View>
            <View
              style={styles.modalSearchCon}>
              <TextInput
                style={styles.searchTextInput}
                placeholder={'Search'}
                placeholderTextColor={colours.primaryGrey}
                onChangeText={(text) => setVehicleFuelTypeKeyword(text)}
                value={vehicleFuelTypeKeyword}
              />
            </View>
            <ScrollView
              contentContainerStyle={styles.modalScrollCon}>
              {vehicleFuelTypeData
                .filter((obj) =>
                  obj.fuelTypeName.toUpperCase().includes(vehicleFuelTypeKeyword.toUpperCase()),
                )
                .map((item, i) => (
                  <TouchableOpacity
                    style={styles.modalRow}
                    key={i}
                    onPress={() => {
                      // loadBrandModelVariant(item.variant);
                      setVehicleFuelTypeChoosen(item);
                      setVehicleFuelTypeModal(false);
                      setVehicleFuelTypeKeyword('');
                    }}>
                    <Text style={styles.modalRowText} numberOfLines={1}>
                      {item.fuelTypeName.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </Modal>
      )}



      {/* Insurance Selection */}
      
      {
        vehicleInsuranceData && vehicleInsuranceData.length > 0 && (
        <Modal animationType="fade" transparent={true} visible={vehicleInsuranceModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalHeaderCon}>
              <View
                style={{
                  width: windowWidth * (60 / 100),
                }}>
                <Text style={styles.fontText2}>Select A Type</Text>
              </View>
              <TouchableOpacity
                onPress={() => setVehicleInsuranceModal(false)}
                style={{ width: windowWidth * (10 / 100), padding: 10 }}>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: getFontontSize(20), }}>X</Text>
              </TouchableOpacity>
            </View>
            <View
              style={styles.modalSearchCon}>
              <TextInput
                style={styles.searchTextInput}
                placeholder={'Search'}
                placeholderTextColor={colours.primaryGrey}
                onChangeText={(text) => setVehicleInsuranceKeyword(text)}
                value={vehicleInsuranceKeyword}
              />
            </View>
            <ScrollView
              contentContainerStyle={styles.modalScrollCon}>
              {vehicleInsuranceData
                .filter((obj) =>
                  obj.InsuranceTypeName.toUpperCase().includes(vehicleInsuranceKeyword.toUpperCase()),
                )
                .map((item, i) => (
                  <TouchableOpacity
                    style={styles.modalRow}
                    key={i}
                    onPress={() => {
                      // loadBrandModelVariant(item.variant);
                      setVehicleInsuranceChoosen(item);
                      setVehicleInsuranceModal(false);
                      setVehicleInsuranceKeyword('');
                    }}>
                    <Text style={styles.modalRowText} numberOfLines={1}>
                      {item.InsuranceTypeName.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </Modal>
      )}


      {/* Sate Selection */}
      
      {
        stateData && stateData.length > 0 && (
        <Modal animationType="fade" transparent={true} visible={stateModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalHeaderCon}>
              <View
                style={{
                  width: windowWidth * (60 / 100),
                }}>
                <Text style={styles.fontText2}>Select A Type</Text>
              </View>
              <TouchableOpacity
                onPress={() => setStateModal(false)}
                style={{ width: windowWidth * (10 / 100), padding: 10 }}>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: getFontontSize(20), }}>X</Text>
              </TouchableOpacity>
            </View>
            <View
              style={styles.modalSearchCon}>
              <TextInput
                style={styles.searchTextInput}
                placeholder={'Search'}
                placeholderTextColor={colours.primaryGrey}
                onChangeText={(text) => setStateKeyword(text)}
                value={stateKeyword}
              />
            </View>
            <ScrollView
              contentContainerStyle={styles.modalScrollCon}>
              {stateData
                .filter((obj) =>
                  obj.state.toUpperCase().includes(stateKeyword.toUpperCase()),
                )
                .map((item, i) => (
                  <TouchableOpacity
                    style={styles.modalRow}
                    key={i}
                    onPress={() => {
                      loadStateDistrict(item.state);
                      setStateChoosen(item.state);
                      setStateModal(false);
                      setStateKeyword('');
                    }}>
                    <Text style={styles.modalRowText} numberOfLines={1}>
                      {item.state.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </Modal>
      )}



      {/* District Selection */}
      
      {
        districtData && districtData.length > 0 && (
        <Modal animationType="fade" transparent={true} visible={districtModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalHeaderCon}>
              <View
                style={{
                  width: windowWidth * (60 / 100),
                }}>
                <Text style={styles.fontText2}>Select A Type</Text>
              </View>
              <TouchableOpacity
                onPress={() => setDistrictModal(false)}
                style={{ width: windowWidth * (10 / 100), padding: 10 }}>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: getFontontSize(20), }}>X</Text>
              </TouchableOpacity>
            </View>
            <View
              style={styles.modalSearchCon}>
              <TextInput
                style={styles.searchTextInput}
                placeholder={'Search'}
                placeholderTextColor={colours.primaryGrey}
                onChangeText={(text) => setDistrictKeyword(text)}
                value={districtKeyword}
              />
            </View>
            <ScrollView
              contentContainerStyle={styles.modalScrollCon}>
              {districtData
                .filter((obj) =>
                  obj.district.toUpperCase().includes(districtKeyword.toUpperCase()),
                )
                .map((item, i) => (
                  <TouchableOpacity
                    style={styles.modalRow}
                    key={i}
                    onPress={() => {
                      loadStateDistrictCity(item.district);
                      setDistrictChoosen(item.district);
                      setDistrictModal(false);
                      setDistrictKeyword('');
                    }}>
                    <Text style={styles.modalRowText} numberOfLines={1}>
                      {item.district.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </Modal>
      )}



      {/* City Selection */}
      
      {
        cityData && cityData.length > 0 && (
        <Modal animationType="fade" transparent={true} visible={cityModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalHeaderCon}>
              <View
                style={{
                  width: windowWidth * (60 / 100),
                }}>
                <Text style={styles.fontText2}>Select A Type</Text>
              </View>
              <TouchableOpacity
                onPress={() => setCityModal(false)}
                style={{ width: windowWidth * (10 / 100), padding: 10 }}>
                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: getFontontSize(20), }}>X</Text>
              </TouchableOpacity>
            </View>
            <View
              style={styles.modalSearchCon}>
              <TextInput
                style={styles.searchTextInput}
                placeholder={'Search'}
                placeholderTextColor={colours.primaryGrey}
                onChangeText={(text) => setCityKeyword(text)}
                value={cityKeyword}
              />
            </View>
            <ScrollView
              contentContainerStyle={styles.modalScrollCon}>
              {cityData
                .filter((obj) =>
                  obj.locName.toUpperCase().includes(cityKeyword.toUpperCase()),
                )
                .map((item, i) => (
                  <TouchableOpacity
                    style={styles.modalRow}
                    key={i}
                    onPress={() => {
                      setCityChoosen(item);
                      setCityModal(false);
                      setCityModal('');
                    }}>
                    <Text style={styles.modalRowText} numberOfLines={1}>
                      {item.locName.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </Modal>
      )}


      <SupportButton />
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:"center",
    backgroundColor: colours.backgroundColor,
  },
  headerCon: {
    width: windowWidth,
    height: windowHeight*(7/100),
    justifyContent:'center',
    paddingHorizontal: windowWidth*(5/100),
  },
  bottomButtonCon: {
    width: windowWidth,
    height: windowHeight*(5/100),
    paddingHorizontal: windowWidth*(5/100),
    marginTop: windowHeight*(2/100),
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  imageStyle: {
      width: windowWidth*(28/100),
      height: windowWidth*(28/100),
      borderWidth:1,
      borderColor:colours.lowRed,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center'
      
  },
  fontText1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(18),
    color: colours.primaryBlue
  },
  fontText2: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(12),
    color: colours.primaryBlue
  },
  fontText3: {
    color: colours.blue,
    fontFamily: 'Proxima Nova Alt Semibold',
    fontSize: getFontontSize(14),
  },


// Modal style


  centeredView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: '#0009',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: windowHeight*(10/100),
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    width: windowWidth * (85 / 100),
    paddingTop: 10,
  },
  modalSearchCon: {
    width: windowWidth * (85 / 100),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
  },
  searchTextInput: {
    width: '90%',
    height: windowHeight*(5/100),
    padding:0,
    justifyContent:'center',
    borderWidth: 1,
    color: colours.primaryBlack,
    borderColor: colours.primaryGrey,
    borderRadius:10,
    fontFamily: 'Proxima Nova Alt Semibold',
    paddingHorizontal: 10
  },
  modalScrollCon: {
    backgroundColor: '#fff',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    padding: 30,
    paddingTop: 10,
    alignItems: 'center',
    width: windowWidth * (85 / 100),
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
  },
  modalRow: {
    padding: 10,
    borderBottomColor: colours.primaryGrey,
    borderBottomWidth: 1,
  },
  modalRowText: {
    padding: 5,
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(14),
    width: windowWidth * (62 / 100),
  },


  textInput: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    marginTop: '5%',
    paddingHorizontal: '8%',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 7,
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(14),
    borderColor: colours.lightBlue,
    shadowColor: colours.lightBlue,
    width: (windowWidth * 90) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: windowWidth * (13 / 100),
    borderRadius: 20,
    alignItems: 'center',
  },
  error: {
    color: colours.primaryRed,
    marginTop: '2%',
    textAlign:'right',
    width: (windowWidth * 86) / 100,
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontontSize(11),
  },

  // Radio Button style


  RadioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colours.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  checkedButton: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colours.blue,
  },
});

export default AddVehicle;


//Custom Dropdown
const Dropdown = ({ State, OnPress, Error }) => {
  return (
    <Pressable onPress={OnPress} style={{alignItems: 'flex-start'}}>
      {/* <Text />
      <Text style={styles.fontText2}>Heading</Text> */}
      <View style={styles.textInput}>
        <Text
          style={[
            {
              fontFamily: 'Poppins-SemiBold',
              fontSize: getFontontSize(14),
              color: '#9aa0a6',
            },
            State == 'STATE' || State == 'DISTRICT' || State == 'CITY'
              ? { color: colours.lightBlue }
              : { color: colours.primaryBlack },
          ]}>
          {State.toUpperCase()}
        </Text>
        <Text style={{transform: [{rotate: '270deg'}]}}>{showIcon('downArrow', colours.lightBlue, 18)}</Text>
      </View>
      {Error && <Text style={[styles.error]}>*Required</Text>}
    </Pressable>
  );
};

//Custom RadioButton
const CustomRadioButton = ({ state, OnPress, TextValue }) => {
  return (
    <TouchableOpacity
      onPress={OnPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '3%',
      }}>
      <View
        style={styles.RadioButton}>
        <View style={state === true ? styles.checkedButton : ''} />
      </View>
      <Text style={styles.fontText2}>  {TextValue}</Text>
    </TouchableOpacity>
  );
};
