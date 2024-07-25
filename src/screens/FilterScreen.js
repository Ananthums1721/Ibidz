
import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    FlatList
} from 'react-native';
import { getFontontSize } from '../globals/functions';
import Header from '../components/Header';
import colours from '../globals/colours';
import AuthButton from '../components/AuthButton';
import CheckBox from 'react-native-check-box';
import SupportButton from '../components/SupportButton';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function FilterScreen({ navigation, route }) {
    let { onGoback, filterData } = route.params;

    const [selectedAttribute, setSelectedAttribute] = React.useState("VehicleBrand");
    const [selectedSort, setSelectedSort] = React.useState('');
    const [Data, setData] = React.useState(filterData);
    const [selectedValues, setSelectedValues] = React.useState({
        brand: '',
        model: '',
        location: '',
        clocked: '',
        year: ''
    });
    const [dummy, setDummy] = React.useState(false);
    const [selectedItems, setSelectedItems] = useState('');


    const toggleItem = (itemId) => {
        if(selectedItems.includes(itemId)){
            let value = selectedItems.split(`${itemId}, `).join('').split(`${itemId}`).join('');
            setSelectedItems(value),
            selectedValues.brand = value,
            setSelectedValues(selectedValues),
            setDummy(!dummy)
        } else{
            if( selectedItems == ""){
                let value = `${itemId}`
                setSelectedItems(value),
                selectedValues.brand = value,
                setSelectedValues(selectedValues),
                setDummy(!dummy)
            } else{
                let value = `${selectedItems}, ${itemId}`
                setSelectedItems(value),
                selectedValues.brand = value,
                setSelectedValues(selectedValues),
                setDummy(!dummy)
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
            <Header navigation={navigation} backarrow />
            <View style={{ flexDirection: 'row', width: windowWidth, flex: 1, }}>
                <View style={{ width: windowWidth * (30 / 100), backgroundColor: colours.lightWhite }}>
                    <TouchableOpacity onPress={() => setSelectedAttribute("VehicleBrand")} style={{ height: windowHeight * (6 / 100), paddingLeft: 15, justifyContent: 'center', backgroundColor: selectedAttribute == 'VehicleBrand' ? colours.lightGrey : colours.lowWhite }}>
                        <Text style={styles.headerText}>Vehicle Brand</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedAttribute("VehicleModal")} style={{ height: windowHeight * (6 / 100), paddingLeft: 15, justifyContent: 'center', backgroundColor: selectedAttribute == 'VehicleModal' ? colours.lightGrey : colours.lowWhite }}>
                        <Text style={styles.headerText}>Vehicle Modal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedAttribute("Location")} style={{ height: windowHeight * (6 / 100), paddingLeft: 15, justifyContent: 'center', backgroundColor: selectedAttribute == 'Location' ? colours.lightGrey : colours.lowWhite }}>
                        <Text style={styles.headerText}>Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedAttribute("clocked")} style={{ height: windowHeight * (6 / 100), paddingLeft: 15, justifyContent: 'center', backgroundColor: selectedAttribute == 'clocked' ? colours.lightGrey : colours.lowWhite }}>
                        <Text style={styles.headerText}>km Clocked</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedAttribute("year")} style={{ height: windowHeight * (6 / 100), paddingLeft: 15, justifyContent: 'center', backgroundColor: selectedAttribute == 'year' ? colours.lightGrey : colours.lowWhite }}>
                        <Text style={styles.headerText}>Year of Make</Text>
                    </TouchableOpacity>

                </View>
                <View style={{ width: windowWidth * (40 / 100), }}>
                    {
                        selectedAttribute == 'VehicleBrand' && (
                            <>
                                <FlatList
                                    contentContainerStyle={{ paddingBottom: 50 }}
                                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                                    showsHorizontalScrollIndicator={false}
                                    data={Data.brands}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.itemContainer2}>
                                            <CheckBox
                                                isChecked={selectedItems.includes(item.brandName)}
                                                onClick={() => toggleItem(item.brandName)}
                                            />

                                            <Text style={[styles.headerText]}>
                                                {item?.brandName}
                                            </Text>
                                        </TouchableOpacity>
                                    )} />

                            </>
                        )
                    }

                    {
                        selectedAttribute == 'VehicleModal' && (
                            <>
                                <FlatList
                                    contentContainerStyle={{ paddingBottom: 50 }}
                                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                                    showsHorizontalScrollIndicator={false}
                                    data={Data.models}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.itemContainer2} onPress={() => {
                                                selectedValues.model = item?.modelName,
                                                setSelectedValues(selectedValues),
                                                setDummy(!dummy)
                                        }}>
                                            <CustomRadioButton
                                                state={selectedValues.model == item?.modelName ? true : false}
                                            />
                                            <Text style={[styles.headerText]}>
                                                {item?.modelName}
                                            </Text>
                                        </TouchableOpacity>
                                    )} />
                            </>
                        )
                    }

                    {
                        selectedAttribute == 'Location' && (
                            <>
                                <FlatList
                                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                                    showsHorizontalScrollIndicator={false}
                                    data={Data.locationIds}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.itemContainer2} onPress={() => {
                                            selectedValues.location = item?.locid,
                                                setSelectedValues(selectedValues),
                                                setDummy(!dummy)
                                        }}>
                                            <CustomRadioButton
                                                state={selectedValues.location == item?.locid ? true : false}
                                            />
                                            <Text style={[styles.headerText]}>
                                                {item?.locName}
                                            </Text>
                                        </TouchableOpacity>
                                    )} />
                            </>
                        )
                    }

                    {
                        selectedAttribute == 'clocked' && (
                            <>
                                <FlatList
                                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                                    showsHorizontalScrollIndicator={false}
                                    data={Data.kmClocked}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.itemContainer2} onPress={() => {
                                            selectedValues.clocked = item?.kmClocked,
                                                setSelectedValues(selectedValues),
                                                setDummy(!dummy)
                                        }}>
                                            <CustomRadioButton
                                                state={selectedValues.clocked == item?.kmClocked ? true : false}
                                            />
                                            <Text style={[styles.headerText]}>
                                                {item?.kmClocked}
                                            </Text>
                                        </TouchableOpacity>
                                    )} />
                            </>
                        )
                    }

                    {

                        selectedAttribute == 'year' && (
                            <>
                                <FlatList
                                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                                    showsHorizontalScrollIndicator={false}
                                    data={Data.yearOfMake}
                                    // ListEmptyComponent={}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.itemContainer2} onPress={() => {
                                            selectedValues.year = item?.manYear,
                                                setSelectedValues(selectedValues),
                                                setDummy(!dummy)
                                        }}>
                                            <CustomRadioButton
                                                state={selectedValues.year == item?.manYear ? true : false}
                                            />
                                            <Text style={[styles.headerText]}>
                                                {item?.manYear}
                                            </Text>
                                        </TouchableOpacity>
                                    )} />
                            </>
                        )

                    }



                </View>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    width: windowWidth * (94 / 100)
                }}>
                <AuthButton
                    BackgroundColor={colours.primaryGrey}
                    OnPress={() => {
                        onGoback({
                            brands: "",
                            models: "",
                            locationIds: "",
                            kmClocked: "",
                            yearOfMake: ""
                        });
                        navigation.goBack();
                    }}
                    ButtonText={'Clear'}
                    ButtonWidth={30}
                    ButtonHeight={5}
                />
                <Text>{"  "}</Text>
                <AuthButton
                    BackgroundColor={colours.primaryBlue}
                    OnPress={() => {
                        onGoback({
                            brands: selectedValues.brand,
                            models: selectedValues.model,
                            locationIds: selectedValues.location,
                            kmClocked: selectedValues.clocked,
                            yearOfMake: selectedValues.year
                        });
                        navigation.goBack();
                    }}

                    ButtonText={'Apply'}
                    ButtonWidth={30}
                    ButtonHeight={5}
                />
            </View>
            <SupportButton />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        backgroundColor: colours.backgroundColor,
    },
    headerText: {
        fontFamily: 'Poppins-Semibold',
        fontSize: getFontontSize(13),
        color: colours.primaryBlack
    },
    itemContainer2: {
        paddingLeft: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    fontStyle3: {
        color: colours.primaryBlack,
        fontSize: getFontontSize(18),
        fontFamily: 'Poppins-Bold',
    },
    RadioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colours.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },
    checkedButton: {
        width: 14,
        height: 14,
        borderRadius: 14,
        backgroundColor: colours.primaryColor
    },
});

const customMarker = () => (
    <View
        style={{
            width: 22,
            height: 22,
            borderColor: colours.primaryGrey,
            borderWidth: 1,
            borderRadius: 12,
            marginTop: 5,
        }}>
        <View
            style={{
                backgroundColor: colours.primaryBlue,
                width: 20,
                height: 20,
                borderColor: colours.primaryWhite,
                borderWidth: 6,
                borderRadius: 10,
            }}
        />
    </View>
);



//Custom RadioButton
const CustomRadioButton = ({ state, check_button, un_check_button, onPress }) => {

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}>
            <View
                style={styles.RadioButton}
            // onPress={state === false ? check_button : un_check_button}
            >
                <View style={state === true ? styles.checkedButton : ''} />
            </View>
        </View>
    );
};