import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { resetMessage, clearMessage } from '../redux/messagesApp';
import { Appbar, Title, IconButton } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

function Header({ titleText, navigation, main, handleOptionReset }) {
  const dispatch = useDispatch()
  const first = () => {
    handleOptionReset()
    dispatch(resetMessage())
  }
  const clearChat = () => {
    handleOptionReset()
    dispatch(clearMessage())
  }
  return (
    <Appbar.Header style={styles.headerContainer}>
      <TouchableOpacity onPress={() => { main ? first() : navigation.navigate('Main') }}>
        <Image
          source={require('../../assets/dabdori-icon.png')}
          resizeMode="contain"
          style={styles.logo}
        />
      </TouchableOpacity>
      <View style={styles.container}>
        <Title style={main?styles.mainTitle:styles.title}
          onPress={() => { main ? clearChat() : navigation.navigate('Main') }}
        >{titleText}</Title>
      </View>
      {main ? undefined : <IconButton
        icon='close'
        size={25}
        color='white'
        onPress={() => navigation.goBack()}
      />}
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
  logo: {
    width: 40,
    marginLeft: 10
  }
});

export default Header;