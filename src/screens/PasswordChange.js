import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Header from '../components/Header';
import Bottom from '../components/Bottom';

function PasswordChange({ navigation }) {
  const handleChange = () => {
    Alert.alert('','비밀번호가 변경되었습니다.',[{text:'OK', onPress: ()=> navigation.goBack()}]);
  }

  return (
    <>
      <Header titleText='비밀번호 변경' navigation={navigation}/>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={{ backgroundColor: '#fff', flex: 1 }}
        />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TextInput
          label='기존 비밀번호'
          style={styles.input}
          theme={{ colors }}
        />
        <TextInput
          label='신규 비밀번호'
          style={styles.input}
          theme={{ colors }}

        />
        <TextInput
          label='비밀번호 확인'
          style={styles.input}
          theme={{ colors }}

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