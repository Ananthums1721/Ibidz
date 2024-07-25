import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import colours from '../globals/colours';
import { showIcon } from '../globals/icons';
import { getFontontSize } from '../globals/functions';
import LinearGradient from 'react-native-linear-gradient';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Header = ({
    logo,
    backarrow,
    drawer,
    navigation,
    title,
}) => {
    return (
    <View 
      style={{
        width: windowWidth,
        height: windowHeight*(7/100),
        paddingHorizontal: windowWidth*(5/100),
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomLeftRadius:30,
        borderBottomRightRadius:30,
        justifyContent: "space-between",
        backgroundColor: colours.darkBlack
    }}>
            <View 
                style={{
                    width: windowWidth*(15/100),
                    height: windowWidth*(15/100),
                    alignItems:'flex-start',
                    justifyContent: 'center',
                }}
            >
                {backarrow ?
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View>{showIcon('arrow-back', colours.primaryWhite, 20)}</View>
                    </TouchableOpacity>
                    :
                    null
                }
            </View>
            <View
                style={{
                    width: windowWidth*(60/100),
                    height: windowWidth*(15/100),
                    alignItems:'center',
                    justifyContent: 'center',
                }}
            >
            {logo && !title ?
                <Image style={
                    {
                        width: windowWidth * (30 / 100),
                        height: windowWidth * (10 / 100),
                        resizeMode: "contain",
                    }} source={require('../asset/logo/LogoW.png')} />
                :
                null}

            {title && !logo ?
                <Text style={{ 
                        color: colours.primaryWhite,
                        fontFamily: 'Poppins-Bold',
                        fontSize: getFontontSize(18),
                    }}>{title}</Text>
                :
                null}

            </View>

            <View 
                style={{
                    width: windowWidth*(15/100),
                    height: windowWidth*(15/100),
                    alignItems:'flex-end',
                    justifyContent: 'center',
                }}
            >
            {drawer ?
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()}>
                    <View>{showIcon('menu', colours.primaryWhite, 20)}</View>
                </TouchableOpacity>
                : 
                null
            }
            </View>
        </View>
    )
}

export default Header