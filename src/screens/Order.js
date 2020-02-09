import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, TextInput, FAB } from 'react-native-paper';
import Header from '../components/Header';
import Bottom from '../components/Bottom';

function Order({ navigation }) {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteValue, setNoteValue] = useState('');

  function onSaveNote() {
    navigation.state.params.addNote({ noteTitle, noteValue })
    navigation.goBack()
  };

  return (
    <>
      <Header titleText='주문조회' navigation={navigation} />
      <IconButton
        icon='close'
        size={25}
        color='white'
        onPress={() => navigation.goBack()}
        style={styles.iconButton}
      />
      <View style={styles.container}>
        
      </View>
      <Bottom />
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  iconButton: {
    position: 'absolute',
    right: 0,
    top: 40,
    margin: 10
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  text: {
    height: 300,
    fontSize: 16
  },
  fab: {
    position:'absolute',
    right: 30,
    bottom: 70,
    backgroundColor: '#1E388D'
  }
})

export default Order;