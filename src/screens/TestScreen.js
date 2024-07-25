import React from 'react';
import {SafeAreaView, StyleSheet, View, Text, StatusBar} from 'react-native';

const TestScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d40086',
    alignItems:'center',
    justifyContent:'flex-end',
    paddingBottom: 50,
    flex: 1,
  },
});

export default TestScreen;