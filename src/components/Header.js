import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { resetMessage, clearMessage } from '../redux/messagesApp';
import { Appbar, Title } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

function Header({ titleText, navigation, main,  }) {
  const dispatch = useDispatch()
  const first = () => dispatch(resetMessage())
  const clearChat = () => dispatch(clearMessage())

  return (
    <Appbar.Header style={styles.headerContainer}>
      <TouchableOpacity onPress={()=> {main ? first() : navigation.navigate('Main')}}>
        <Image
          source={require('../../assets/dabdori-icon.png')}
          resizeMode="contain"
          style={styles.logo}
        />
      </TouchableOpacity>
      <View style={styles.container}>
        <Title style={styles.title}
          onPress={()=>clearChat()}
        >{titleText}</Title>
      </View>
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
  title: {
    color: '#FFF',
    marginLeft: -45,
    fontSize: 23,
    fontWeight: 'bold'
  },
  logo: {
    width: 40,
    marginLeft: 10
  }
});

export default Header;