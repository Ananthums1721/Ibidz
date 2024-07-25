import React, { createContext, useState } from 'react';
import { Dimensions } from 'react-native';
import { Modal, View, ActivityIndicator } from 'react-native';
import colours from '../globals/colours';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export const LoaderContext = createContext();

export const LoaderContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = (show) => {
    setLoading(show);
  };
  const value = {
    showLoader,
    loading,
  };

  return (
    <>
      <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
      {loading && (
        <Modal transparent visible={loading}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,.5)',
            }}>
              <View style={{backgroundColor:colours.primaryWhite, borderRadius:5, padding:10, elevation:5}}>
                <ActivityIndicator size="large" color={colours.lightRed} />
              </View>
          </View>
        </Modal>
      )}
    </>
  );
};
