import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { IconButton, DataTable } from 'react-native-paper';
import Header from '../components/Header';
import Bottom from '../components/Bottom';

function MyPage({ navigation }) {
  const dapuser = navigation.state.params;

  return (
    <>
      <Header titleText='마이페이지' navigation={navigation} />
      <IconButton
        icon='close'
        size={25}
        color='white'
        onPress={() => navigation.goBack()}
        style={styles.iconButton}
      />
      <View style={styles.container}>
        <Text style={styles.info}>
          안녕하세요 {dapuser.company}{'\n'}
          {dapuser.name} 님{'\n'}
        </Text>
      </View>
      <View style={styles.menu}>
        <DataTable>
          <DataTable.Row>
            <DataTable.Cell style={{ marginLeft: 5 }}>
              <Text style={styles.tableText}>
                아이디
              </Text>
            </DataTable.Cell>
            <DataTable.Title>{dapuser.id}</DataTable.Title>
          </DataTable.Row>
          <DataTable.Row onPress={() => navigation.navigate('PasswordChange')}>
            <DataTable.Cell style={{ marginLeft: 5 }}>
              <Text style={styles.tableText}>
                비밀번호 변경
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric={true}>
              >
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row onPress={() => navigation.navigate('Auth')}>
            <DataTable.Cell style={{ marginLeft: 5 }}>
              <Text style={styles.tableText}>
                로그아웃
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric={true}>
              >
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>
      <Bottom />
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E388D',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  info: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 30
  },
  menu: {
    flex: 4,
    backgroundColor: '#FFF'
  },
  iconButton: {
    position: 'absolute',
    right: 0,
    top: 40,
    margin: 10
  },
  tableText: {
    fontSize: 17
  }

})

export default MyPage;