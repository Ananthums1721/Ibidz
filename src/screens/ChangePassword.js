import { View, Text, SafeAreaView, ScrollView, StyleSheet, Dimensions } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import { LoaderContext } from '../Context/loaderContext';
import LoginTextInput from '../components/LoginTextInput';
import AuthButton from '../components/AuthButton';
import { changepassword } from '../api';
import { AppContext } from '../Context/appContext';
// import Toast from 'react-native-simple-toast';
import Toast from 'react-native-toast-message'
import colours from '../globals/colours';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ChangePassword = ({ navigation }) => {

  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [oldPasswordError, setOldPasswordError] = React.useState(false);
  const [newPasswordError, setNewPasswordError] = React.useState(false);
  const [conPasswordError, setConPasswordError] = React.useState(false);
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = React.useState(
    false,
  );
  const [conPasswordErrorMessage, setConPasswordErrorMessage] = React.useState(
    false,
  );
  const [oldPasswordErrorMessage, setOldPasswordErrorMessage] = React.useState(
    false,
  );
  const { showLoader, } = React.useContext(LoaderContext);
  const { profile } = useContext(AppContext);

  const oldPasswordHandler = (textEnterd) => {
    setOldPassword(textEnterd);
    setOldPasswordError(false);
  };
  const newPasswordHandler = (textEnterd) => {
    setNewPassword(textEnterd);
    setNewPasswordError(false);
    if (textEnterd.length < 6) {
      setNewPasswordErrorMessage(
        'Minimum 6 Characters Required',
      );
      setNewPasswordError(true);
    } else if (oldPassword === textEnterd) {
      setNewPasswordErrorMessage(`Can't Use Current Password`);
      setNewPasswordError(true);
    }
  };
  const confirmPasswordHandler = (textEnterd) => {
    setConfirmPassword(textEnterd);
    setConPasswordError(false);
    if (textEnterd !== newPassword) {
      setConPasswordErrorMessage('Password Does not Match');
      setConPasswordError(true);
    }
  };
  const formHandler = async () => {
    let OldPasswordError = oldPassword === null;
    let NewPasswordError = newPassword === null;
    let ConfirmPasswordError = confirmPassword === null;

    if (!(OldPasswordError || NewPasswordError || ConfirmPasswordError)) {
      _changePassword();
    }
  };

  const _changePassword = async () => {
    if (oldPassword === '') {
      setOldPasswordErrorMessage('Required');
      setOldPasswordError(true);
    } else if (newPassword.length < 6) {
      setNewPasswordErrorMessage(
        'Minimum 6 Characters Required',
      );
      setNewPasswordError(true);
    } else if (oldPassword === newPassword) {
      setNewPasswordErrorMessage(`Can't Use Current Password`);
      setNewPasswordError(true);
    } else if (confirmPassword !== newPassword) {
      setConPasswordErrorMessage('Password Does not Match');
      setConPasswordError(true);
    } else {
      try {
        showLoader(true);
        let res = await changepassword({
          sp: "changePassword",
          custId: profile[0]?.customerId,
          currentPassword: oldPassword,
          newPassword: confirmPassword
        }
        );
        if (res) {
          Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Password Changed Successfully'
          })
          navigation.goBack();
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }
        showLoader(false);
      } catch (err) {
        showLoader(false);
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: err?.Message ? err?.Message : 'Something went wrong'
        })
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header backarrow title={'Change Password'} navigation={navigation} />
      <View style={{
        flex: 1, padding: windowWidth * (5 / 100), alignItems: 'center',
        justifyContent: 'center'
      }}>
        <LoginTextInput
          OnChangeText={oldPasswordHandler}
          Width={90}
          Placeholder={'Old Password'}
          Value={oldPassword}
          Error={oldPasswordError}
          ErrorText={oldPasswordErrorMessage}
          Height={windowWidth * (14 / 100)}
          secureEntry
          Icon={'lock'}
        />
        <LoginTextInput
          OnChangeText={newPasswordHandler}
          Width={90}
          Placeholder={'New Password'}
          Value={newPassword}
          Error={newPasswordError}
          ErrorText={newPasswordErrorMessage}
          Height={windowWidth * (14 / 100)}
          secureEntry
          Icon={'lock'}
        />
        <LoginTextInput
          OnChangeText={confirmPasswordHandler}
          Width={90}
          Placeholder={'Confirm Password'}
          Value={confirmPassword}
          Error={conPasswordError}
          ErrorText={conPasswordErrorMessage}
          Height={windowWidth * (14 / 100)}
          secureEntry
          Icon={'lock'}
        />
        <Text />
        <AuthButton
          ButtonText={'Change Password'}
          ButtonWidth={90}
          OnPress={formHandler}
        />
      </View>
    </SafeAreaView>
  )
}

export default ChangePassword
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.backgroundColor,
    alignItems: "center",
  },
})