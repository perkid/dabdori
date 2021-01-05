import React, { useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { resetMessage, clearMessage } from '../redux/messagesApp';
import { Appbar, Title, IconButton, Drawer } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

function Header({ titleText, navigation, main, handleOptionReset, auth, app }) {

  const userInfo = useSelector(state => state.authentication.user);

  const dispatch = useDispatch()

  const first = () => {
    handleOptionReset()
    dispatch(resetMessage(userInfo.role))
  }
  const clearChat = () => {
    handleOptionReset()
    dispatch(clearMessage(userInfo.dabdoriText.welcome_text, userInfo.role))
  }

  return (
    <Appbar.Header style={styles.headerContainer}>
      <TouchableOpacity onPress={() => { main ? first() : navigation.goBack() }}>
        <Image
          source={require('../../assets/dabdori-icon.png')}
          resizeMode="contain"
          style={styles.logo}
        />
      </TouchableOpacity>
      <View style={styles.container}>
        <Title style={app?styles.appTitle:auth?styles.mainTitle:main?styles.mainTitle:styles.title}
          onPress={() => { main ? clearChat() : navigation.goBack() }}
        >{titleText}</Title>
        
      </View>
      {auth? undefined : main ? undefined : <IconButton
        icon='close'
        size={25}
        color='white'
        onPress={() => navigation.goBack()}
      />}
      {
        app?
          <IconButton
        icon='menu'
        size={30}
        color='#1E388D'
      />
        :undefined
      }
      
    </Appbar.Header>
  )
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#1E388D'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainTitle: {
    color: '#FFF',
    fontSize: 23,
    marginLeft: -45,
    fontWeight: 'bold'
  },
  title: {
    color: '#FFF',
    fontSize: 23,
    fontWeight: 'bold'
  },
  appTitle: {
    color: '#FFF',
    marginLeft:10,
    fontSize: 23,
    fontWeight: 'bold'
  },
  logo: {
    width: 40,
    marginLeft: 10
  },
  icon:{
    height:25,
    width:25
  },
});

export default Header;