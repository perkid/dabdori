import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert, AsyncStorage } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { changePassRequest, changePass } from '../redux/authentication'
import Header from '../components/Header';
import Bottom from '../components/Bottom';

function PasswordChange({ navigation }) {
  const userInfo = navigation.state.params;
  const dispatch = useDispatch();
  const [newPass, setNewPass] = useState('');
  const [checkPass, setCheckPass] = useState('');
  const status = useSelector(state => state.authentication.passChg.status, []);
  const handleChange = () => {
    if (newPass !== checkPass) {
      Alert.alert('', '비밀번호가 일치하지 않습니다.', [{ text: 'ok' }])
    }
    if (newPass === '' || checkPass === '') {
      Alert.alert('', '비밀번호가 입력되지 않았습니다.', [{ text: 'ok' }])
    }
    if (newPass !== '' && newPass === checkPass) {
      dispatch(changePassRequest(userInfo.user_id, newPass))
    }
  }
  if (status === 'SUCCESS') {
    AsyncStorage.clear()
    let user = {
      email: userInfo.user_id,
      pass: newPass
    }
    let data = JSON.stringify(user);
    dispatch(changePass())
    AsyncStorage.setItem("AUTH", data, () => {
      Alert.alert('', '비밀번호가 변경되었습니다.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    })
  }
  return (
    <>
      <Header titleText='비밀번호 변경' navigation={navigation} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={{ backgroundColor: '#fff', flex: 1 }}
        />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <TextInput
            label='신규 비밀번호'
            style={styles.input}
            theme={{ colors }}
            value={newPass}
            secureTextEntry={true}
            onChangeText={text => setNewPass(text)}
          />
          <TextInput
            label='비밀번호 확인'
            style={styles.input}
            theme={{ colors }}
            value={checkPass}
            secureTextEntry={true}
            onChangeText={text => setCheckPass(text)}
          />
          <Button
            mode='contained'
            style={styles.button}
            onPress={() => handleChange()
            }
            labelStyle={{ fontWeight: 'bold', fontSize: 18 }}
          >
            비밀번호 변경
        </Button>
        </View>
      </TouchableWithoutFeedback>
      <Bottom />
    </>
  )
};

const colors = {
  Text: '#000000',
  primary: '#1E388D',
  underlineColor: 'transparent',
}
const styles = StyleSheet.create({
  container: {
    flex: 5,
    backgroundColor: '#FFF',
    alignItems: 'center'
  },
  input: {
    width: '85%',
    backgroundColor: '#FFF',
    margin: 20
  },
  button: {
    backgroundColor: '#1E388D',
    width: '80%',
    marginTop: 40,
    padding: 5
  },
})

export default PasswordChange;