import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    OnPress,
} from 'react-native';
import colours from '../globals/colours';
import showIcon from '../globals/icons';
import { AppContext } from '../Context/appContext';
import CountDown from 'react-native-countdown-component';
import moment from 'moment/moment';
import { getFontontSize } from '../globals/functions';

const windowWidth = Dimensions.get('window').width;

export default function TimerCard({
    DealTo,
    FSize,
    width,
}) {
    
    const [totalDuration, setTotalDuration] = React.useState(0);
    const timerData = () => {
        let date =
            moment()
                .utcOffset('+05:30')
                .format('YYYY-MM-DD HH:mm:ss');
        // let expirydate = '2020-11-14 20:28:45';
        let expirydate = moment(DealTo)
            .utcOffset('+05:30')
            .format();

        let diffr =
            moment
                .duration(moment(expirydate)
                    .diff(moment(date)));
        var hours = parseInt(diffr.asHours());
        var minutes = parseInt(diffr.minutes());
        var seconds = parseInt(diffr.seconds());
        var d = hours * 60 * 60 + minutes * 60 + seconds;
        setTotalDuration(d);
    }
    React.useMemo(() => {
        timerData();
    }, [totalDuration]);
    return (
        <View style={styles.timerContainer}>
            {
                totalDuration > 0 ? (
                    <View style={{paddingHorizontal:10, paddingVertical:5, flexDirection:'row'}}>
                        <View style={styles.singleCon}>
                            <Text style={[styles.fontStyle2,{fontSize: getFontontSize(FSize?FSize:10)}]}>D</Text>
                            <CountDown
                                until={totalDuration}
                                size={FSize?FSize:10}
                                digitStyle={{ width:FSize?getFontontSize(26):getFontontSize(19) }}
                                digitTxtStyle={{ color: totalDuration <300? colours.primaryRed : colours.primaryBlack ,}}
                                timeToShow={['D']}
                                timeLabels={{d:null,h:null,m:null, s:null }}
                                timeLabelStyle={{color:colours.primaryBlack, fontSize:FSize?18:12}}
                            />
                        </View>
                        <View style={styles.singleCon}>
                            <Text style={[styles.fontStyle2,{fontSize: getFontontSize(FSize?FSize:10)}]}>H</Text>
                            <CountDown
                                until={totalDuration}
                                size={FSize?FSize:10}
                                digitStyle={{ width:FSize?26:19 }}
                                digitTxtStyle={{ color: totalDuration <300? colours.primaryRed : colours.primaryBlack ,}}
                                timeToShow={['H']}
                                timeLabels={{d:null,h:null,m:null, s:null }}
                                timeLabelStyle={{color:colours.primaryBlack, fontSize:FSize?18:12}}
                            />
                        </View>
                        <View style={styles.singleCon}>
                            <Text style={[styles.fontStyle2,{fontSize: getFontontSize(FSize?FSize:10)}]}>M</Text>
                            <CountDown
                                until={totalDuration}
                                size={FSize?FSize:10}
                                digitStyle={{ width:FSize?26:19 }}
                                digitTxtStyle={{ color: totalDuration <300? colours.primaryRed : colours.primaryBlack ,}}
                                timeToShow={['M']}
                                timeLabels={{d:null,h:null,m:null, s:null }}
                                timeLabelStyle={{color:colours.primaryBlack, fontSize:FSize?18:12}}
                            />
                        </View>
                        <View style={styles.singleCon}>
                            <Text style={[styles.fontStyle2,{fontSize: getFontontSize(FSize?FSize:10)}]}>S</Text>
                            <CountDown
                                until={totalDuration}
                                size={FSize?FSize:10}
                                digitStyle={{ width:FSize?26:19, padding:0 }}
                                digitTxtStyle={{ color: totalDuration <300? colours.primaryRed : colours.primaryBlack ,}}
                                timeToShow={['S']}
                                timeLabels={{d:null,h:null,m:null, s:null }}
                                timeLabelStyle={{color:colours.primaryBlack, fontSize:FSize?18:12}}
                            />
                        </View>
                    </View>
                ) :
                 <Text>{moment(DealTo).format('DD-MM-YYYY')}</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        //marginTop: '6%',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 2
    },
    fontStyle2: {
        fontFamily: 'Poppins-Medium',
        fontSize: 10,
        marginLeft: '5%',
        marginRight: '5%',
        color: colours.primaryBlack,
    },
    timerContainer: {
        height: windowWidth * (5 / 100),
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'flex-start',
        marginBottom: 5,
    },
    singleCon:{
        // flexDirection: 'row',
        justifyContent:'center', 
        alignItems:'center',
    }

});