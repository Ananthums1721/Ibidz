import React, { Component } from 'react';
import { StatusBar, Alert, Linking, StyleSheet, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigators/RootNavigator';
import { AppContextProvider } from './src/Context/appContext';
import { LoaderContextProvider } from './src/Context/loaderContext';
// import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import OneSignal from 'react-native-onesignal';
import { getFontontSize } from './src/globals/functions';
import Toast from 'react-native-toast-message';

const App = () => {




  React.useEffect(() => {
    
    OneSignal.setLogLevel(6, 0);
    // OneSignal.setAppId("44f7a02a-7b02-40b5-a272-4d78df3c2f40");      <-- test
    OneSignal.setAppId("3113670d-7fbb-4d68-9a34-5f8b7e1e1fa1");
          
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      console.log("Prompt response:", response);
    });
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
      console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
      let notification = notificationReceivedEvent.getNotification();
      console.log("notification: ", notification);
      const data = notification.additionalData
      console.log("additionalData: ", data);
      const button1 = {
        text: "Cancel",
        onPress: () => { notificationReceivedEvent.complete(); },
        style: "cancel"
      };
      const button2 = { text: "Complete", onPress: () => { notificationReceivedEvent.complete(notification); }};
      // Alert.alert("Complete notification?", "Test", [ button1, button2], { cancelable: true });
    });
    
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log("OneSignal: notification opened:", notification);
    });
    // const deviceState = await OneSignal.getDeviceState();

    // this.setState({
    //     isSubscribed : deviceState.isSubscribed
    // });
  }, []
);



  return (
    <AppContextProvider>
      <LoaderContextProvider>
        <MyStatusBar backgroundColor='#313131' barStyle="light-content" />
          <NavigationContainer>
            <RootNavigator />
            <Toast />
        </NavigationContainer>
      </LoaderContextProvider>
    </AppContextProvider>
  );
};

export default App;


const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);


const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: '#d40086',
    height: APPBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: '#d40086',
  },
});